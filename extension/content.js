(function () {
  const CARD_HINTS = ["Glossary Card", "词条：", "词条:", "\"term\"", "'term'"];
  const MIN_LENGTH = 24;
  const MAX_LENGTH = 9000;
  const SCAN_SELECTOR = [
    "pre",
    "code",
    "article",
    "section",
    "blockquote",
    "[data-message-author-role]",
    "[class*='message']",
    "[class*='response']",
    "[class*='markdown']"
  ].join(",");

  let scanTimer = null;

  scheduleScan();

  const observer = new MutationObserver(() => scheduleScan());
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  function scheduleScan() {
    window.clearTimeout(scanTimer);
    scanTimer = window.setTimeout(scanForCards, 700);
  }

  function scanForCards() {
    const candidates = Array.from(document.querySelectorAll(SCAN_SELECTOR));
    candidates.forEach((node) => {
      const target = normalizeTarget(node);
      if (!target || target.dataset.agkScanned === "true") return;
      if (target.closest(".agk-save-bar")) return;

      const text = extractText(target);
      if (!looksLikeCard(text)) return;

      const result = window.AIGlossaryParser.parseGlossaryText(text);
      if (!result.terms.length) return;

      target.dataset.agkScanned = "true";
      insertSaveBar(target, text, result.terms.length);
    });
  }

  function normalizeTarget(node) {
    if (!node || !node.isConnected) return null;
    if (node.matches("code") && node.closest("pre")) return node.closest("pre");
    return node;
  }

  function extractText(node) {
    return String(node.innerText || node.textContent || "").trim();
  }

  function looksLikeCard(text) {
    if (!text || text.length < MIN_LENGTH || text.length > MAX_LENGTH) return false;
    if (!CARD_HINTS.some((hint) => text.includes(hint))) return false;
    return /词条\s*[:：]|["']term["']\s*:/.test(text);
  }

  function insertSaveBar(target, cardText, count) {
    const bar = document.createElement("div");
    bar.className = "agk-save-bar";
    bar.innerHTML = `
      <button class="agk-save-button" type="button">
        Save ${count > 1 ? `${count} cards` : "card"} to AI Glossary Kit
      </button>
      <span class="agk-save-status">Detected importable glossary card.</span>
    `;

    const button = bar.querySelector(".agk-save-button");
    const status = bar.querySelector(".agk-save-status");

    button.addEventListener("click", async () => {
      button.disabled = true;
      status.textContent = "Saving...";

      try {
        const response = await chrome.runtime.sendMessage({
          type: "AGK_IMPORT_CARD",
          text: cardText,
          sourceUrl: location.href
        });

        if (!response || !response.ok) {
          throw new Error(response?.error || "Save failed.");
        }

        button.textContent = "Saved";
        status.textContent = `Saved ${response.count} term${response.count > 1 ? "s" : ""}.`;
      } catch (error) {
        button.disabled = false;
        status.textContent = error.message || "Could not save.";
      }
    });

    target.insertAdjacentElement("afterend", bar);
  }
})();
