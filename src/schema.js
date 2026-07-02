(function (global) {
  const TOPICS = [
    "Growth",
    "Sales",
    "Content",
    "SEO",
    "Agent",
    "Legal Tech",
    "Business Model",
    "Product",
    "Other"
  ];

  const STATUS = {
    READY: "ready",
    DRAFT: "draft"
  };

  const FIELD_ALIASES = {
    term: ["term", "词条", "术语", "name"],
    fullName: ["fullName", "full name", "英文全称", "英文名"],
    chineseName: ["chineseName", "chinese name", "中文名", "中文解释名"],
    oneLine: ["oneLine", "one line", "一句话解释", "一句话理解"],
    plainExplanation: ["plainExplanation", "plain explanation", "通俗解释", "大白话解释"],
    scenario: ["scenario", "business scenario", "业务场景", "使用场景"],
    example: ["example", "例子", "案例", "业务例子", "Raymond Legal 例子"],
    relatedTerms: ["relatedTerms", "related terms", "相关词", "关联词"],
    tags: ["tags", "标签"],
    topic: ["topic", "主题", "所属主题"],
    sourceTool: ["sourceTool", "source tool", "来源工具"],
    sourceUrl: ["sourceUrl", "source url", "来源链接"],
    notes: ["notes", "备注", "我的理解备注"]
  };

  function createId() {
    if (global.crypto && typeof global.crypto.randomUUID === "function") {
      return global.crypto.randomUUID();
    }
    return `term-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function normalizeTermName(value) {
    return String(value || "")
      .trim()
      .replace(/\s+/g, " ")
      .toLowerCase();
  }

  function normalizeList(value) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean);
    }
    return String(value || "")
      .split(/[,，、;\n]/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  function inferTopic(input) {
    const text = normalizeTermName(
      [input.term, input.fullName, input.chineseName, ...(input.tags || [])].join(" ")
    );

    if (/(seo|keyword|search|ranking|serp|搜索|关键词)/i.test(text)) return "SEO";
    if (/(agent|rag|workflow|tool use|llm|prompt|智能体|流程)/i.test(text)) return "Agent";
    if (/(sdr|sales|lead|mql|sql|crm|pipeline|销售|线索)/i.test(text)) return "Sales";
    if (/(content|blog|whitepaper|case study|内容|案例|白皮书)/i.test(text)) return "Content";
    if (/(ltv|cac|subscription|retainer|pricing|商业模式|订阅)/i.test(text)) return "Business Model";
    if (/(law|legal|kyc|aml|intake|matter|律所|法律)/i.test(text)) return "Legal Tech";
    if (/(product|ux|activation|onboarding|产品)/i.test(text)) return "Product";
    return "Growth";
  }

  function createTerm(input) {
    const timestamp = nowIso();
    const tags = normalizeList(input.tags);
    const relatedTerms = normalizeList(input.relatedTerms);
    const topic = input.topic || inferTopic({ ...input, tags });

    return {
      id: input.id || createId(),
      term: String(input.term || input.name || "").trim(),
      fullName: String(input.fullName || "").trim(),
      chineseName: String(input.chineseName || input.chinese || "").trim(),
      oneLine: String(input.oneLine || "").trim(),
      plainExplanation: String(input.plainExplanation || input.plain || "").trim(),
      scenario: String(input.scenario || "").trim(),
      example: String(input.example || "").trim(),
      relatedTerms,
      tags,
      topic: TOPICS.includes(topic) ? topic : "Other",
      sourceTool: String(input.sourceTool || "").trim(),
      sourceUrl: String(input.sourceUrl || "").trim(),
      notes: String(input.notes || "").trim(),
      status: input.status || (input.oneLine || input.plainExplanation ? STATUS.READY : STATUS.DRAFT),
      createdAt: input.createdAt || timestamp,
      updatedAt: input.updatedAt || timestamp
    };
  }

  function mergeTerm(existing, incoming) {
    const merged = { ...existing };
    const scalarFields = [
      "term",
      "fullName",
      "chineseName",
      "oneLine",
      "plainExplanation",
      "scenario",
      "example",
      "topic",
      "sourceTool",
      "sourceUrl",
      "notes",
      "status"
    ];

    scalarFields.forEach((field) => {
      if (incoming[field]) merged[field] = incoming[field];
    });

    merged.relatedTerms = uniqueList([...(existing.relatedTerms || []), ...(incoming.relatedTerms || [])]);
    merged.tags = uniqueList([...(existing.tags || []), ...(incoming.tags || [])]);
    merged.updatedAt = nowIso();
    return merged;
  }

  function uniqueList(items) {
    const seen = new Set();
    return normalizeList(items).filter((item) => {
      const key = normalizeTermName(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function findDuplicate(terms, candidate) {
    const names = [
      candidate.term,
      candidate.fullName,
      candidate.chineseName,
      ...(candidate.relatedAliases || [])
    ]
      .map(normalizeTermName)
      .filter(Boolean);

    return terms.find((term) => {
      const known = [term.term, term.fullName, term.chineseName].map(normalizeTermName).filter(Boolean);
      return known.some((item) => names.includes(item));
    });
  }

  global.AIGlossarySchema = {
    TOPICS,
    STATUS,
    FIELD_ALIASES,
    createId,
    createTerm,
    mergeTerm,
    normalizeTermName,
    normalizeList,
    inferTopic,
    findDuplicate
  };
})(globalThis);
