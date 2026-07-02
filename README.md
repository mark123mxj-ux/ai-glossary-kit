# AI Glossary Kit

Cross-AI bilingual glossary capture for people learning and working with AI tools.

AI Glossary Kit helps you look up a term once, save it as a structured concept card, and retrieve it later from your browser. It is local-first, bilingual by default, and does not require an AI API key.

It is designed for the messy reality of modern AI work: you may ask ChatGPT today, Claude tomorrow, Codex inside a coding workspace, and Perplexity while researching. The glossary should belong to you, not to one AI product.

## What It Does

- Detects importable `Glossary Card` answers on supported AI pages and adds a **Save to AI Glossary Kit** button.
- Lets you right-click selected text to save a draft term.
- Lets you right-click a selected glossary card to import the full structured concept.
- Provides a browser dashboard for search, filtering, editing, related terms, and export.
- Includes a Codex skill template so Codex can append import-ready glossary cards.
- Uses a small open card protocol that any AI tool can output.

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
- Right-click selected glossary cards and import them directly.
- One-click save buttons for detected glossary cards on supported AI pages.
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

## One-Click Capture

On supported AI pages, the extension scans for standard glossary cards and inserts a save bar near the answer:

```text
Save card to AI Glossary Kit
```

Currently supported page patterns include:

- ChatGPT: `chatgpt.com`, `chat.openai.com`
- Claude: `claude.ai`
- Gemini: `gemini.google.com`
- Perplexity: `perplexity.ai`
- Microsoft Copilot: `copilot.microsoft.com`
- Poe: `poe.com`
- Local development pages: `localhost`, `127.0.0.1`

The extension does not call an AI API. It only saves cards that already appear on the page.

You can also use the context menu anywhere:

- Select a single term, then right-click **Save selected text as draft term**.
- Select a full glossary card, then right-click **Import selected glossary card**.

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

## Codex Skill

This repository includes a lightweight Codex skill template:

```text
codex-skill/ai-glossary-kit/
```

To install it locally:

```bash
mkdir -p ~/.codex/skills
cp -R codex-skill/ai-glossary-kit ~/.codex/skills/
```

After that, ask Codex questions like:

```text
Use $ai-glossary-kit. What does SDR mean?
```

Codex will answer normally and append an import-ready `Glossary Card`. If the answer is shown in a supported browser page, use the one-click save button. Otherwise, copy the card into the dashboard or extension import box.

## Project Structure

```text
ai-glossary-kit/
├── manifest.json              # Chrome extension manifest
├── codex-skill/
│   └── ai-glossary-kit/        # Optional Codex skill template
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
│   ├── content.js             # One-click save button injection
│   ├── content.css
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
- The content script only looks for importable glossary-card patterns on supported AI pages.

If you paste sensitive content into a glossary card, it stays in your local browser unless you export or sync it yourself.

## Current Limitations

- The extension does not generate explanations by itself. Without an AI API, selected bare terms are saved as drafts.
- One-click card detection depends on the AI answer containing the standard card format.
- Codex desktop cannot write directly into Chrome extension storage yet. Use the Codex skill to generate a card, then save it through the browser extension or dashboard.
- Sync is not built in yet. Export JSON or Markdown for backup.

## Roadmap

- Import from Markdown, CSV, Obsidian, and Notion exports.
- Better duplicate detection across abbreviations and bilingual aliases.
- Optional GitHub Gist or WebDAV sync.
- Browser sidebar mode.
- Review/flashcard mode.
- Optional AI provider adapters for users who want automatic explanations.
- Optional local bridge CLI for direct Codex-to-glossary import.

## License

MIT
