// Keywords are managed from the extension popup and stored in chrome.storage.sync.
let re = null;

function setKeywords(list) {
  const words = (list || []).filter(Boolean);
  re = words.length
    ? new RegExp(words.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|"), "i")
    : null;
}

// Specific item containers: hidden whenever their text matches (no size limit).
const SPECIFIC = [
  // YouTube
  "ytd-rich-item-renderer",
  "ytd-video-renderer",
  "ytd-compact-video-renderer",
  "ytd-grid-video-renderer",
  "ytd-playlist-video-renderer",
  "ytd-playlist-renderer",
  "ytd-channel-renderer",
  "ytd-reel-item-renderer",
  "ytd-reel-shelf-renderer",
  "ytd-shelf-renderer",
  "ytd-horizontal-card-list-renderer",
  "ytd-comment-thread-renderer",
  "ytd-search-refinement-card-renderer",
  "ytd-secondary-search-container-renderer",
  "yt-lockup-view-model",
  "ytm-shorts-lockup-view-model",
  "grid-shelf-view-model",
  "yt-chip-cloud-chip-renderer",
  "ytd-guide-entry-renderer",
  "ytd-mini-guide-entry-renderer",
  "ytd-search-suggestion-renderer",
  "ytd-notification-renderer",
  // Reddit
  "shreddit-post",
  "shreddit-comment",
  // Twitter / X
  "article[data-testid='tweet']",
  "[data-testid='UserCell']",
  "[data-testid='trend']",
  // Search engines
  "div.g",
  "li.b_algo",
  "article[data-testid='result']"
].join(",");

// Generic containers: only hidden if reasonably small, to avoid hiding page layout wrappers.
const GENERIC = ["article", "[role='article']", "li", "[role='option']"].join(",");
const GENERIC_MAX_LEN = 1500;

const HIDDEN_ATTR = "data-noassguy";

function hide(el) {
  el.setAttribute(HIDDEN_ATTR, "1");
  el.style.setProperty("display", "none", "important");
}
function show(el) {
  el.removeAttribute(HIDDEN_ATTR);
  el.style.removeProperty("display");
}

function process(list, maxLen) {
  for (const el of list) {
    const text = el.textContent || "";
    const matches = re ? re.test(text) : false;
    const hidden = el.hasAttribute(HIDDEN_ATTR);
    if (matches && !hidden) {
      if (maxLen && text.length > maxLen) continue;
      hide(el);
    } else if (!matches && hidden) {
      show(el); // YouTube recycles elements, so restore when content changes
    }
  }
}

function scan() {
  process(document.querySelectorAll(SPECIFIC), 0);
  process(document.querySelectorAll(GENERIC), GENERIC_MAX_LEN);
}

let timer = null;
function schedule() {
  if (timer) return;
  timer = setTimeout(() => { timer = null; scan(); }, 150);
}

new MutationObserver(schedule).observe(document.documentElement, {
  childList: true,
  subtree: true,
  characterData: true
});
// YouTube is a single-page app: rescan on its navigation events too.
window.addEventListener("yt-navigate-finish", schedule);
document.addEventListener("scroll", schedule, { passive: true });

chrome.storage.sync.get({ keywords: DEFAULT_KEYWORDS }, ({ keywords }) => {
  setKeywords(keywords);
  scan();
});
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.keywords) {
    setKeywords(changes.keywords.newValue);
    scan(); // hides new matches and restores items that no longer match
  }
});
