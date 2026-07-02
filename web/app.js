(function () {
  const schema = window.AIGlossarySchema;
  const parser = window.AIGlossaryParser;
  const storage = window.AIGlossaryStorage;

  const state = {
    terms: [],
    selectedId: "",
    search: "",
    topic: "All",
    status: "all"
  };

  const topicColors = {
    All: "#18211f",
    Growth: "#15735f",
    Sales: "#2d6f9f",
    Content: "#966d19",
    SEO: "#bd5948",
    Agent: "#6558a8",
    "Legal Tech": "#2d7f7b",
    "Business Model": "#a04b75",
    Product: "#5764a8",
    Other: "#65716e"
  };

  const els = {
    topicList: document.querySelector("#topicList"),
    searchInput: document.querySelector("#searchInput"),
    captureButton: document.querySelector("#captureButton"),
    emptyCaptureButton: document.querySelector("#emptyCaptureButton"),
    termGrid: document.querySelector("#termGrid"),
    emptyState: document.querySelector("#emptyState"),
    detailPanel: document.querySelector("#detailPanel"),
    statusTabs: document.querySelector("#statusTabs"),
    totalCount: document.querySelector("#totalCount"),
    readyCount: document.querySelector("#readyCount"),
    draftCount: document.querySelector("#draftCount"),
    topicCount: document.querySelector("#topicCount"),
    storageMode: document.querySelector("#storageMode"),
    storageHint: document.querySelector("#storageHint"),
    newTermButton: document.querySelector("#newTermButton"),
    importButton: document.querySelector("#importButton"),
    exportJsonButton: document.querySelector("#exportJsonButton"),
    exportMarkdownButton: document.querySelector("#exportMarkdownButton"),
    termDialog: document.querySelector("#termDialog"),
    importDialog: document.querySelector("#importDialog"),
    termForm: document.querySelector("#termForm"),
    importForm: document.querySelector("#importForm"),
    closeDialogButton: document.querySelector("#closeDialogButton"),
    closeImportButton: document.querySelector("#closeImportButton"),
    deleteTermButton: document.querySelector("#deleteTermButton"),
    clearFormButton: document.querySelector("#clearFormButton"),
    pasteClipboardButton: document.querySelector("#pasteClipboardButton"),
    importText: document.querySelector("#importText"),
    importMessage: document.querySelector("#importMessage"),
    toast: document.querySelector("#toast")
  };

  const fields = {
    id: document.querySelector("#termId"),
    term: document.querySelector("#termName"),
    topic: document.querySelector("#termTopic"),
    fullName: document.querySelector("#termFullName"),
    chineseName: document.querySelector("#termChineseName"),
    oneLine: document.querySelector("#termOneLine"),
    plainExplanation: document.querySelector("#termPlainExplanation"),
    scenario: document.querySelector("#termScenario"),
    example: document.querySelector("#termExample"),
    relatedTerms: document.querySelector("#termRelatedTerms"),
    tags: document.querySelector("#termTags"),
    sourceTool: document.querySelector("#termSourceTool"),
    sourceUrl: document.querySelector("#termSourceUrl"),
    status: document.querySelector("#termStatus"),
    notes: document.querySelector("#termNotes")
  };

  init();

  async function init() {
    renderTopicOptions();
    bindEvents();
    updateStorageHint();
    state.terms = await storage.seedIfEmpty(window.AIGlossarySeed || []);
    applyQueryParams();
    render();
    if (state.terms.length && !state.selectedId) selectTerm(state.terms[0].id, false);
  }

  function bindEvents() {
    els.searchInput.addEventListener("input", () => {
      state.search = els.searchInput.value.trim();
      els.captureButton.disabled = !state.search;
      render();
    });

    els.searchInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && state.search) {
        event.preventDefault();
        captureDraft();
      }
    });

    els.captureButton.addEventListener("click", captureDraft);
    els.emptyCaptureButton.addEventListener("click", captureDraft);
    els.newTermButton.addEventListener("click", () => openTermDialog());
    els.importButton.addEventListener("click", () => openDialog(els.importDialog));
    els.exportJsonButton.addEventListener("click", exportJson);
    els.exportMarkdownButton.addEventListener("click", exportMarkdown);

    els.statusTabs.addEventListener("click", (event) => {
      const button = event.target.closest("[data-status]");
      if (!button) return;
      state.status = button.dataset.status;
      render();
    });

    els.closeDialogButton.addEventListener("click", () => closeDialog(els.termDialog));
    els.closeImportButton.addEventListener("click", () => closeDialog(els.importDialog));
    els.clearFormButton.addEventListener("click", () => fillForm(null));
    els.deleteTermButton.addEventListener("click", deleteSelectedTerm);
    els.termForm.addEventListener("submit", saveForm);
    els.importForm.addEventListener("submit", importCards);
    els.pasteClipboardButton.addEventListener("click", pasteClipboard);

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") els.detailPanel.classList.remove("open");
    });
  }

  function updateStorageHint() {
    if (storage.hasChromeStorage()) {
      els.storageMode.textContent = "Extension storage";
      els.storageHint.textContent = "Dashboard, popup, and right-click capture share one local glossary.";
    } else {
      els.storageMode.textContent = "Web storage";
      els.storageHint.textContent = "Standalone dashboard uses IndexedDB in this browser.";
    }
  }

  function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q") || params.get("term") || "";
    if (query) {
      state.search = query;
      els.searchInput.value = query;
      els.captureButton.disabled = false;
    }
  }

  function render() {
    renderTopics();
    renderStats();
    renderTabs();
    renderCards();
    if (state.selectedId) {
      renderDetail(state.terms.find((term) => term.id === state.selectedId));
    }
  }

  function renderTopicOptions() {
    fields.topic.innerHTML = schema.TOPICS.map(
      (topic) => `<option value="${escapeHtml(topic)}">${escapeHtml(topic)}</option>`
    ).join("");
  }

  function renderTopics() {
    const topics = ["All", ...schema.TOPICS];
    const counts = countByTopic();
    els.topicList.innerHTML = topics
      .map((topic) => {
        const count = topic === "All" ? state.terms.length : counts[topic] || 0;
        const active = state.topic === topic ? "active" : "";
        return `
          <button class="topic-button ${active}" data-topic="${escapeHtml(topic)}" type="button">
            <span class="topic-dot" style="background:${topicColors[topic] || topicColors.Other}"></span>
            <span>${escapeHtml(topic)}</span>
            <span class="topic-count">${count}</span>
          </button>
        `;
      })
      .join("");

    els.topicList.querySelectorAll("[data-topic]").forEach((button) => {
      button.addEventListener("click", () => {
        state.topic = button.dataset.topic;
        render();
      });
    });
  }

  function renderStats() {
    els.totalCount.textContent = state.terms.length;
    els.readyCount.textContent = state.terms.filter((term) => term.status === "ready").length;
    els.draftCount.textContent = state.terms.filter((term) => term.status === "draft").length;
    els.topicCount.textContent = new Set(state.terms.map((term) => term.topic).filter(Boolean)).size;
  }

  function renderTabs() {
    els.statusTabs.querySelectorAll("[data-status]").forEach((button) => {
      button.classList.toggle("active", button.dataset.status === state.status);
    });
  }

  function renderCards() {
    const filtered = filteredTerms();
    els.emptyState.classList.toggle("visible", filtered.length === 0);
    els.termGrid.classList.toggle("hidden", filtered.length === 0);
    els.termGrid.innerHTML = filtered
      .map((term) => {
        const active = term.id === state.selectedId ? "active" : "";
        const related = (term.relatedTerms || [])
          .slice(0, 4)
          .map((item) => `<span class="pill">${escapeHtml(item)}</span>`)
          .join("");
        return `
          <button class="term-card ${active}" data-id="${term.id}" type="button">
            <div class="term-head">
              <div>
                <strong>${escapeHtml(term.term)}</strong>
                <span>${escapeHtml(term.fullName || term.chineseName || "No full name yet")}</span>
              </div>
              <span class="pill ${term.status === "ready" ? "ready" : "draft"}">${term.status}</span>
            </div>
            <div class="pill-row">
              <span class="pill topic">${escapeHtml(term.topic || "Other")}</span>
              ${(term.tags || []).slice(0, 2).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
            </div>
            <p>${escapeHtml(term.oneLine || "Captured as a draft. Add a glossary card to enrich it.")}</p>
            <div class="pill-row">${related}</div>
          </button>
        `;
      })
      .join("");

    els.termGrid.querySelectorAll("[data-id]").forEach((card) => {
      card.addEventListener("click", () => selectTerm(card.dataset.id, true));
    });
  }

  function renderDetail(term) {
    if (!term) {
      els.detailPanel.innerHTML = `
        <div class="detail-empty">
          <b>Select a term</b>
          <span>Definitions, scenarios, examples, and related terms will appear here.</span>
        </div>
      `;
      return;
    }

    const related = (term.relatedTerms || [])
      .map((item) => {
        const target = findByName(item);
        return `
          <div class="graph-node">
            <span>${escapeHtml(item)}</span>
            ${target ? `<button type="button" data-related-id="${target.id}">Open</button>` : `<span>Not saved</span>`}
          </div>
        `;
      })
      .join("");

    els.detailPanel.innerHTML = `
      <div class="detail-title-row">
        <div class="detail-title">
          <h2>${escapeHtml(term.term)}</h2>
          <p>${escapeHtml(term.fullName || term.chineseName || "No full name yet")}</p>
        </div>
        <button class="secondary-button" id="editTermButton" type="button">Edit</button>
      </div>
      <div class="pill-row">
        <span class="pill ${term.status === "ready" ? "ready" : "draft"}">${term.status}</span>
        <span class="pill topic">${escapeHtml(term.topic || "Other")}</span>
        ${(term.tags || []).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("")}
      </div>
      ${detailBlock("One-line definition", term.oneLine || "Draft captured.")}
      ${detailBlock("中文名", term.chineseName || "Not provided.")}
      ${detailBlock("Plain explanation", term.plainExplanation || "Not provided.")}
      ${detailBlock("Scenario", term.scenario || "Not provided.")}
      ${detailBlock("Example", term.example || "Not provided.")}
      <div class="detail-block">
        <h3>Related terms</h3>
        ${related || "<p>No related terms yet.</p>"}
      </div>
      ${detailBlock("Notes", term.notes || "No notes.")}
      ${detailBlock("Source", [term.sourceTool, term.sourceUrl].filter(Boolean).join(" · ") || "No source.")}
      ${detailBlock("Updated", formatDate(term.updatedAt))}
    `;

    document.querySelector("#editTermButton").addEventListener("click", () => openTermDialog(term));
    els.detailPanel.querySelectorAll("[data-related-id]").forEach((button) => {
      button.addEventListener("click", () => selectTerm(button.dataset.relatedId, true));
    });
  }

  function detailBlock(title, value) {
    return `
      <div class="detail-block">
        <h3>${escapeHtml(title)}</h3>
        <p>${escapeHtml(value)}</p>
      </div>
    `;
  }

  function filteredTerms() {
    const query = schema.normalizeTermName(state.search);
    let terms = [...state.terms];

    if (state.topic !== "All") {
      terms = terms.filter((term) => term.topic === state.topic);
    }

    if (state.status === "ready") {
      terms = terms.filter((term) => term.status === "ready");
    } else if (state.status === "draft") {
      terms = terms.filter((term) => term.status === "draft");
    }

    if (query) {
      terms = terms.filter((term) => {
        const haystack = [
          term.term,
          term.fullName,
          term.chineseName,
          term.oneLine,
          term.plainExplanation,
          term.scenario,
          term.example,
          term.topic,
          ...(term.relatedTerms || []),
          ...(term.tags || [])
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(query);
      });
    }

    if (state.status === "recent") {
      return terms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return terms.sort((a, b) => a.term.localeCompare(b.term, "en"));
  }

  async function captureDraft() {
    const termText = state.search.trim();
    if (!termText) return;

    const existing = findByName(termText);
    if (existing) {
      selectTerm(existing.id, true);
      showToast("Existing term opened.");
      return;
    }

    const saved = await storage.saveTerm({
      term: termText,
      topic: schema.inferTopic({ term: termText }),
      tags: ["Captured"],
      sourceTool: getSourceTool(),
      status: "draft"
    });
    state.terms = await storage.getAll();
    state.selectedId = saved.id;
    state.topic = "All";
    state.status = "all";
    render();
    selectTerm(saved.id, true);
    showToast(`Captured "${termText}" as a draft.`);
  }

  function openTermDialog(term) {
    fillForm(term || null);
    openDialog(els.termDialog);
  }

  function fillForm(term) {
    document.querySelector("#dialogTitle").textContent = term ? "Edit term" : "New term";
    fields.id.value = term?.id || "";
    fields.term.value = term?.term || "";
    fields.topic.value = term?.topic || "Growth";
    fields.fullName.value = term?.fullName || "";
    fields.chineseName.value = term?.chineseName || "";
    fields.oneLine.value = term?.oneLine || "";
    fields.plainExplanation.value = term?.plainExplanation || "";
    fields.scenario.value = term?.scenario || "";
    fields.example.value = term?.example || "";
    fields.relatedTerms.value = (term?.relatedTerms || []).join(", ");
    fields.tags.value = (term?.tags || []).join(", ");
    fields.sourceTool.value = term?.sourceTool || "";
    fields.sourceUrl.value = term?.sourceUrl || "";
    fields.status.value = term?.status || "ready";
    fields.notes.value = term?.notes || "";
    els.deleteTermButton.classList.toggle("hidden", !term);
  }

  async function saveForm(event) {
    event.preventDefault();
    const input = {
      id: fields.id.value,
      term: fields.term.value,
      topic: fields.topic.value,
      fullName: fields.fullName.value,
      chineseName: fields.chineseName.value,
      oneLine: fields.oneLine.value,
      plainExplanation: fields.plainExplanation.value,
      scenario: fields.scenario.value,
      example: fields.example.value,
      relatedTerms: schema.normalizeList(fields.relatedTerms.value),
      tags: schema.normalizeList(fields.tags.value),
      sourceTool: fields.sourceTool.value,
      sourceUrl: fields.sourceUrl.value,
      status: fields.status.value,
      notes: fields.notes.value
    };

    if (!input.term.trim()) {
      showToast("Term is required.");
      return;
    }

    const saved = await storage.saveTerm(input);
    state.terms = await storage.getAll();
    state.selectedId = saved.id;
    closeDialog(els.termDialog);
    render();
    selectTerm(saved.id, false);
    showToast("Term saved.");
  }

  async function deleteSelectedTerm() {
    const id = fields.id.value;
    if (!id) return;
    const term = state.terms.find((item) => item.id === id);
    if (!window.confirm(`Delete "${term?.term || "this term"}"?`)) return;

    state.terms = await storage.removeTerm(id);
    state.selectedId = state.terms[0]?.id || "";
    closeDialog(els.termDialog);
    render();
    renderDetail(state.terms.find((item) => item.id === state.selectedId));
    showToast("Term deleted.");
  }

  async function importCards(event) {
    event.preventDefault();
    const text = els.importText.value.trim();
    if (!text) {
      els.importMessage.textContent = "Paste a card first.";
      return;
    }

    const result = parser.parseGlossaryText(text);
    if (!result.terms.length) {
      els.importMessage.textContent = result.errors[0] || "No valid cards found.";
      return;
    }

    const saved = await storage.importTerms(result.terms);
    state.terms = await storage.getAll();
    state.selectedId = saved[0]?.id || state.selectedId;
    els.importText.value = "";
    els.importMessage.textContent = "";
    closeDialog(els.importDialog);
    render();
    selectTerm(state.selectedId, false);
    showToast(`Imported ${saved.length} term${saved.length > 1 ? "s" : ""}.`);
  }

  async function pasteClipboard() {
    try {
      els.importText.value = await navigator.clipboard.readText();
      els.importMessage.textContent = "Clipboard pasted.";
    } catch (error) {
      els.importMessage.textContent = "Clipboard access was blocked.";
    }
  }

  function exportJson() {
    downloadFile("ai-glossary-kit.json", JSON.stringify(state.terms, null, 2), "application/json");
  }

  function exportMarkdown() {
    const content = state.terms.map((term) => parser.toMarkdownCard(term)).join("\n\n---\n\n");
    downloadFile("ai-glossary-kit.md", content, "text/markdown");
  }

  function openDialog(dialog) {
    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
  }

  function closeDialog(dialog) {
    if (typeof dialog.close === "function") {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
  }

  function selectTerm(id, openPanel) {
    const term = state.terms.find((item) => item.id === id);
    if (!term) return;
    state.selectedId = id;
    renderCards();
    renderDetail(term);
    if (openPanel) els.detailPanel.classList.add("open");
  }

  function countByTopic() {
    return state.terms.reduce((acc, term) => {
      acc[term.topic] = (acc[term.topic] || 0) + 1;
      return acc;
    }, {});
  }

  function findByName(name) {
    const target = schema.normalizeTermName(name);
    return state.terms.find((term) =>
      [term.term, term.fullName, term.chineseName].map(schema.normalizeTermName).includes(target)
    );
  }

  function getSourceTool() {
    if (storage.hasChromeStorage()) return "Browser extension";
    return "Web dashboard";
  }

  function downloadFile(filename, content, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function formatDate(value) {
    if (!value) return "Unknown";
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(new Date(value));
  }

  function escapeHtml(value) {
    return String(value || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  let toastTimer = null;

  function showToast(message) {
    clearTimeout(toastTimer);
    els.toast.textContent = message;
    els.toast.classList.add("show");
    toastTimer = setTimeout(() => els.toast.classList.remove("show"), 2200);
  }
})();
