# Keyword Blocker

A small Chrome/Edge/Brave extension that hides videos, posts, comments and search results containing keywords you choose. Everything runs locally in your browser.

## Install

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Configure

Edit the `BLOCKED` list at the top of `content.js`, then reload the extension and refresh the page.

```js
const BLOCKED = ["keyword one", "keyword two"];
```

Matching is case-insensitive and based on the text of each item.

## Supported sites

Tuned for YouTube, Reddit, X/Twitter and common search engines, with a generic fallback for `article` and list items elsewhere.

## License

MIT
