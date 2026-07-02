(function (global) {
  function getSchema() {
    return global.AIGlossarySchema;
  }

  function parseGlossaryText(text) {
    const raw = String(text || "").trim();
    if (!raw) return { terms: [], errors: ["Input is empty."] };

    const jsonResult = parseJson(raw);
    if (jsonResult.terms.length) return jsonResult;

    const blocks = splitCards(raw);
    const terms = [];
    const errors = [];

    blocks.forEach((block, index) => {
      const parsed = parseKeyValueBlock(block);
      if (!parsed.term) {
        errors.push(`Card ${index + 1} is missing a term field.`);
        return;
      }
      terms.push(getSchema().createTerm(parsed));
    });

    return { terms, errors };
  }

  function parseJson(raw) {
    try {
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed.terms) ? parsed.terms : [parsed];
      const terms = items
        .filter(Boolean)
        .map((item) => mapKnownFields(item))
        .filter((item) => item.term)
        .map((item) => getSchema().createTerm(item));
      return { terms, errors: [] };
    } catch (error) {
      return { terms: [], errors: [] };
    }
  }

  function splitCards(raw) {
    const cards = raw
      .split(/\n\s*(?:---|\*\*\*|###\s+Card|\#\#\#\s+卡片)\s*\n/g)
      .map((item) => item.trim())
      .filter(Boolean);
    return cards.length ? cards : [raw];
  }

  function parseKeyValueBlock(block) {
    const result = {};
    const lines = block.split(/\r?\n/);
    let activeField = null;

    lines.forEach((rawLine) => {
      const cleaned = rawLine.replace(/^[\s>*-]+/, "").trim();
      if (!cleaned) return;
      if (/^```/.test(cleaned)) return;

      const match = cleaned.match(/^([^:：]{1,32})[:：]\s*(.*)$/);
      if (match) {
        const canonical = canonicalField(match[1].trim());
        if (canonical) {
          activeField = canonical;
          assign(result, canonical, match[2].trim());
          return;
        }
      }

      if (activeField && typeof result[activeField] === "string") {
        result[activeField] = `${result[activeField]}\n${cleaned}`.trim();
      }
    });

    return mapKnownFields(result);
  }

  function canonicalField(key) {
    const schema = getSchema();
    const normalized = key.toLowerCase();
    for (const [field, aliases] of Object.entries(schema.FIELD_ALIASES)) {
      if (aliases.map((item) => item.toLowerCase()).includes(normalized)) return field;
    }
    return "";
  }

  function assign(result, field, value) {
    if (field === "relatedTerms" || field === "tags") {
      result[field] = getSchema().normalizeList(value);
      return;
    }
    result[field] = value;
  }

  function mapKnownFields(input) {
    const result = {};
    Object.entries(input || {}).forEach(([key, value]) => {
      const canonical = canonicalField(key) || key;
      if (canonical === "relatedTerms" || canonical === "tags") {
        result[canonical] = getSchema().normalizeList(value);
      } else {
        result[canonical] = value == null ? "" : String(value).trim();
      }
    });

    if (!result.term && result.name) result.term = result.name;
    if (!result.plainExplanation && result.plain) result.plainExplanation = result.plain;
    return result;
  }

  function toMarkdownCard(term) {
    return [
      `词条：${term.term || ""}`,
      `英文全称：${term.fullName || ""}`,
      `中文名：${term.chineseName || ""}`,
      `一句话解释：${term.oneLine || ""}`,
      `通俗解释：${term.plainExplanation || ""}`,
      `业务场景：${term.scenario || ""}`,
      `例子：${term.example || ""}`,
      `主题：${term.topic || ""}`,
      `相关词：${(term.relatedTerms || []).join(", ")}`,
      `标签：${(term.tags || []).join(", ")}`,
      `来源工具：${term.sourceTool || ""}`,
      `来源链接：${term.sourceUrl || ""}`,
      `备注：${term.notes || ""}`
    ].join("\n");
  }

  global.AIGlossaryParser = {
    parseGlossaryText,
    toMarkdownCard
  };
})(globalThis);
