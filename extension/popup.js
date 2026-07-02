(async function () {
  const schema = window.AIGlossarySchema;
  const parser = window.AIGlossaryParser;
  const storage = window.AIGlossaryStorage;

  const els = {
    termInput: document.querySelector("#termInput"),
    openButton: document.querySelector("#openButton"),
    captureButton: document.querySelector("#captureButton"),
    importClipboardButton: document.querySelector("#importClipboardButton"),
    dashboardButton: document.querySelector("#dashboardButton"),
    recentList: document.querySelector("#recentList"),
    message: document.querySelector("#message")
  };

  let terms = await storage.seedIfEmpty(window.AIGlossarySeed || []);
  renderRecent();

  els.openButton.addEventListener("click", openTerm);
  els.captureButton.addEventListener("click", saveDraft);
  els.dashboardButton.addEventListener("click", () => openDashboard());
  els.importClipboardButton.addEventListener("click", importClipboard);
  els.termInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") openTerm();
  });

  async function openTerm() {
    const term = els.termInput.value.trim();
    openDashboard(term);
  }

  async function saveDraft() {
    const term = els.termInput.value.trim();
    if (!term) {
      setMessage("Type a term first.");
      return;
    }

    const saved = await storage.saveTerm({
      term,
      topic: schema.inferTopic({ term }),
      sourceTool: "Extension popup",
      tags: ["Captured"],
      status: "draft"
    });
    terms = await storage.getAll();
    renderRecent();
    setMessage(`Saved "${saved.term}" as a draft.`);
  }

  async function importClipboard() {
    try {
      const text = await navigator.clipboard.readText();
      const result = parser.parseGlossaryText(text);
      if (!result.terms.length) {
        setMessage(result.errors[0] || "Clipboard does not contain a glossary card.");
        return;
      }
      const imported = await storage.importTerms(result.terms);
      terms = await storage.getAll();
      renderRecent();
      setMessage(`Imported ${imported.length} term${imported.length > 1 ? "s" : ""}.`);
    } catch (error) {
      setMessage("Clipboard access was blocked.");
    }
  }

  function renderRecent() {
    const recent = [...terms]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 5);

    els.recentList.innerHTML =
      recent
        .map(
          (term) => `
            <button class="recent-item" data-term="${escapeHtml(term.term)}" type="button">
              <span>
                <strong>${escapeHtml(term.term)}</strong>
                <span>${escapeHtml(term.topic || "Other")}</span>
              </span>
              <span>${escapeHtml(term.status)}</span>
            </button>
          `
        )
        .join("") || "<p>No terms yet.</p>";

    els.recentList.querySelectorAll("[data-term]").forEach((button) => {
      button.addEventListener("click", () => openDashboard(button.dataset.term));
    });
  }

  function openDashboard(term) {
    const suffix = term ? `?q=${encodeURIComponent(term)}` : "";
    chrome.tabs.create({ url: chrome.runtime.getURL(`web/index.html${suffix}`) });
  }

  function setMessage(message) {
    els.message.textContent = message;
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
})();
