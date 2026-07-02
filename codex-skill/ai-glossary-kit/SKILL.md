---
name: ai-glossary-kit
description: Generate bilingual, importable glossary cards for AI Glossary Kit. Use when the user asks what a term means, asks to explain a business/AI/growth/sales/product/legal-tech concept, asks to save or collect a term, or wants Codex answers formatted for import into the AI Glossary Kit browser extension or dashboard.
---

# AI Glossary Kit

Use this skill to make Codex answers easy to save into AI Glossary Kit.

## Workflow

1. Answer the user's term question normally first.
2. Append a section titled `Glossary Card`.
3. Use the exact key-value format below.
4. Keep the card concise, bilingual, and import-ready.
5. Set `来源工具：Codex`.
6. Leave `来源链接：` blank unless the user provided a URL or source.

## Card Format

Use this exact format:

```text
词条：
英文全称：
中文名：
一句话解释：
通俗解释：
业务场景：
例子：
主题：
相关词：
标签：
来源工具：Codex
来源链接：
备注：
```

## Field Guidance

- `词条`: The term as the user asked it.
- `英文全称`: Expand abbreviations when known. Leave blank if not applicable.
- `中文名`: Provide a natural Chinese name.
- `一句话解释`: One concise sentence.
- `通俗解释`: Plain-language explanation for a non-expert.
- `业务场景`: Where the concept is used.
- `例子`: Concrete example, preferably tied to the user's context when available.
- `主题`: Choose one of `Growth`, `Sales`, `Content`, `SEO`, `Agent`, `Legal Tech`, `Business Model`, `Product`, `Other`.
- `相关词`: Comma-separated related terms.
- `标签`: Comma-separated tags.
- `备注`: Optional nuance or caveat. Leave blank if unnecessary.

## Boundaries

AI Glossary Kit is local-first. Codex can generate the importable card, but it cannot directly save into the browser extension storage unless the user has provided a specific local automation or asks for file/project edits. Tell the user to copy the `Glossary Card` into the dashboard or extension import box when needed.

## Example

Glossary Card

```text
词条：SDR
英文全称：Sales Development Representative
中文名：销售开发代表
一句话解释：负责寻找、筛选并预约潜在客户的人。
通俗解释：SDR 通常不负责最终成交，而是把合适的潜在客户找出来，确认是否符合 ICP，再预约初次沟通。
业务场景：在 B2B 增长里，SDR 承接 ICP 名单、触达话术和线索筛选。
例子：一家律所可以让 SDR 找到近期在英国注册公司、融资或招聘的出海企业。
主题：Sales
相关词：ICP, Lead, MQL, SQL, CRM
标签：Sales, Growth, Outbound
来源工具：Codex
来源链接：
备注：
```
