importScripts("/src/schema.js", "/src/parser.js", "/src/storage.js");

const SAVE_DRAFT_MENU_ID = "ai-glossary-kit-capture-selection";
const IMPORT_CARD_MENU_ID = "ai-glossary-kit-import-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: SAVE_DRAFT_MENU_ID,
      title: "Save selected text as draft term",
      contexts: ["selection"]
    });
    chrome.contextMenus.create({
      id: IMPORT_CARD_MENU_ID,
      title: "Import selected glossary card",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  const rawSelectedText = (info.selectionText || "").trim();
  const selectedText = rawSelectedText.replace(/\s+/g, " ");
  if (!selectedText) return;

  if (info.menuItemId === IMPORT_CARD_MENU_ID) {
    const result = globalThis.AIGlossaryParser.parseGlossaryText(rawSelectedText);
    if (result.terms.length) {
      const enriched = result.terms.map((term) => ({
        ...term,
        sourceTool: term.sourceTool || "Chrome context menu",
        sourceUrl: term.sourceUrl || tab?.url || ""
      }));
      const imported = await globalThis.AIGlossaryStorage.importTerms(enriched);
      await openDashboard(imported[0]?.term || "");
      return;
    }
  }

  if (info.menuItemId !== SAVE_DRAFT_MENU_ID) return;

  const saved = await saveDraftTerm(selectedText, tab?.url || "", "Chrome context menu");
  await openDashboard(saved.term);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message || message.type !== "AGK_IMPORT_CARD") return false;

  handleImportMessage(message, sender)
    .then((payload) => sendResponse({ ok: true, ...payload }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});

async function handleImportMessage(message, sender) {
  const result = globalThis.AIGlossaryParser.parseGlossaryText(message.text || "");
  if (!result.terms.length) {
    throw new Error(result.errors[0] || "No valid glossary card found.");
  }

  const pageUrl = sender?.tab?.url || message.sourceUrl || "";
  const imported = await globalThis.AIGlossaryStorage.importTerms(
    result.terms.map((term) => ({
      ...term,
      sourceTool: term.sourceTool || detectSourceTool(pageUrl),
      sourceUrl: term.sourceUrl || pageUrl
    }))
  );

  return { count: imported.length, term: imported[0]?.term || "" };
}

async function saveDraftTerm(text, sourceUrl, sourceTool) {
  return globalThis.AIGlossaryStorage.saveTerm({
    term: text.slice(0, 120),
    topic: globalThis.AIGlossarySchema.inferTopic({ term: text }),
    sourceTool,
    sourceUrl,
    tags: ["Captured"],
    status: "draft"
  });
}

async function openDashboard(term) {
  const suffix = term ? `?q=${encodeURIComponent(term)}` : "";
  await chrome.tabs.create({
    url: chrome.runtime.getURL(`web/index.html${suffix}`)
  });
}

function detectSourceTool(url) {
  try {
    const host = new URL(url).hostname;
    if (host.includes("chatgpt") || host.includes("openai")) return "ChatGPT";
    if (host.includes("claude")) return "Claude";
    if (host.includes("gemini")) return "Gemini";
    if (host.includes("perplexity")) return "Perplexity";
    if (host.includes("copilot")) return "Copilot";
    if (host.includes("poe")) return "Poe";
  } catch (error) {
    return "Browser page";
  }
  return "Browser page";
}
