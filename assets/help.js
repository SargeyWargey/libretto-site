// Libretto Help: what the guides do in the browser. No libraries, no build step.
// On a guide: the On This Page list (beside it, or folded under the title on narrower screens),
// a link on each heading, the list of guides folding away on a phone, and the reading time.
// On the Help home, and from the search box beside every guide: search across all the guides,
// fetched the first time it's used.

document.documentElement.classList.add("js");
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

// Every guide, in the order the list has them. Search reads these pages.
const GUIDES = [
  ["getting-started.html", "Getting started"],
  ["reading.html", "Reading"],
  ["read-along.html", "Read-Along and audiobooks"],
  ["hands-free.html", "Hands-free reading"],
  ["story.html", "Recaps, Story Map and the AI"],
  ["sync.html", "Sync with iCloud"],
  ["goals.html", "Goals, stats and sharing"],
  ["hardcover.html", "Hardcover"],
  ["devices.html", "iPad, Duo, Watch and TV"],
  ["shortcuts.html", "Widgets, Siri and Shortcuts"],
  ["settings.html", "Every setting"],
  ["troubleshooting.html", "Troubleshooting"],
];

const doc = document.querySelector(".help-page .doc");

// A guide ----------------------------------------------------------------------
if (doc) {
  const sections = [...doc.querySelectorAll(".doc__sec[id]")].filter((s) => s.querySelector("h2"));
  const labels = new Map(sections.map((s) => [s.id, s.querySelector("h2").textContent.trim()]));

  // Links on headings.
  const anchor = (h, id) => {
    const a = document.createElement("a");
    a.className = "anchor"; a.href = `#${id}`; a.textContent = "#";
    a.setAttribute("aria-label", `Link to “${h.textContent.trim()}”`);
    h.append(a);
  };
  sections.forEach((s) => anchor(s.querySelector("h2"), s.id));
  doc.querySelectorAll(".doc__sec h3[id]").forEach((h) => anchor(h, h.id));

  // On This Page.
  const label = (s) => labels.get(s.id);
  const list = () => {
    const ol = document.createElement("ol");
    sections.forEach((s) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = `#${s.id}`; a.textContent = label(s); a.dataset.for = s.id;
      li.append(a); ol.append(li);
    });
    return ol;
  };
  const toc = document.querySelector(".toc");
  if (toc && sections.length > 1) {
    const p = document.createElement("p"); p.textContent = "On this page";
    toc.append(p, list());
    const inline = document.createElement("details");
    inline.className = "toc-inline";
    const summary = document.createElement("summary"); summary.textContent = "On this page";
    inline.append(summary, list());
    (doc.querySelector(".gist") || doc.querySelector(".doc__head")).after(inline);

    // The section being read, marked in the list.
    const links = [...toc.querySelectorAll("a")];
    const mark = () => {
      const line = window.innerHeight * 0.3;
      let here = sections[0];
      for (const s of sections) if (s.getBoundingClientRect().top < line) here = s;
      links.forEach((a) => a.classList.toggle("is-here", a.dataset.for === here.id));
    };
    window.addEventListener("scroll", mark, { passive: true });
    mark();
  }

  // Reading time, at 230 words a minute, under the lede.
  const words = (doc.textContent.match(/\S+/g) || []).length;
  const lede = doc.querySelector(".doc__lede");
  if (lede && words > 300) {
    const t = document.createElement("p");
    t.className = "doc__time";
    t.textContent = `About ${Math.max(2, Math.round(words / 230))} minutes to read, or stop after the short version.`;
    lede.after(t);
  }
}

