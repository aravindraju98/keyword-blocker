const form = document.getElementById("form");
const input = document.getElementById("input");
const list = document.getElementById("list");
const empty = document.getElementById("empty");

let keywords = [];

function save() {
  chrome.storage.sync.set({ keywords });
  render();
}

function render() {
  list.textContent = "";
  empty.hidden = keywords.length > 0;
  keywords.forEach((word, i) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    span.textContent = word;
    const btn = document.createElement("button");
    btn.textContent = "Remove";
    btn.addEventListener("click", () => {
      keywords.splice(i, 1);
      save();
    });
    li.append(span, btn);
    list.append(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const word = input.value.trim();
  if (word && !keywords.some(k => k.toLowerCase() === word.toLowerCase())) {
    keywords.push(word);
    save();
  }
  input.value = "";
});

chrome.storage.sync.get({ keywords: DEFAULT_KEYWORDS }, res => {
  keywords = res.keywords;
  render();
});
