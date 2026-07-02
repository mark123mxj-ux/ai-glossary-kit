(function (global) {
  global.AIGlossarySeed = [
    {
      term: "ICP",
      fullName: "Ideal Customer Profile",
      chineseName: "理想客户画像",
      oneLine: "The type of customer most worth acquiring and serving.",
      plainExplanation:
        "ICP is not just a broad target audience. It defines the customer segment with the strongest pain, best fit, highest value, and clearest buying path.",
      scenario:
        "Use ICP to decide website positioning, SEO topics, landing pages, outbound lists, sales scripts, and product packaging.",
      example:
        "A UK law firm may define an ICP as China-based companies entering the UK/EU market and needing company setup, immigration, compliance, contracts, and IP support.",
      relatedTerms: ["SDR", "ABM", "Lead", "MQL", "SQL", "Landing Page"],
      tags: ["Growth", "Sales", "B2B"],
      topic: "Growth",
      sourceTool: "Seed",
      status: "ready"
    },
    {
      term: "SDR",
      fullName: "Sales Development Representative",
      chineseName: "销售开发代表",
      oneLine: "A role responsible for finding, qualifying, and booking conversations with potential customers.",
      plainExplanation:
        "An SDR usually does not close the deal. They identify prospects, check whether they match the ICP, start outreach, and pass qualified opportunities to sales or experts.",
      scenario:
        "In B2B growth, SDRs turn ICP lists and buying signals into qualified calls, demos, or consultations.",
      example:
        "For a legal services firm, an SDR could find companies that recently registered in the UK, raised funding, started hiring, or showed regulatory needs.",
      relatedTerms: ["ICP", "Lead", "MQL", "SQL", "CRM", "Pipeline"],
      tags: ["Sales", "Outbound", "Growth"],
      topic: "Sales",
      sourceTool: "Seed",
      status: "ready"
    },
    {
      term: "Landing Page",
      fullName: "Landing Page",
      chineseName: "专题落地页",
      oneLine: "A focused page designed around one audience, one problem, and one conversion action.",
      plainExplanation:
        "A landing page is different from a homepage. It is usually built for a specific campaign, keyword, ICP, or use case.",
      scenario:
        "Use landing pages to convert SEO, paid ads, content, social, or outbound traffic into diagnostics, signups, calls, or purchases.",
      example:
        "A page called 'UK Sponsor Licence Readiness Check' can capture high-intent companies and route them into a legal consultation.",
      relatedTerms: ["SEO", "Lead Magnet", "Conversion", "CTA", "ICP"],
      tags: ["Growth", "Website", "Conversion"],
      topic: "Growth",
      sourceTool: "Seed",
      status: "ready"
    },
    {
      term: "Workflow Agent",
      fullName: "Workflow Agent",
      chineseName: "流程 Agent",
      oneLine: "An agent that executes repeatable workflows with clear inputs, rules, outputs, and review points.",
      plainExplanation:
        "Workflow agents are useful for intake, routing, form filling, checklist generation, reminders, summaries, and report drafting.",
      scenario:
        "They are a low-risk entry point for enterprise AI because the scope is easier to define and the ROI is easier to measure.",
      example:
        "A law firm intake agent can collect client details, matter type, key dates, files, and conflict-check hints before producing a lawyer-ready brief.",
      relatedTerms: ["Business Agent", "Human-in-the-loop", "RAG", "Tool Use"],
      tags: ["Agent", "Automation", "Workflow"],
      topic: "Agent",
      sourceTool: "Seed",
      status: "ready"
    },
    {
      term: "Business Agent",
      fullName: "Business Agent",
      chineseName: "业务 Agent",
      oneLine: "An agent that participates in business judgment and closes the loop on revenue, conversion, risk, or delivery outcomes.",
      plainExplanation:
        "Business agents go beyond saving time. They use business data, rules, playbooks, and human review to recommend or execute next actions.",
      scenario:
        "Use business agents after workflow agents prove value and the organization is ready to connect AI to higher-value business results.",
      example:
        "A market-entry agent can generate a legal roadmap based on industry, company structure, hiring plans, immigration needs, data use, and payment flows.",
      relatedTerms: ["Workflow Agent", "Playbook", "Evaluation", "Human-in-the-loop"],
      tags: ["Agent", "Business", "Outcome"],
      topic: "Agent",
      sourceTool: "Seed",
      status: "ready"
    },
    {
      term: "RAG",
      fullName: "Retrieval-Augmented Generation",
      chineseName: "检索增强生成",
      oneLine: "A pattern where the system retrieves relevant knowledge before generating an answer.",
      plainExplanation:
        "RAG helps AI answer from your documents, policies, templates, notes, and knowledge base instead of relying only on model memory.",
      scenario:
        "Use RAG when answers need to be grounded in private or frequently changing knowledge.",
      example:
        "A professional services firm can use RAG over templates, checklists, FAQs, and process notes to draft a first version of a client brief.",
      relatedTerms: ["Knowledge Base", "Citation", "Workflow Agent", "Evaluation"],
      tags: ["Agent", "AI", "Knowledge"],
      topic: "Agent",
      sourceTool: "Seed",
      status: "ready"
    }
  ];
})(globalThis);