// The list of guides folds away on a phone.
const nav = document.querySelector(".guide-nav");
if (nav) {
  const current = nav.querySelector('[aria-current="page"]');
  const button = document.createElement("button");
  button.type = "button"; button.className = "guide-toggle"; button.setAttribute("aria-expanded", "false");
  button.innerHTML = `<span>${current ? `Guides: ${current.textContent}` : "All guides"}</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    button.setAttribute("aria-expanded", String(open));
  });
  nav.prepend(button);
}

// Search -------------------------------------------------------------------------
// Every word has to appear (the last one as you type it), ignoring case, accents and curly quotes.
const fold = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’‘]/g, "'").replace(/[“”]/g, '"').toLowerCase();
const escapeHTML = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let entries = null;
async function loadEntries() {
  if (entries) return entries;
  const base = document.querySelector('meta[name="help-base"]')?.content || "";
  const pages = await Promise.all(GUIDES.map(async ([file, title]) => {
    try {
      const html = await (await fetch(base + file)).text();
      const page = new DOMParser().parseFromString(html, "text/html");
      const found = [];
      const head = page.querySelector(".doc__head");
      const gist = page.querySelector(".gist");
      found.push({ file, guide: title, id: "", title, text: [head?.querySelector(".doc__lede")?.textContent, gist?.textContent].join(" ") });
      page.querySelectorAll(".doc__sec[id]").forEach((s) => {
        const h = s.querySelector("h2");
        if (h) found.push({ file, guide: title, id: s.id, title: h.textContent.trim(), text: s.textContent.replace(h.textContent, "") });
      });
      page.querySelectorAll(".doc__sec h3[id]").forEach((h) => {
        found.push({ file, guide: title, id: h.id, title: h.textContent.trim(), text: h.nextElementSibling?.textContent || "" });
      });
      return found;
    } catch { return [{ file, guide: title, id: "", title, text: "" }]; }
  }));
  entries = pages.flat().map((e) => {
    const text = e.text.replace(/\s+/g, " ").trim();
    return { ...e, text, ftitle: fold(e.title), ftext: fold(text), fguide: fold(e.guide) };
  });
  return entries;
}

function search(all, query) {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const has = (hay, t, i) => (i === terms.length - 1 ? hay.includes(t) : new RegExp(`(^|[^a-z0-9])${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(hay));
  return all
    .map((e) => {
      const hay = `${e.ftitle} ${e.fguide} ${e.ftext}`;
      if (!terms.every((t, i) => has(hay, t, i))) return null;
      let score = 0;
      // The words together, as typed, count for most.
      const phrase = terms.join(" ");
      if (terms.length > 1) {
        if (e.ftitle.includes(phrase)) score += 30;
        score += Math.min(4, e.ftext.split(phrase).length - 1) * 10;
      }
      terms.forEach((t) => {
        if (e.ftitle.includes(t)) score += 8;
        if (e.fguide.includes(t)) score += 2;
        score += Math.min(6, e.ftext.split(t).length - 1);
      });
      if (!e.id) score += 1;
      return { e, score };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 12)
    .map(({ e }) => ({ e, terms }));
}

function snippet(e, terms) {
  const whole = terms.length > 1 ? e.ftext.indexOf(terms.join(" ")) : -1;
  const at = whole >= 0 ? whole : terms.map((t) => e.ftext.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
  const from = Math.max(0, at - 70);
  let s = e.text.slice(from, from + 190);
  if (from > 0) s = "…" + s.replace(/^\S*\s/, "");
  if (from + 190 < e.text.length) s = s.replace(/\s\S*$/, "") + "…";
  let out = escapeHTML(s);
  terms.forEach((t) => {
    if (t.length < 2) return;
    out = out.replace(new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"), "<mark>$1</mark>");
  });
  return out;
}

const box = document.getElementById("help-search");
const results = document.getElementById("help-results");
if (box && results) {
  let ticket = 0;
  const run = async () => {
    const q = box.value.trim();
    const mine = ++ticket;
    if (!q) { results.innerHTML = ""; return; }
    const all = await loadEntries();
    if (mine !== ticket) return;
    const found = search(all, q);
    results.innerHTML = found.length
      ? found.map(({ e, terms }) => `<a href="${e.file}${e.id ? `#${e.id}` : ""}"><span class="r-where">${escapeHTML(e.guide)}</span><span class="r-title">${escapeHTML(e.title)}</span>${e.text ? `<span class="r-snip">${snippet(e, terms)}</span>` : ""}</a>`).join("")
      : `<p class="r-none">Nothing in the guides matches “${escapeHTML(q)}”. Try fewer words, or <a href="../support.html">ask us</a>.</p>`;
  };
  box.addEventListener("input", run);
  box.addEventListener("focus", () => { loadEntries(); }, { once: true });
  box.closest("form")?.addEventListener("submit", (e) => { e.preventDefault(); run(); });
  const q = new URLSearchParams(location.search).get("q");
  if (q) { box.value = q; run(); }
}
