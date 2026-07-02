# AI Glossary Kit

Cross-AI bilingual glossary capture for people learning and working with AI tools.

AI Glossary Kit helps you look up a term once, save it as a structured concept card, and retrieve it later from your browser. It is local-first, bilingual by default, and does not require an AI API key.

## Why

When working with ChatGPT, Claude, Gemini, Perplexity, Cursor, Codex, docs, or customer conversations, people constantly run into domain-specific terms:

- ICP
- SDR
- RAG
- Workflow Agent
- MQL / SQL
- Landing Page
- KYC / AML

The problem is not only "what does this mean?" The bigger problem is remembering, organizing, and reusing the explanation across tools.

AI Glossary Kit solves this with a small shared protocol and a browser-based workflow:

1. Search a term.
2. Capture it as a draft.
3. Import a standard glossary card from any AI tool.
4. Retrieve it from the dashboard or Chrome extension later.

## Features

- Bilingual glossary fields: English + Chinese.
- Web dashboard for search, filtering, editing, import, and export.
- Chrome extension popup for quick search and capture.
- Right-click selected text on any page and save it as a draft term.
- Standard card parser for JSON and key-value text cards.
- Local-first storage with `chrome.storage.local` inside the extension.
- Standalone web dashboard fallback with IndexedDB.
- Export to JSON or Markdown.
- No AI API required.

## Install The Chrome Extension

1. Download or clone this repository.
2. Open Chrome and visit `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the project folder: `ai-glossary-kit/`.
6. Pin the extension if you want it available from the toolbar.

The extension uses the project root as the extension root because `manifest.json` lives at the root.

## Use The Dashboard

After installing the extension, click the extension icon and choose **Open dashboard**.

You can also open the dashboard as a normal web page for development:

```bash
npm run serve
```

Then visit:

```text
http://localhost:5173/web/
```

Standalone web mode stores data in the browser's IndexedDB. Extension mode stores data in Chrome extension storage, shared by the popup, right-click capture, and dashboard.

## Cross-AI Workflow

AI tools do not all expose the same plugin APIs. Instead of depending on one platform, AI Glossary Kit uses a common card format.

Ask any AI tool to explain a term and output a card like this:

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
来源工具：ChatGPT
来源链接：
备注：
```

Paste that into **Import card**, and it becomes searchable.

See [docs/card-protocol.md](docs/card-protocol.md) for the full protocol.

## Project Structure

```text
ai-glossary-kit/
├── manifest.json              # Chrome extension manifest
├── src/
│   ├── schema.js              # Term schema, normalization, dedupe helpers
│   ├── parser.js              # JSON and text-card parser
│   ├── storage.js             # chrome.storage / IndexedDB adapter
│   └── seed.js                # Default bilingual example terms
├── web/
│   ├── index.html             # Dashboard
│   ├── styles.css
│   └── app.js
├── extension/
│   ├── background.js          # Context-menu capture
│   ├── popup.html
│   ├── popup.css
│   └── popup.js
├── docs/
│   └── card-protocol.md
├── prompts/
│   └── glossary-card-prompt.md
└── examples/
    └── seed-glossary.json
```

## Development

Run the local checks:

```bash
npm run check
```

Serve the web dashboard:

```bash
npm run serve
```

Reload the unpacked extension in `chrome://extensions` after changing extension files.

## Privacy

AI Glossary Kit is local-first:

- It does not send glossary data to a server.
- It does not require an API key.
- It stores extension data in `chrome.storage.local`.
- It stores standalone web data in IndexedDB.

If you paste sensitive content into a glossary card, it stays in your local browser unless you export or sync it yourself.

## Roadmap

- Import from Markdown, CSV, Obsidian, and Notion exports.
- Better duplicate detection across abbreviations and bilingual aliases.
- Optional GitHub Gist or WebDAV sync.
- Browser sidebar mode.
- Review/flashcard mode.
- Optional AI provider adapters for users who want automatic explanations.

## License

MIT
