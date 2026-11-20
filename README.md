# Keyword Blocker

A small Chrome/Edge/Brave extension that hides videos, posts, comments and search results containing keywords you choose. Everything runs locally in your browser.

## Why I built this

I tried to remove Asmongold content from YouTube (using "Not interested" and "Don't recommend channel"), but it kept coming back. This extension hides anything matching keywords I choose, so I don't have to keep fighting the recommendations.

## Install

1. Open `chrome://extensions` (or `edge://extensions`).
2. Enable **Developer mode**.
3. Click **Load unpacked** and select this folder.

## Configure

Click the extension's toolbar icon to add or remove keywords. Changes apply immediately on open tabs and sync across your signed-in browsers. The starting list is in `defaults.js`; once you edit it in the popup, your saved list is used instead.

Matching is case-insensitive and based on the text of each item.

## Supported sites

Tuned for YouTube, Reddit, X/Twitter and common search engines, with a generic fallback for `article` and list items elsewhere.

## License

MIT
