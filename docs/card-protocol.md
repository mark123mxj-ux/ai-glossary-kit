# Glossary Card Protocol

AI Glossary Kit is designed around a small, portable glossary card format.

The goal is simple: any AI tool can output the same structure, and the dashboard or browser extension can parse it.

## Canonical JSON Shape

```json
{
  "term": "ICP",
  "fullName": "Ideal Customer Profile",
  "chineseName": "理想客户画像",
  "oneLine": "The type of customer most worth acquiring and serving.",
  "plainExplanation": "ICP is not just a broad target audience. It defines the customer segment with the strongest pain, best fit, highest value, and clearest buying path.",
  "scenario": "Use ICP to decide website positioning, SEO topics, landing pages, outbound lists, sales scripts, and product packaging.",
  "example": "A UK law firm may define an ICP as China-based companies entering the UK/EU market.",
  "relatedTerms": ["SDR", "ABM", "Lead", "MQL", "SQL"],
  "tags": ["Growth", "Sales", "B2B"],
  "topic": "Growth",
  "sourceTool": "ChatGPT",
  "sourceUrl": "",
  "notes": "",
  "status": "ready"
}
```

## Text Card Format

The parser also accepts key-value text cards, which are easier to copy from AI chats.

```text
词条：ICP
英文全称：Ideal Customer Profile
中文名：理想客户画像
一句话解释：最值得主动获取、最容易成交、长期价值最高的客户类型。
通俗解释：ICP 不是泛泛的目标客户，而是你最应该把增长资源花在谁身上。
业务场景：用于决定官网内容、SEO、销售触达和产品包装应该服务谁。
例子：中国企业出海英国的 SaaS 公司，可以是某律所的一个 ICP。
主题：Growth
相关词：SDR, ABM, Lead, MQL, SQL
标签：Growth, Sales, B2B
来源工具：ChatGPT
来源链接：
备注：
```

## Supported Field Aliases

The parser supports English and Chinese labels.

| Canonical field | Accepted labels |
| --- | --- |
| `term` | `term`, `词条`, `术语`, `name` |
| `fullName` | `fullName`, `full name`, `英文全称`, `英文名` |
| `chineseName` | `chineseName`, `chinese name`, `中文名`, `中文解释名` |
| `oneLine` | `oneLine`, `one line`, `一句话解释`, `一句话理解` |
| `plainExplanation` | `plainExplanation`, `plain explanation`, `通俗解释`, `大白话解释` |
| `scenario` | `scenario`, `business scenario`, `业务场景`, `使用场景` |
| `example` | `example`, `例子`, `案例`, `业务例子`, `Raymond Legal 例子` |
| `relatedTerms` | `relatedTerms`, `related terms`, `相关词`, `关联词` |
| `tags` | `tags`, `标签` |
| `topic` | `topic`, `主题`, `所属主题` |
| `sourceTool` | `sourceTool`, `source tool`, `来源工具` |
| `sourceUrl` | `sourceUrl`, `source url`, `来源链接` |
| `notes` | `notes`, `备注`, `我的理解备注` |

## Topics

Current built-in topics:

- `Growth`
- `Sales`
- `Content`
- `SEO`
- `Agent`
- `Legal Tech`
- `Business Model`
- `Product`
- `Other`

## Status

Use `draft` for captured terms that still need explanation.

Use `ready` for reviewed or imported glossary cards.

## Multiple Cards

Multiple text cards can be separated with:

```text
---
```

Example:

```text
词条：ICP
一句话解释：...

---

词条：SDR
一句话解释：...
```

## Design Principles

- Portable across AI tools.
- Human-readable before machine-readable.
- Bilingual by default.
- Local-first and privacy-preserving.
- Useful without any API key.
