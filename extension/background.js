importScripts("/src/schema.js", "/src/parser.js", "/src/storage.js");

const MENU_ID = "ai-glossary-kit-capture-selection";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Save selected term to AI Glossary Kit",
      contexts: ["selection"]
    });
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== MENU_ID) return;

  const selectedText = (info.selectionText || "").trim().replace(/\s+/g, " ");
  if (!selectedText) return;

  await chrome.storage.local.get("ai-glossary-kit-terms");
  const saved = await globalThis.AIGlossaryStorage.saveTerm({
    term: selectedText.slice(0, 120),
    topic: globalThis.AIGlossarySchema.inferTopic({ term: selectedText }),
    sourceTool: "Chrome context menu",
    sourceUrl: tab?.url || "",
    tags: ["Captured"],
    status: "draft"
  });

  await chrome.tabs.create({
    url: chrome.runtime.getURL(`web/index.html?q=${encodeURIComponent(saved.term)}`)
  });
});
