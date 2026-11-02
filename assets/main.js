// Libretto site: the demos on the page. No libraries.

// Set this once Libretto is live, and every "Download" link on the site points at the App Store.
const APP_STORE_URL = "";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (APP_STORE_URL) {
  document.querySelectorAll("[data-store-link]").forEach((a) => { a.href = APP_STORE_URL; });
}
document.querySelectorAll("[data-year]").forEach((el) => { el.textContent = new Date().getFullYear(); });

// Wraps each word of an element's text in a span, keeping inline markup like <em>.
function wrapWords(root, className) {
  const words = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  for (const node of nodes) {
    const parts = node.textContent.split(/(\s+)/);
    if (parts.length === 1 && !parts[0].trim()) continue;
    const frag = document.createDocumentFragment();
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) { frag.append(part); continue; }
      const span = document.createElement("span");
      span.className = className;
      span.textContent = part;
      frag.append(span);
      words.push(span);
    }
    node.replaceWith(frag);
  }
  return words;
}

// How long a narrator spends on a word, with a breath after punctuation.
function wordTime(text, pace = 1) {
  let ms = 120 + text.length * 30;
  if (/[,;:]["”’]?$/.test(text)) ms += 170;
  if (/[.?!]["”’]?$/.test(text)) ms += 320;
  return ms * pace;
}

// Radio groups: arrow keys move the choice, as they do in native controls.
function radioGroup(group, onPick) {
  const radios = [...group.querySelectorAll('[role="radio"]')];
  const pick = (radio, focus) => {
    radios.forEach((r) => {
      const on = r === radio;
      r.setAttribute("aria-checked", String(on));
      r.tabIndex = on ? 0 : -1;
    });
    if (focus) radio.focus();
    onPick(radio);
  };
  radios.forEach((r) => {
    r.tabIndex = r.getAttribute("aria-checked") === "true" ? 0 : -1;
    r.addEventListener("click", () => pick(r, false));
    r.addEventListener("keydown", (e) => {
      const i = radios.indexOf(r);
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
      if (!step) return;
      e.preventDefault();
      pick(radios[(i + step + radios.length) % radios.length], true);
    });
  });
}

// The nav's icon wakes up ---------------------------------------------------------
// As the app's splash does, with its timings (Libretto/App/SplashArt.swift): a sleepy closed book
// hops and flops open, the headphones drop on, the bars pop and bounce while it nods along, and it
// winks. On the first page of a visit, not with Reduce Motion; then the icon image is back.

(() => {
  const img = document.querySelector(".brand img");
  if (!img || reduceMotion) return;
  try {
    if (sessionStorage.getItem("brandWoke")) return;
    sessionStorage.setItem("brandWoke", "1");
  } catch { /* no storage: it wakes on every page */ }

  // Design/AppIcon.svg in parts, clipped to the icon's rounded square.
  const icon = document.createElement("span");
  icon.className = "brand__icon";
  icon.innerHTML = `<svg viewBox="0 0 1024 1024" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id="bw-tile"><rect width="1024" height="1024" rx="256"/></clipPath>
      <linearGradient id="bw-bg" x1="120" y1="80" x2="900" y2="960" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#163B68"/><stop offset="1" stop-color="#302166"/></linearGradient>
      <linearGradient id="bw-phones" x1="250" y1="275" x2="780" y2="730" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#7DE3F4"/><stop offset="1" stop-color="#69A8FF"/></linearGradient>
      <linearGradient id="bw-lp" x1="270" y1="450" x2="510" y2="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9F1FF"/></linearGradient>
      <linearGradient id="bw-rp" x1="755" y1="450" x2="515" y2="760" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9F1FF"/></linearGradient>
      <linearGradient id="bw-cover" x1="508" y1="408" x2="744" y2="780" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#69A8FF"/><stop offset="1" stop-color="#517DD6"/></linearGradient>
      <filter id="bw-shadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="24" stdDeviation="22" flood-color="#0B153D" flood-opacity="0.3"/></filter>
    </defs>
    <g clip-path="url(#bw-tile)">
      <rect width="1024" height="1024" fill="url(#bw-bg)"/>
      <g data-part="halo"><circle cx="512" cy="510" r="348" fill="#FFFFFF" opacity="0.035"/><circle cx="512" cy="510" r="270" fill="#FFFFFF" opacity="0.025"/></g>
      <circle data-part="ripple" cx="512" cy="510" r="300" fill="none" stroke="#7DE3F4"/>
      <circle data-part="ripple" cx="512" cy="510" r="300" fill="none" stroke="#7DE3F4"/>
      <g data-part="head"><g filter="url(#bw-shadow)">
        <g data-part="phones">
          <path d="M252 526V493C252 340 365 236 512 236C659 236 772 340 772 493V526" fill="none" stroke="url(#bw-phones)" stroke-width="74" stroke-linecap="round"/>
          <g data-part="cupL"><rect x="195" y="486" width="130" height="244" rx="65" fill="url(#bw-phones)"/><rect data-part="eyeL" x="224" y="528" width="58" height="160" rx="29" fill="#1B3567" opacity="0.76"/></g>
          <g data-part="cupR"><rect x="699" y="486" width="130" height="244" rx="65" fill="url(#bw-phones)"/><rect data-part="eyeR" x="742" y="528" width="58" height="160" rx="29" fill="#1B3567" opacity="0.76"/></g>
        </g>
        <g data-part="book">
          <path d="M512 488C562 444 637 420 730 425V700C635 696 562 719 512 766V488Z" fill="url(#bw-rp)"/>
          <path data-ink="1" pathLength="1" d="M680 505C628 507 586 521 554 543"/>
          <path data-ink="3" pathLength="1" d="M680 558C628 560 586 574 554 596"/>
          <line data-bar="3" x1="549" x2="549"/><line data-bar="4" x1="585" x2="585"/><line data-bar="5" x1="621" x2="621"/>
          <g data-part="left">
            <path d="M512 488C462 444 387 420 294 425V700C389 696 462 719 512 766V488Z" fill="url(#bw-lp)"/>
            <path data-ink="0" pathLength="1" d="M344 505C396 507 438 521 470 543"/>
            <path data-ink="2" pathLength="1" d="M344 558C396 560 438 574 470 596"/>
            <line data-bar="0" x1="403" x2="403"/><line data-bar="1" x1="439" x2="439"/><line data-bar="2" x1="475" x2="475"/>
          </g>
          <path data-part="spine" d="M512 488V766" stroke="#C8D8F3" stroke-width="15" stroke-linecap="round"/>
          <g data-part="cover">
            <rect x="514" y="414" width="238" height="372" rx="18" fill="#E9F1FF"/>
            <rect x="508" y="408" width="236" height="372" rx="18" fill="url(#bw-cover)"/>
            <rect x="532" y="408" width="6" height="372" fill="#517DD6" opacity="0.7"/>
            <rect x="560" y="486" width="132" height="44" rx="12" fill="#EEF0FA" opacity="0.9"/>
            <rect x="584" y="552" width="84" height="10" rx="5" fill="#EEF0FA" opacity="0.5"/>
          </g>
        </g>
      </g></g>
      <g fill="none" stroke="#7DE3F4" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
        <path data-part="zee" d="M-13 -15H13L-13 15H13"/><path data-part="zee" d="M-13 -15H13L-13 15H13"/><path data-part="zee" d="M-13 -15H13L-13 15H13"/>
      </g>
      <path data-part="sparkle" fill="#7DE3F4" d="M0 -34C4 -8 8 -4 34 0C8 4 4 8 0 34C-4 8 -8 4 -34 0C-8 -4 -4 -8 0 -34Z"/>
    </g>
  </svg>`;
  const part = (name) => icon.querySelector(`[data-part="${name}"]`);
  const parts = (name) => [...icon.querySelectorAll(`[data-part="${name}"]`)];
  const [halo, head, phones, cupL, cupR, eyeL, eyeR, book, left, spine, cover, sparkle] =
    ["halo", "head", "phones", "cupL", "cupR", "eyeL", "eyeR", "book", "left", "spine", "cover", "sparkle"].map(part);
  const ripples = parts("ripple"), zees = parts("zee");
  const inks = [...icon.querySelectorAll("[data-ink]")];
  const bars = [...icon.querySelectorAll("[data-bar]")];
  inks.forEach((p) => p.setAttribute("style", "fill:none;stroke:#91A9D0;stroke-width:14;stroke-linecap:round;opacity:.72;stroke-dasharray:1 1"));
  bars.forEach((l) => l.setAttribute("style", "stroke:#517DD6;stroke-width:18;stroke-linecap:round"));

  const T = { wake: 0.12, crouch: 0.16, hop: 0.26, apex: 0.44, land: 0.6, ink: 0.62, drop: 0.62, hit: 0.9, bars: 0.98, beat: 1.1, wink: 1.66, end: 2.4 };
  const BEAT = 0.34;
  const H = [19, 55, 81, 81, 55, 19], RING = [2, 1, 0, 0, 1, 2];
  const UP = [1, 0.3, 0.08, 0.08, 0.3, 1], DOWN = [0.4, 0.35, 0.3, 0.3, 0.35, 0.4], PHASE = [0, 1.9, 3.6, 0.7, 2.6, 4.4];
  const seg = (t, a, b) => Math.min(Math.max((t - a) / (b - a), 0), 1);
  const lerp = (a, b, p) => a + (b - a) * p;
  const eo = (x) => 1 - (1 - x) ** 3, ei = (x) => x ** 3;
  const eio = (x) => (x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2);
  const eob = (x, s = 1.4) => 1 + (s + 1) * (x - 1) ** 3 + s * (x - 1) ** 2;
  // A wobble dying away after a knock, u seconds ago: 1 at the knock.
  const ring = (u, f = 2.6, k = 7) => (u < 0 ? 0 : Math.exp(-k * u) * Math.cos(2 * Math.PI * f * u));
  const bump = (t, a, d) => Math.sin(Math.PI * seg(t, a, a + d));
  const about = (x, y, sx, sy) => `translate(${x} ${y}) scale(${sx} ${sy}) translate(${-x} ${-y})`;
  const move = (el, transform) => el.setAttribute("transform", transform);
  const show = (el, on) => { el.style.visibility = on ? "visible" : "hidden"; };

  function render(t) {
    // Asleep: z's float up from the closed book, and pop away as it wakes.
    const wake = seg(t, T.wake, T.wake + 0.12);
    zees.forEach((z, i) => {
      const p = ((t + 0.25 + i * 0.5) / 1.5) % 1, s = (0.55 + 0.7 * p) * (1 + 0.8 * eo(wake));
      move(z, `translate(${596 + 90 * p + 12 * Math.sin(p * 7)} ${392 - 180 * p}) rotate(-10) scale(${s})`);
      z.style.opacity = Math.sin(Math.PI * p) * (1 - wake);
    });
    // It crouches, springs up, flops open in the air and lands with a squash.
    const rise = eo(seg(t, T.hop, T.apex)), fall = ei(seg(t, T.apex, T.land));
    const squash = 0.12 * eo(seg(t, T.crouch, T.hop)) * (1 - eo(seg(t, T.hop, T.hop + 0.08)))
      - 0.08 * bump(t, T.hop, T.apex - T.hop) - (t < T.land ? 0.05 * fall : 0)
      + 0.14 * ring(t - T.land) + 0.05 * ring(t - T.hit, 3, 8);
    const breathe = 1 + 0.018 * Math.sin(2 * Math.PI * t / 0.8) * (1 - wake);
    const open = eio(seg(t, T.hop + 0.03, T.land - 0.03)), turn = Math.cos(Math.PI * open);
    const x = lerp(-112, 0, eio(seg(t, T.hop + 0.02, T.land - 0.04)));
    move(book, `translate(${x} ${-150 * (rise - fall)}) ${about(512, 766, 1 + 0.6 * squash, (1 - squash) * breathe)}`);
    move(cover, about(508, 0, Math.max(turn, 0.001), 1)); show(cover, turn > 0.01);
    move(left, about(512, 0, Math.max(-turn, 0.001), 1)); show(left, turn < -0.01);
    spine.style.opacity = Math.min(Math.max((open - 0.45) * 5, 0), 1);
    inks.forEach((path) => {
      const a = T.ink + Number(path.dataset.ink) * 0.05, p = eo(seg(t, a, a + 0.2));
      path.style.strokeDashoffset = 1 - p; show(path, p > 0.001);
    });
    // The headphones drop in from above, squash as they land, and the ear cups wobble.
    const f = seg(t, T.drop, T.hit), hs = (t < T.hit ? -0.1 * ei(f) : 0) + 0.12 * ring(t - T.hit, 2.4, 6.5);
    move(phones, `translate(0 ${lerp(-1400, 0, ei(f))}) rotate(${-8 * (1 - eo(f))} 512 480) ${about(512, 730, 1 + 0.5 * hs, 1 - hs)}`);
    const splay = 10 * ring(t - T.hit, 2.2, 5.5);
    move(cupL, `rotate(${splay} 260 486)`); move(cupR, `rotate(${-splay} 764 486)`);
    ripples.forEach((c, i) => {
      const p = seg(t, T.hit + i * 0.1, T.hit + i * 0.1 + 0.6);
      c.setAttribute("r", lerp(290, 560, eo(p)));
      c.style.strokeOpacity = p > 0 && p < 1 ? 0.5 * (1 - p) : 0;
      c.style.strokeWidth = lerp(8, 2, p);
    });
    // The bars pop from the middle out, then bounce to the beat, and settle.
    const swing = seg(t, T.bars + 0.18, T.beat) * (1 - seg(t, 2.0, T.end)), phase = 2 * Math.PI * (t - T.beat) / BEAT;
    bars.forEach((line) => {
      const i = Number(line.dataset.bar), a = T.bars + RING[i] * 0.05, pop = eob(seg(t, a, a + 0.16), 1.8);
      const w = 0.6 * Math.sin(phase + PHASE[i]) + 0.4 * Math.sin(2 * phase + 2 * PHASE[i]);
      const half = H[i] / 2 * pop * (1 + swing * (w > 0 ? UP[i] : DOWN[i]) * w);
      line.setAttribute("y1", 641.5 - half); line.setAttribute("y2", 641.5 + half); show(line, pop > 0.001);
    });
    // Two nods to the beat, then a lean into the wink.
    let nod = 0, sway = 0;
    [T.beat, T.beat + BEAT].forEach((b, i) => { nod += bump(t, b, 0.26); sway += (i ? 3 : -3) * bump(t, b, BEAT); });
    const lean = 6 * (eob(seg(t, T.wink - 0.08, T.wink + 0.05), 1.6) - eio(seg(t, 2.0, 2.3)));
    move(head, `translate(0 ${16 * nod}) rotate(${sway + lean} 512 766)`);
    const pulse = 1 + 0.05 * ring(t - T.hit, 1.5, 4) + 0.025 * nod;
    move(halo, about(512, 510, pulse, pulse));
    // The wink (the ear cups' dark sockets are its eyes), with a sparkle.
    const k = eo(seg(t, T.wink, T.wink + 0.06)) * (1 - eo(seg(t, T.wink + 0.12, T.wink + 0.24)));
    move(eyeR, about(771, 608, 1 + 0.08 * k, 1 - 0.88 * k)); move(eyeL, about(253, 608, 1, 1 - 0.12 * k));
    const s = eob(seg(t, T.wink + 0.03, T.wink + 0.17), 1.8) * (1 - ei(seg(t, T.wink + 0.26, T.wink + 0.42)));
    move(sparkle, `translate(872 450) rotate(${90 * seg(t, T.wink, T.wink + 0.42)}) scale(${Math.max(s, 0.001)})`);
    show(sparkle, s > 0.01);
  }

  // The icon's own time moves on with the frames, a twentieth of a second at most each, so a busy
  // page load (or a tab opened in the background) holds the picture rather than skipping ahead.
  let t = -0.25, last = 0;
  const step = (now) => {
    if (last) t += Math.min((now - last) / 1000, 0.05);
    last = now;
    render(Math.max(t, 0));
    if (t < T.end + 0.1) requestAnimationFrame(step); else icon.replaceWith(img);
  };
  render(0);
  img.replaceWith(icon);
  requestAnimationFrame(step);
})();

// Hero reader: Read-Along in miniature --------------------------------------

const heroReader = (() => {
  const screen = document.getElementById("hero-reader");
  if (!screen) return null;
  const viewport = screen.querySelector(".reader__viewport");
  const marker = screen.querySelector(".ra-marker");
  const status = document.getElementById("hero-status");
  const playBtn = screen.querySelector('[data-hero="play"]');
  const pages = [...viewport.querySelectorAll(".reader__page")];
  const words = pages.map((p) => wrapWords(p, "rw"));
  const statuses = ["2 pages left in chapter · 3 min", "1 page left in chapter · 2 min"];

  let page = 0;
  let word = 0;
  let playing = false;
  let timer = 0;

  // The line a word starts on, from each word's line boxes, so a word
  // hyphenated across two lines doesn't stretch the marker over both.
  function lineOf(span) {
    // Relative to the page, which fills the viewport at rest, so a page still sliding in measures the same.
    const vp = pages[page].getBoundingClientRect();
    const first = span.getClientRects()[0];
    const boxes = words[page].flatMap((w) => [...w.getClientRects()]).filter((r) => Math.abs(r.top - first.top) < 4);
    return {
      top: first.top - vp.top,
      left: Math.min(...boxes.map((r) => r.left)) - vp.left,
      right: Math.max(...boxes.map((r) => r.right)) - vp.left,
      height: first.height,
    };
  }

  function placeMarker() {
    const span = words[page][word];
    if (!span || !span.getClientRects().length) { marker.classList.remove("is-on"); return; }
    const l = lineOf(span);
    marker.style.transform = `translate(${l.left - 4}px, ${l.top - 1}px)`;
    marker.style.width = `${l.right - l.left + 8}px`;
    marker.style.height = `${l.height + 2}px`;
    marker.classList.add("is-on");
  }

  function showPage(next, direction = 1) {
    if (next === page || next < 0 || next >= pages.length) return false;
    const from = pages[page];
    const to = pages[next];
    from.className = "reader__page";
    to.className = "reader__page";
    to.hidden = false;
    if (!reduceMotion) {
      from.classList.add(direction > 0 ? "is-out" : "is-out-back");
      to.classList.add(direction > 0 ? "is-in" : "is-in-back");
      setTimeout(() => {
        if (pages[page] !== from) { from.hidden = true; from.className = "reader__page"; }
      }, 540);
    } else {
      from.hidden = true;
    }
    page = next;
    word = 0;
    status.textContent = statuses[page];
    marker.classList.remove("is-on");
    return true;
  }

  function step() {
    if (!playing) return;
    const span = words[page][word];
    if (!span) {
      // End of the page: turn it, as Read-Along does, or stop at the end of the passage.
      if (page < pages.length - 1) {
        showPage(page + 1, 1);
        timer = setTimeout(() => { placeMarker(); timer = setTimeout(step, 450); }, reduceMotion ? 0 : 520);
      } else {
        setPlaying(false);
        marker.classList.remove("is-on");
        word = 0;
      }
      return;
    }
    placeMarker();
    timer = setTimeout(() => { word += 1; step(); }, wordTime(span.textContent, 1.05));
  }

  function setPlaying(on) {
    playing = on;
    playBtn.setAttribute("aria-pressed", String(on));
    playBtn.setAttribute("aria-label", on ? "Pause narration" : "Play narration");
    clearTimeout(timer);
    if (on) {
      if (page === pages.length - 1 && !words[page][word]) showPage(0, -1);
      step();
    }
  }

  playBtn.addEventListener("click", () => setPlaying(!playing));
  screen.querySelector('[data-hero="next"]').addEventListener("click", () => {
    if (showPage(page + 1, 1) && playing) { clearTimeout(timer); timer = setTimeout(step, 520); }
  });
  screen.querySelector('[data-hero="prev"]').addEventListener("click", () => {
    if (showPage(page - 1, -1) && playing) { clearTimeout(timer); timer = setTimeout(step, 520); }
  });
  window.addEventListener("resize", () => { if (marker.classList.contains("is-on")) placeMarker(); });

  return { play: () => setPlaying(true), get playing() { return playing; } };
})();

// Hero headline: read aloud once, then the narration carries on into the book.

(() => {
  const title = document.getElementById("hero-title");
  if (!title) return;
  const startReader = () => {
    const phone = document.getElementById("hero-reader");
    if (!heroReader || !phone) return;
    // Start now if the phone is mostly on screen, or once it's scrolled to.
    const r = phone.getBoundingClientRect();
    const shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
    if (shown / r.height >= 0.45) { heroReader.play(); return; }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        if (!heroReader.playing) heroReader.play();
      }
    }, { threshold: 0.45 });
    io.observe(phone);
  };
  if (reduceMotion) return;

  const words = wrapWords(title, "w");
  title.classList.add("is-narrating");
  let i = 0;
  const next = () => {
    if (i > 0) { words[i - 1].classList.remove("is-now"); words[i - 1].classList.add("is-read"); }
    if (i >= words.length) {
      setTimeout(() => {
        title.classList.remove("is-narrating");
        words.forEach((w) => w.classList.remove("is-read"));
        startReader();
      }, 500);
      return;
    }
    const w = words[i];
    const ms = wordTime(w.textContent, 1.1);
    w.style.setProperty("--d", `${ms}ms`);
    w.classList.add("is-now");
    i += 1;
    setTimeout(next, ms);
  };
  // Let the fonts arrive first, so the words don't shift mid-sentence.
  const begin = () => setTimeout(next, 450);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin); else begin();
})();

// Catch Me Up: how long you've been away picks the recap ----------------------

(() => {
  const group = document.querySelector("#catch-up .seg");
  if (!group) return;
  const recaps = [...document.querySelectorAll("[data-recap]")];
  const sheet = document.querySelector("#catch-up .sheet");
  radioGroup(group, (radio) => {
    const which = radio.dataset.away;
    recaps.forEach((r) => {
      const on = r.dataset.recap === which;
      r.hidden = !on;
      r.classList.remove("is-writing");
      if (on && !reduceMotion) { void r.offsetWidth; r.classList.add("is-writing"); }
    });
    sheet.scrollTop = 0;
  });
})();

// Story Map: the iPad's Story view in miniature --------------------------------
// The mind map of Pride and Prejudice after seventeen chapters, laid out as the app lays it out
// (StoryTree.layout): the book at the root, a branch each for people (in their families), places
// and chapters, a name on each line. Tap a name to open or fold it.

(() => {
  const demo = document.getElementById("story-demo");
  if (!demo) return;
  const NS = "http://www.w3.org/2000/svg";
  const svg = demo.querySelector(".sv-canvas");
  const pane = demo.querySelector(".sv-map");
  const card = demo.querySelector(".sv-card");
  const outline = demo.querySelector(".sv-outline");
  const scopePill = demo.querySelector('[data-pill="scope"]');
  const focusPill = demo.querySelector('[data-pill="focus"]');

  const COLOR = { people: "#F25F6E", places: "#6BB8F5", chapters: "#F79A57" };
  const TAG = { liz: "#F2C94C", darcy: "#B07CF0", jane: "#45C7B8", bingley: "#8DD45F" };
  const BG = "#161618";
  const READ = 17;
  const TOTAL = 61;

  // Who's who, as seventeen chapters have it: who they are, chapters they're in, their tag, and who
  // they're connected to (with the relationship, where one's been said).
  const P = {
    elizabeth: { name: "Elizabeth Bennet", about: "The second daughter, quick and outspoken", seen: 17, tag: "liz",
      links: [["Mother", "mrsBennet"], ["Sister", "jane"], ["", "darcy"], ["", "wickham"], ["", "collins"], ["Friend", "charlotte"]] },
    jane: { name: "Jane Bennet", about: "The eldest, gentle, and admired by Mr. Bingley", seen: 11, tag: "jane",
      links: [["Sister", "elizabeth"], ["", "bingley"], ["", "missBingley"]] },
    mrsBennet: { name: "Mrs. Bennet", about: "Set on seeing her daughters married", seen: 12,
      links: [["Husband", "mrBennet"], ["Daughter", "jane"], ["Daughter", "elizabeth"], ["Sister", "mrsPhilips"]] },
    mrBennet: { name: "Mr. Bennet", about: "Their father, dry and detached", seen: 9,
      links: [["Wife", "mrsBennet"], ["Cousin", "collins"], ["Daughter", "elizabeth"]] },
    lydia: { name: "Lydia Bennet", about: "The youngest, wild about the officers", seen: 6, links: [["Sister", "kitty"], ["", "denny"]] },
    kitty: { name: "Kitty Bennet", about: "The fourth daughter, Lydia’s shadow", seen: 4, links: [["Sister", "lydia"]] },
    mary: { name: "Mary Bennet", about: "The bookish middle sister", seen: 4, links: [["Sister", "elizabeth"]] },
    darcy: { name: "Mr. Darcy", about: "Bingley’s wealthy friend, thought proud", seen: 12, tag: "darcy",
      links: [["Friend", "bingley"], ["", "elizabeth"], ["", "wickham"], ["", "missBingley"], ["Aunt", "catherine"]] },
    bingley: { name: "Mr. Bingley", about: "The rich, easy-going tenant of Netherfield", seen: 10, tag: "bingley",
      links: [["Friend", "darcy"], ["", "jane"], ["Sister", "missBingley"]] },
    missBingley: { name: "Miss Bingley", about: "His sister, with her eye on Mr. Darcy", seen: 8,
      links: [["Brother", "bingley"], ["", "darcy"], ["", "elizabeth"]] },
    collins: { name: "Mr. Collins", about: "Mr. Bennet’s cousin, and heir to Longbourn", seen: 5,
      links: [["Cousin", "mrBennet"], ["Patron", "catherine"], ["", "elizabeth"]] },
    wickham: { name: "Mr. Wickham", about: "A charming new officer in the militia", seen: 3,
      links: [["", "darcy"], ["", "elizabeth"], ["Friend", "denny"]] },
    charlotte: { name: "Charlotte Lucas", about: "Elizabeth’s closest friend", seen: 5, links: [["Friend", "elizabeth"], ["Father", "sirWilliam"]] },
    sirWilliam: { name: "Sir William Lucas", about: "Their genial neighbour", seen: 4, links: [["Daughter", "charlotte"], ["", "darcy"]] },
    hurst: { name: "Mr. Hurst", about: "Bingley’s brother-in-law, fond of cards", seen: 4, links: [["Wife", "mrsHurst"]] },
    mrsHurst: { name: "Mrs. Hurst", about: "Bingley’s married sister", seen: 5, links: [["Husband", "hurst"], ["Sister", "missBingley"]] },
    catherine: { name: "Lady Catherine de Bourgh", about: "Mr. Collins’s patron, and Darcy’s aunt", seen: 3, links: [["Nephew", "darcy"], ["", "collins"]] },
    mrsPhilips: { name: "Mrs. Philips", about: "Mrs. Bennet’s sister in Meryton", seen: 3, links: [["Sister", "mrsBennet"], ["", "wickham"]] },
    denny: { name: "Mr. Denny", about: "An officer, and Wickham’s friend", seen: 2, links: [["Friend", "wickham"]] },
    jones: { name: "Mr. Jones", about: "The apothecary who sees to Jane", seen: 2, links: [["", "jane"]] },
  };
  const PL = {
    netherfield: { name: "Netherfield", about: "The house Mr. Bingley has taken", seen: 11, who: ["bingley", "jane", "elizabeth", "darcy", "missBingley"] },
    longbourn: { name: "Longbourn", about: "The Bennets’ home", seen: 12, who: ["mrsBennet", "mrBennet", "elizabeth", "collins"] },
    meryton: { name: "Meryton", about: "The market town a mile from Longbourn", seen: 7, who: ["wickham", "lydia", "denny", "mrsPhilips"] },
    pemberley: { name: "Pemberley", about: "Mr. Darcy’s estate in Derbyshire", seen: 3, who: ["darcy", "wickham"] },
    rosings: { name: "Rosings Park", about: "Lady Catherine’s house in Kent", seen: 3, who: ["catherine", "collins"] },
    hunsford: { name: "Hunsford", about: "Mr. Collins’s parish", seen: 2, who: ["collins"] },
  };
  // Each chapter's recap, a sentence a line, and whose story it is (the tagged ones in it).
  const CH = [
    ["I", "Mrs. Bennet hears that a rich young man, Mr. Bingley, has taken Netherfield Park. She urges her husband to call on him, for their daughters’ sake.", ["bingley"]],
    ["II", "Mr. Bennet teases his family, then lets slip that he has called on Mr. Bingley already. Mrs. Bennet is overjoyed.", ["liz"]],
    ["III", "At the Meryton assembly, Bingley dances twice with Jane. Darcy calls Elizabeth only “tolerable”, and is thought the proudest man in the world.", ["liz", "darcy", "jane", "bingley"]],
    ["IV", "Jane admits to Elizabeth how much she likes Bingley. Elizabeth finds his sisters proud.", ["liz", "jane", "bingley"]],
    ["V", "The Lucases call, and the ball and Darcy’s pride are talked over. Charlotte forgives him: he has a right to be proud.", ["liz", "darcy"]],
    ["VI", "Bingley’s attentions to Jane grow. Darcy begins to admire Elizabeth’s fine eyes, and Miss Bingley is jealous.", ["liz", "darcy", "jane", "bingley"]],
    ["VII", "Jane rides to Netherfield in the rain and falls ill. Elizabeth walks three miles through the mud to nurse her.", ["liz", "jane"]],
    ["VIII", "Elizabeth stays to look after Jane. Bingley’s sisters mock her muddy petticoat behind her back.", ["liz", "darcy", "jane", "bingley"]],
    ["IX", "Mrs. Bennet visits Netherfield and embarrasses Elizabeth. Lydia holds Bingley to his promise of a ball.", ["liz", "jane", "bingley"]],
    ["X", "Darcy writes a letter while Miss Bingley flatters him. He and Elizabeth spar, and he admits to himself he is in some danger.", ["liz", "darcy", "bingley"]],
    ["XI", "Elizabeth teases Darcy about pride and vanity. Miss Bingley tries in vain to catch his eye.", ["liz", "darcy"]],
    ["XII", "Jane and Elizabeth go home to Longbourn. Darcy is relieved to see Elizabeth go.", ["liz", "darcy", "jane"]],
    ["XIII", "Mr. Collins, Mr. Bennet’s cousin and heir to Longbourn, arrives full of praise for his patron, Lady Catherine de Bourgh.", ["liz"]],
    ["XIV", "Collins reads Fordyce’s Sermons to the sisters, until Lydia interrupts him.", ["liz"]],
    ["XV", "Mr. Collins settles on marrying Elizabeth. In Meryton the sisters meet the charming Mr. Wickham, and he and Mr. Darcy change colour at the sight of each other.", ["liz", "darcy", "bingley"]],
    ["XVI", "At Mrs. Philips’s, Wickham tells Elizabeth that Darcy refused him the living Darcy’s father had left him. She believes every word.", ["liz", "darcy"]],
    ["XVII", "Jane can’t believe ill of either man. Mr. Bingley invites the family to a ball at Netherfield, and Mr. Collins claims Elizabeth for the first two dances.", ["liz", "jane", "bingley"]],
  ];
  const READING = { n: "XVIII", fraction: 0.4 };
  // Who did what, for the three chapters with their own maps.
  const CAST = {
    XV: { people: [["collins", "Settles on marrying Elizabeth instead of Jane"], ["elizabeth", "Meets Mr. Wickham in Meryton"], ["wickham", "Newly in the militia, and charming everyone"],
                   ["darcy", "Changes colour at the sight of Wickham"], ["denny", "Introduces his friend Wickham"], ["mrsPhilips", "Asks the sisters to supper"]],
          places: [["meryton", "Where the sisters meet Wickham"], ["longbourn", "Where Mr. Collins is staying"]] },
    XVI: { people: [["wickham", "Tells Elizabeth that Darcy cheated him of a living"], ["elizabeth", "Believes him, and thinks worse of Darcy"], ["darcy", "Talked about, though he isn’t there"],
                    ["catherine", "Darcy’s aunt, Wickham says"], ["collins", "Praises Lady Catherine all evening"], ["mrsPhilips", "Has the officers to supper"]],
           places: [["meryton", "Mrs. Philips’s house, where they talk"], ["pemberley", "Where Wickham grew up"]] },
    XVII: { people: [["elizabeth", "Tells Jane what Wickham said"], ["jane", "Can’t believe ill of either man"], ["bingley", "Comes with his sisters to invite them to a ball"],
                     ["collins", "Asks Elizabeth for the first two dances"], ["lydia", "Wild to dance with the officers"]],
            places: [["netherfield", "Where the ball will be"], ["longbourn", "Where it rains for days before it"]] },
  };

  // A recap's sentences, not broken after a title ("Mrs. Philips").
  const sentences = (text) => {
    const out = [];
    let current = "";
    for (const part of text.split(/(?<=[.!?][”’]?)\s+/)) {
      current = current ? `${current} ${part}` : part;
      if (/\b(Mr|Mrs|Ms|Dr|St)\.$/.test(current)) continue;
      out.push(current);
      current = "";
    }
    if (current) out.push(current);
    return out;
  };
  const tagOf = (id) => (P[id] && P[id].tag ? [P[id].tag] : []);
  const unique = (list) => [...new Set(list)].sort((a, b) => Object.keys(TAG).indexOf(a) - Object.keys(TAG).indexOf(b));

  // The trees -------------------------------------------------------------

  function linkNode(parent, label, other, branch = "people") {
    const who = P[other];
    return { id: `${parent}>${other}`, key: other, title: label ? `${label}: ${who.name}` : who.name, kind: "link", branch,
             tags: tagOf(other), about: who.about, children: [] };
  }
  function personNode(id, prefix = "") {
    const who = P[id];
    return { id: `${prefix}p:${id}`, key: id, title: who.name, kind: "person", branch: "people", ring: who.seen / READ,
             tags: tagOf(id), about: who.about, seen: who.seen, folded: true,
             children: who.links.map(([label, other]) => linkNode(`${prefix}p:${id}`, label, other)) };
  }
  function familyNode(id, name, members) {
    return { id: `f:${id}`, title: name, kind: "family", branch: "people", folded: true,
             tags: unique(members.flatMap(tagOf)), about: members.map((m) => P[m].name).join(", "),
             children: members.map((m) => personNode(m, `f:${id}/`)) };
  }
  function placeNode(id) {
    const place = PL[id];
    return { id: `pl:${id}`, key: id, title: place.name, kind: "place", branch: "places", ring: place.seen / READ,
             tags: unique(place.who.flatMap(tagOf)), about: place.about, seen: place.seen, folded: true,
             children: place.who.map((w) => linkNode(`pl:${id}`, "", w)) };
  }
  function chapterNode([n, recap, tags]) {
    return { id: `ch:${n}`, key: n, title: `Chapter ${n}`, kind: "chapter", branch: "chapters", ring: 1, tags, about: recap, folded: true,
             children: sentences(recap).map((line, i) => ({ id: `ch:${n}#${i}`, title: line, kind: "fact", branch: "chapters", children: [] })) };
  }

  function storyTree() {
    const people = {
      id: "people", title: "People", kind: "branch", branch: "people", icon: "people", about: `${Object.keys(P).length} people`, limit: 7,
      children: [
        familyNode("bennets", "The Bennets", ["elizabeth", "jane", "mrsBennet", "mrBennet", "lydia", "kitty", "mary"]),
        personNode("darcy"),
        familyNode("bingleys", "The Bingleys", ["bingley", "missBingley"]),
        personNode("collins"),
        personNode("wickham"),
        familyNode("lucases", "The Lucases", ["charlotte", "sirWilliam"]),
        familyNode("hursts", "The Hursts", ["mrsHurst", "hurst"]),
        personNode("catherine"),
        personNode("mrsPhilips"),
        personNode("denny"),
        personNode("jones"),
      ],
    };
    const places = { id: "places", title: "Places", kind: "branch", branch: "places", icon: "map", about: `${Object.keys(PL).length} places`,
                     children: Object.keys(PL).map(placeNode) };
    const chapters = { id: "chapters", title: "Chapters", kind: "branch", branch: "chapters", icon: "book", about: `${READ} read`, limit: 7, latest: true,
                       children: [...CH.map(chapterNode),
                         { id: `ch:${READING.n}`, key: READING.n, title: `Chapter ${READING.n}`, kind: "chapter", branch: "chapters", ring: READING.fraction,
                           reading: true, tags: [], about: "", children: [] }] };
    return { id: "root", title: "Pride and Prejudice", kind: "root", branch: "people", ring: READ / TOTAL,
             about: `${READ} of ${TOTAL} chapters read`, children: [people, places, chapters] };
  }

  function chapterTree(n) {
    const [, recap] = CH.find(([c]) => c === n);
    const cast = CAST[n];
    const happens = { id: "events", title: "What Happens", kind: "branch", branch: "chapters", icon: "book",
                      children: sentences(recap).map((line, i) => ({ id: `ev#${i}`, title: line, kind: "fact", branch: "chapters", children: [] })) };
    const people = { id: "people", title: "People", kind: "branch", branch: "people", icon: "people",
                     children: cast.people.map(([id, did]) => ({ ...personNode(id), folded: false,
                       children: [{ id: `p:${id}#did`, title: did, kind: "fact", branch: "people", children: [] }] })) };
    const places = { id: "places", title: "Places", kind: "branch", branch: "places", icon: "map",
                     children: cast.places.map(([id, what]) => ({ ...placeNode(id), folded: false,
                       children: [{ id: `pl:${id}#what`, title: what, kind: "fact", branch: "places", children: [] }] })) };
    return { id: `root:${n}`, title: `Chapter ${n}`, kind: "root", branch: "chapters", ring: 1, about: recap, chapter: n,
             children: [happens, people, places] };
  }

  function walk(node, visit, parent = null) {
    visit(node, parent);
    node.children.forEach((child) => walk(child, visit, node));
  }
  function find(root, id) {
    let found = null;
    walk(root, (node) => { if (node.id === id) found = node; });
    return found;
  }
  function pathTo(root, id) {
    const path = [];
    const go = (node) => {
      path.push(node.id);
      if (node.id === id) return true;
      for (const child of node.children) if (go(child)) return true;
      path.pop();
      return false;
    };
    return go(root) ? path : [];
  }

  // State -------------------------------------------------------------------

  let tree = storyTree();
  let scope = null;
  let folded = new Set();
  let opened = new Set();
  let selected = null;
  let focused = null;
  let view = "map";
  let touched = false;
  const resetFolds = () => {
    folded = new Set();
    opened = new Set();
    walk(tree, (node) => { if (node.folded && node.children.length) folded.add(node.id); });
  };
  resetFolds();

  // The tree as shown: folded nodes without their children, long lists cut to their limit.
  function visible() {
    const hidden = new Map();
    const prune = (node) => {
      const copy = { ...node };
      if (folded.has(node.id) && node.children.length) {
        hidden.set(node.id, node.children.length);
        copy.children = [];
        return copy;
      }
      let children = node.children;
      if (node.limit && children.length > node.limit + 1 && !opened.has(node.id)) {
        const rest = children.length - node.limit;
        const more = { id: `${node.id}#more`, title: node.latest ? `${rest} earlier` : `${rest} more`, kind: "more", branch: node.branch, parent: node.id, children: [] };
        children = node.latest ? [more, ...children.slice(-node.limit)] : [...children.slice(0, node.limit), more];
      }
      copy.children = children.map(prune);
      return copy;
    };
    return { root: prune(tree), hidden };
  }

  // Measuring and laying out --------------------------------------------------

  const ctx = document.createElement("canvas").getContext("2d");
  const FAMILY = getComputedStyle(document.documentElement).getPropertyValue("--sans").trim() || "system-ui, sans-serif";
  function fontOf(node, depth) {
    switch (node.kind) {
      case "root": return { weight: 700, size: 21, italic: true, max: 240 };
      case "branch": return { weight: 600, size: 18, max: 170 };
      case "more": return { weight: 600, size: 14, max: 170 };
      case "fact": return { weight: 400, size: 15, max: 250 };
      case "link": return { weight: 400, size: 15, max: 230 };
      default: return { weight: depth <= 2 ? 500 : 400, size: 16, max: 210 };
    }
  }
  const fontString = (f) => `${f.italic ? "italic " : ""}${f.weight} ${f.size}px ${FAMILY}`;
  function wrap(text, f) {
    ctx.font = fontString(f);
    const words = text.split(" ");
    const lines = [];
    let line = "";
    for (const word of words) {
      const next = line ? `${line} ${word}` : word;
      if (line && ctx.measureText(next).width > f.max) { lines.push(line); line = word; } else line = next;
    }
    if (line) lines.push(line);
    const width = Math.max(...lines.map((l) => ctx.measureText(l).width));
    return { lines, width: Math.ceil(width) + 2 };
  }
  const lineWidth = (depth) => (depth <= 1 ? 4.5 : depth === 2 ? 3.5 : 2.6);
  const RING = 13, ICON = 24, TAGW = 11;
  function measure(node, depth) {
    const f = fontOf(node, depth);
    const text = wrap(node.title, f);
    const lineH = Math.round(f.size * 1.32);
    const textH = text.lines.length * lineH;
    if (node.kind === "root") {
      return { f, text, lineH, textH, w: text.width + RING + 10 + 36, h: textH + 28 };
    }
    let w = text.width + 6;
    if (node.ring !== undefined) w += RING + 7;
    if (node.icon) w += ICON + 8;
    if (node.tags && node.tags.length) w += 6 + TAGW + (node.tags.length - 1) * (TAGW - 3);
    const h = Math.max(textH, node.icon ? ICON : RING) + 6 + lineWidth(depth);
    return { f, text, lineH, textH, w, h };
  }

  const GAP = 44, SPACING = 11;
  function layout(root, hidden) {
    const sizes = new Map(), heights = new Map();
    const height = (node, depth) => {
      const m = measure(node, depth);
      sizes.set(node.id, m);
      if (!node.children.length) { heights.set(node.id, m.h); return m.h; }
      const kids = node.children.reduce((sum, c) => sum + height(c, depth + 1), 0) + SPACING * (node.children.length - 1);
      const total = Math.max(m.h, kids);
      heights.set(node.id, total);
      return total;
    };
    height(root, 0);
    const placed = [];
    const place = (node, depth, x, top, parent) => {
      const m = sizes.get(node.id), total = heights.get(node.id);
      let lineY;
      if (!node.children.length) {
        lineY = node.kind === "root" ? top + m.h / 2 : top + m.h;
      } else {
        const kids = node.children.reduce((sum, c) => sum + heights.get(c.id), 0) + SPACING * (node.children.length - 1);
        let y = top + (total - kids) / 2;
        const lines = node.children.map((child) => {
          const l = place(child, depth + 1, x + m.w + GAP, y, node.id);
          y += heights.get(child.id) + SPACING;
          return l;
        });
        const middle = (lines[0] + lines[lines.length - 1]) / 2;
        lineY = node.kind === "root" ? Math.max(middle, top + m.h / 2) : Math.max(middle, top + m.h);
      }
      const y = node.kind === "root" ? lineY - m.h / 2 : lineY - m.h;
      placed.push({ id: node.id, node, depth, x, y, m, parent, hidden: hidden.get(node.id) || 0,
                    lineOff: node.kind === "root" ? m.h / 2 : m.h });
      return lineY;
    };
    place(root, 0, 0, 0, null);
    return placed;
  }

  // Drawing -----------------------------------------------------------------

  const el = (name, attrs = {}, parent) => {
    const e = document.createElementNS(NS, name);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.append(e);
    return e;
  };
  const world = el("g", {}, svg);
  const curvesLayer = el("g", {}, world);
  const nodesLayer = el("g", {}, world);
  const ICONS = {
    people: '<circle cx="8.5" cy="8" r="3.2"/><circle cx="16.2" cy="8.8" r="2.6"/><path d="M2.6 19.2c.6-3.6 3-5.7 5.9-5.7s5.3 2.1 5.9 5.7M14.6 13.7c3-.5 6.2 1.3 6.9 5.3"/>',
    map: '<path d="M3 6.6 8.6 4.2l6.8 2.4L21 4.2v13.2l-5.6 2.4-6.8-2.4L3 19.8zM8.6 4.2v13.2M15.4 6.6v13.2"/>',
    book: '<path d="M6.8 3.6h11.4v14.8H6.9a1.9 1.9 0 0 0-1.9 1.9V5.5a1.9 1.9 0 0 1 1.8-1.9zM5 20.3c0 1 .8 1.6 1.9 1.6h11.3v-3.5"/>',
  };
  const ringColor = (branch) => (branch === "chapters" ? COLOR.chapters : branch === "places" ? COLOR.places : COLOR.people);

  function drawRing(g, ring, cx, cy, color) {
    if (ring === undefined) return;
    if (ring >= 1) {
      el("circle", { cx, cy, r: 6.4, fill: color }, g);
      el("path", { d: `M${cx - 2.9} ${cy + .2}l2 2 3.9-4.2`, fill: "none", stroke: "#fff", "stroke-width": 1.7, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
      return;
    }
    const r = 5.6, c = 2 * Math.PI * r;
    el("circle", { cx, cy, r, fill: "none", stroke: color, "stroke-opacity": .32, "stroke-width": 1.8 }, g);
    el("circle", { cx, cy, r, fill: "none", stroke: color, "stroke-width": 2.2, "stroke-linecap": "round",
                   "stroke-dasharray": `${Math.max(.01, ring) * c} ${c}`, transform: `rotate(-90 ${cx} ${cy})` }, g);
  }

  function drawNode(item) {
    const { node, m, depth } = item;
    const color = COLOR[node.branch];
    const g = el("g", { class: "mm-n mm-fade", tabindex: node.kind === "fact" ? -1 : 0, role: node.kind === "fact" ? "listitem" : "button" });
    g.dataset.id = node.id;
    const label = [node.title];
    if (item.hidden) label.push(`${item.hidden} folded away`);
    if (node.kind === "chapter") label.push(node.reading ? "reading now" : "recapped");
    g.setAttribute("aria-label", label.join(", "));
    if (node.kind === "root") {
      el("rect", { class: "mm-sel", x: -3, y: -3, width: m.w + 6, height: m.h + 6, rx: 14, fill: "none", stroke: "#7DB4FF", "stroke-width": 1.5 }, g);
      el("rect", { x: 0, y: 0, width: m.w, height: m.h, rx: 12, fill: "#2A2A2D", stroke: "rgba(255,255,255,.12)" }, g);
      drawRing(g, node.ring, 20 + RING / 2 - 6, m.h / 2, "#8E8E93");
      const text = el("text", { x: 20 + RING + 4, "font-size": m.f.size, "font-weight": m.f.weight, "font-style": "italic" }, g);
      m.text.lines.forEach((line, i) => {
        el("tspan", { x: 20 + RING + 4, y: (m.h - m.textH) / 2 + m.f.size * .98 + i * m.lineH }, text).textContent = line;
      });
      return g;
    }
    const contentH = m.h - 6 - lineWidth(depth);
    el("rect", { class: "mm-sel", x: -5, y: -4, width: m.w + 8, height: contentH + 8, rx: 7, fill: color, "fill-opacity": .2 }, g);
    let x = 0;
    if (node.ring !== undefined) {
      drawRing(g, node.ring, x + RING / 2, contentH / 2, ringColor(node.branch));
      x += RING + 7;
    }
    if (node.icon) {
      const icon = el("g", { transform: `translate(${x} ${(contentH - ICON) / 2})`, fill: "none", stroke: color, "stroke-width": 1.6, "stroke-linejoin": "round", "stroke-linecap": "round" }, g);
      icon.innerHTML = ICONS[node.icon];
      x += ICON + 8;
    }
    const text = el("text", { x, "font-size": m.f.size, "font-weight": m.f.weight }, g);
    if (node.kind === "more") text.setAttribute("style", `fill:${color}`);
    if (node.kind === "fact") text.setAttribute("style", "fill:#D2D2D7");
    m.text.lines.forEach((line, i) => {
      el("tspan", { x, y: (contentH - m.textH) / 2 + m.f.size * .98 + i * m.lineH }, text).textContent = line;
    });
    x += m.text.width + 6;
    (node.tags || []).forEach((tag, i) => {
      const tx = x + i * (TAGW - 3), ty = contentH / 2 - 5.5;
      el("path", { d: `M${tx} ${ty + 1.8}a1.8 1.8 0 0 1 1.8-1.8h4.6l4.2 5.5-4.2 5.5H${tx + 1.8}a1.8 1.8 0 0 1-1.8-1.8z`, fill: TAG[tag], stroke: BG, "stroke-width": 1.2 }, g);
      el("circle", { cx: tx + 2.8, cy: ty + 5.5, r: 1, fill: BG }, g);
    });
    el("rect", { x: 0, y: m.h - lineWidth(depth), width: m.w, height: lineWidth(depth), rx: lineWidth(depth) / 2, fill: color,
                 "fill-opacity": node.kind === "more" ? .5 : 1 }, g);
    return g;
  }

  function drawBadge(color) {
    const g = el("g", { class: "mm-fade", "aria-hidden": "true" });
    el("circle", { r: 6.5, fill: BG, stroke: color, "stroke-width": 1.5 }, g);
    el("path", { d: "M-1.2 -2.6 1.4 0-1.2 2.6", fill: "none", stroke: color, "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, g);
    return g;
  }

  // Where things are now, and where they're going.
  const shown = new Map();
  let camera = { s: 1, x: 0, y: 0 };
  let animation = 0;

  function curvePath(p, c) {
    const end = [c.x, c.y + c.lineOff];
    let start, c1, c2;
    if (p.node.kind === "root") {
      const mid = p.y + p.m.h / 2, rise = end[1] - mid;
      if (Math.abs(rise) > p.m.h) {
        start = [p.x + p.m.w - Math.min(p.m.w * .3, 60), rise < 0 ? p.y : p.y + p.m.h];
        c1 = [start[0], start[1] + (end[1] - start[1]) * .55];
        c2 = [start[0] + (end[0] - start[0]) * .35, end[1]];
      } else {
        start = [p.x + p.m.w, mid];
        const along = (end[0] - start[0]) * .5;
        c1 = [start[0] + along, start[1]];
        c2 = [end[0] - along, end[1]];
      }
    } else {
      start = [p.x + p.m.w, p.y + p.lineOff];
      const along = (end[0] - start[0]) * .55;
      c1 = [start[0] + along, start[1]];
      c2 = [end[0] - along, end[1]];
    }
    const f = (pt) => `${pt[0].toFixed(1)} ${pt[1].toFixed(1)}`;
    return `M${f(start)}C${f(c1)} ${f(c2)} ${f(end)}`;
  }

  function lit(id) {
    if (!focused) return true;
    const path = pathTo(tree, id);
    return path.includes(focused) || pathTo(tree, focused).includes(id) || id.startsWith(`${focused}#`);
  }

  function paint() {
    world.setAttribute("transform", `translate(${camera.x.toFixed(1)} ${camera.y.toFixed(1)}) scale(${camera.s.toFixed(4)})`);
    for (const s of shown.values()) {
      s.g.setAttribute("transform", `translate(${s.cur.x.toFixed(1)} ${s.cur.y.toFixed(1)})`);
      if (s.curve) {
        const parent = shown.get(s.parentId);
        if (parent) s.curve.setAttribute("d", curvePath({ ...parent.item, x: parent.cur.x, y: parent.cur.y }, { ...s.item, x: s.cur.x, y: s.cur.y }));
      }
      if (s.badge) s.badge.setAttribute("transform", `translate(${(s.cur.x + s.item.m.w + 9).toFixed(1)} ${(s.cur.y + s.item.lineOff).toFixed(1)})`);
    }
  }

  // The camera: everything fitted (no smaller than can be read), else at its smallest, showing `around`.
  function frame(placed, around) {
    const W = pane.clientWidth, H = pane.clientHeight;
    const top = Math.max(56, H * .085) + (scope || focused ? 34 : 0), bottom = selected && !card.hidden ? card.offsetHeight + 28 : 24, side = 22;
    const box = (items) => items.reduce((b, it) => ({
      x0: Math.min(b.x0, it.x), y0: Math.min(b.y0, it.y),
      x1: Math.max(b.x1, it.x + it.m.w + (it.hidden ? 18 : 0)), y1: Math.max(b.y1, it.y + it.m.h),
    }), { x0: Infinity, y0: Infinity, x1: -Infinity, y1: -Infinity });
    const all = box(placed);
    const availW = W - side * 2, availH = Math.max(80, H - top - bottom);
    // No smaller than can be read: past that, it pans to what was opened instead.
    const smallest = W < 520 ? .55 : .72;
    // Focused: its branch fills the map.
    const branch = focused ? placed.filter((it) => it.id === focused || pathTo(tree, it.id).includes(focused)) : [];
    const fitted = branch.length ? box(branch) : all;
    let s = Math.min(1.15, availW / (fitted.x1 - fitted.x0), availH / (fitted.y1 - fitted.y0));
    const fits = s >= smallest;
    s = Math.max(s, smallest);
    let x = side + (availW - (fitted.x1 - fitted.x0) * s) / 2 - fitted.x0 * s;
    let y = top + (availH - (fitted.y1 - fitted.y0) * s) / 2 - fitted.y0 * s;
    if (!fits) {
      const sub = around ? box(placed.filter((it) => it.id === around || pathTo(tree, it.id).includes(around))) : all;
      const midY = (sub.y0 + sub.y1) / 2;
      y = top + availH / 2 - midY * s;
      y = Math.min(top - all.y0 * s, Math.max(top + availH - all.y1 * s, y));
      if ((all.x1 - all.x0) * s > availW) {
        // From the root; past what was opened, if it's further out.
        x = side - all.x0 * s;
        if (around && sub.x1 * s + x > W - side) x = W - side - sub.x1 * s;
      }
    }
    return { s, x, y };
  }

  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function render(around = null, animate = true) {
    if (view !== "map") return;
    const { root, hidden } = visible();
    const placed = layout(root, hidden);
    const byId = new Map(placed.map((p) => [p.id, p]));
    const target = frame(placed, around);
    const startCam = { ...camera };

    for (const item of placed) {
      let s = shown.get(item.id);
      const sameShape = s && s.item.m.w === item.m.w && s.item.hidden === item.hidden && (s.item.hidden > 0) === (item.hidden > 0);
      if (s && !sameShape) {
        // Folded or opened: drawn again, for what it says it holds.
        const fresh = drawNode(item);
        s.g.replaceWith(fresh);
        s.g = fresh;
      }
      if (!s) {
        const parent = item.parent ? (shown.get(item.parent) || null) : null;
        const from = parent ? { x: parent.cur.x + parent.item.m.w * .6, y: parent.cur.y + parent.item.lineOff - item.lineOff } : { x: item.x, y: item.y };
        s = { cur: from, from, item, g: null, curve: null, badge: null, parentId: item.parent, fresh: true };
        shown.set(item.id, s);
      }
      if (!s.g || !s.g.isConnected) {
        s.g = drawNode(item);
        nodesLayer.append(s.g);
      }
      if (item.parent && !s.curve) {
        s.curve = el("path", { class: "mm-curve mm-fade", stroke: COLOR[item.node.branch], "stroke-width": lineWidth(item.depth) }, curvesLayer);
      }
      if (item.hidden && !s.badge) { s.badge = drawBadge(COLOR[item.node.branch]); nodesLayer.append(s.badge); }
      if (!item.hidden && s.badge) { s.badge.remove(); s.badge = null; }
      if (item.node.kind === "more") s.curve && s.curve.setAttribute("stroke-opacity", .5);
      s.item = item;
      s.parentId = item.parent;
      s.from = { ...s.cur };
      s.to = { x: item.x, y: item.y };
      s.leaving = false;
      const on = lit(item.id);
      s.g.style.opacity = on ? 1 : .22;
      if (s.curve) s.curve.style.opacity = on ? 1 : .22;
      if (s.badge) s.badge.style.opacity = on ? 1 : .22;
      s.g.classList.toggle("is-selected", selected === item.id);
      if (s.g.getAttribute("role") === "button") {
        const node = find(tree, item.id);
        if (node && node.children.length && node.kind !== "root") s.g.setAttribute("aria-expanded", String(!item.hidden));
      }
    }
    for (const [id, s] of shown) {
      if (byId.has(id)) continue;
      // Gone: back into the nearest one still shown, fading.
      let up = s.parentId;
      while (up && !byId.has(up)) up = shown.get(up) ? shown.get(up).parentId : null;
      const into = up ? byId.get(up) : null;
      s.from = { ...s.cur };
      s.to = into ? { x: into.x + into.m.w * .6, y: into.y + into.lineOff - s.item.lineOff } : s.cur;
      s.leaving = true;
      s.g.style.opacity = 0;
      if (s.curve) s.curve.style.opacity = 0;
      if (s.badge) s.badge.style.opacity = 0;
    }

    cancelAnimationFrame(animation);
    const finish = () => {
      for (const [id, s] of shown) {
        if (!s.leaving) continue;
        s.g.remove();
        if (s.curve) s.curve.remove();
        if (s.badge) s.badge.remove();
        shown.delete(id);
      }
    };
    if (!animate || reduceMotion) {
      for (const s of shown.values()) s.cur = { ...s.to };
      camera = target;
      paint();
      finish();
      return;
    }
    for (const s of shown.values()) if (s.fresh) { s.g.style.opacity = 0; if (s.curve) s.curve.style.opacity = 0; }
    requestAnimationFrame(() => {
      for (const s of shown.values()) if (s.fresh) {
        s.fresh = false;
        const on = lit(s.item.id) ? 1 : .22;
        s.g.style.opacity = on;
        if (s.curve) s.curve.style.opacity = on;
      }
    });
    const start = performance.now(), duration = 420;
    const tick = (now) => {
      const t = ease(Math.min(1, (now - start) / duration));
      for (const s of shown.values()) s.cur = { x: s.from.x + (s.to.x - s.from.x) * t, y: s.from.y + (s.to.y - s.from.y) * t };
      camera = { s: startCam.s + (target.s - startCam.s) * t, x: startCam.x + (target.x - startCam.x) * t, y: startCam.y + (target.y - startCam.y) * t };
      paint();
      if (t < 1) animation = requestAnimationFrame(tick); else finish();
    };
    animation = requestAnimationFrame(tick);
  }

  // The card under the map, for what's picked ------------------------------------

  function showCard(node) {
    if (!node || node.kind === "fact" || node.kind === "more") { card.hidden = true; return; }
    const lines = [];
    const buttons = [];
    let title = node.title;
    if (node.kind === "link" && node.key) title = P[node.key].name;
    if (node.kind === "root") {
      lines.push(node.chapter ? sentences(node.about).slice(0, 2).join(" ") : node.about);
    } else if (node.kind === "branch") {
      if (node.about) lines.push(node.about);
    } else if (node.kind === "family") {
      lines.push(node.about);
    } else if (node.kind === "chapter") {
      if (node.reading) lines.push(`Reading now: ${Math.round(READING.fraction * 100)}% read. It’s recapped once you finish it.`);
      else lines.push(node.about);
      if (CAST[node.key] && !scope) buttons.push(["Map This Chapter", () => setScope(node.key)]);
    } else {
      const about = node.kind === "link" ? P[node.key].about : node.about;
      const seen = node.kind === "link" ? P[node.key].seen : node.seen;
      lines.push(`${about} · In ${seen} of ${READ} chapters`);
    }
    if (["person", "place", "family", "branch"].includes(node.kind) && node.children.length) {
      buttons.push([focused === node.id ? "Unfocus" : "Focus", () => toggleFocus(node.id)]);
    }
    if (node.kind === "link" && node.key) buttons.push([`Open ${P[node.key].name}`, () => show(node.key)]);
    card.innerHTML = "";
    const h = document.createElement("h6");
    h.textContent = title;
    card.append(h);
    lines.forEach((text) => { const p = document.createElement("p"); p.textContent = text; card.append(p); });
    if (buttons.length) {
      const row = document.createElement("div");
      row.className = "sv-card__btns";
      buttons.forEach(([label, action]) => {
        const b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", () => { touched = true; action(); });
        row.append(b);
      });
      card.append(row);
    }
    card.hidden = false;
  }

  function updatePills() {
    if (scope) {
      scopePill.hidden = false;
      scopePill.innerHTML = `Chapter ${scope} · <b>The Whole Story</b>`;
    } else scopePill.hidden = true;
    const node = focused && find(tree, focused);
    if (node) {
      focusPill.hidden = false;
      focusPill.innerHTML = `Focus: ${node.title} · <b>Show All</b>`;
    } else focusPill.hidden = true;
    demo.querySelectorAll(".sv-ch").forEach((c) => c.classList.toggle("is-mapped", c.dataset.chapter === scope));
  }

  // What a tap does --------------------------------------------------------------

  function tap(id) {
    const node = find(tree, id);
    if (id.endsWith("#more")) {
      opened.add(id.slice(0, -5));
      render(id.slice(0, -5));
      return;
    }
    if (!node) return;
    if (node.children.length && node.kind !== "root" && (folded.has(id) || selected === id)) {
      if (folded.has(id)) folded.delete(id); else folded.add(id);
    }
    selected = id;
    showCard(node);
    if (view === "map") render(id);
    if (view === "outline") renderOutline();
    if (view === "web") paintWeb();
  }

  function toggleFocus(id) {
    focused = focused === id ? null : id;
    if (focused) folded.delete(id);
    updatePills();
    showCard(find(tree, selected));
    render(focused || selected);
  }

  // Shows someone or somewhere from the Recaps page: their branch opened down to them.
  function show(key) {
    if (scope) setScope(null, false);
    const target = [];
    walk(tree, (node) => { if (node.key === key && (node.kind === "person" || node.kind === "place")) target.push(node); });
    const node = target[0];
    if (!node) return;
    const path = pathTo(tree, node.id);
    path.forEach((id, i) => {
      folded.delete(id);
      const parent = find(tree, id);
      const next = path[i + 1];
      if (parent && parent.limit && next) {
        const at = parent.children.findIndex((c) => c.id === next);
        const keep = parent.latest ? parent.children.length - parent.limit : parent.limit;
        if (parent.latest ? at < keep : at >= keep) opened.add(parent.id);
      }
    });
    selected = node.id;
    if (view !== "map") setView("map", false);
    showCard(node);
    render(node.id);
  }

  function setScope(n, draw = true) {
    scope = n;
    tree = n ? chapterTree(n) : storyTree();
    focused = null;
    selected = null;
    card.hidden = true;
    resetFolds();
    updatePills();
    if (!draw) return;
    if (view === "map") {
      // A new map: drawn afresh, growing out of the root.
      for (const s of shown.values()) { s.g.remove(); if (s.curve) s.curve.remove(); if (s.badge) s.badge.remove(); }
      shown.clear();
      render(null);
    } else if (view === "outline") renderOutline(); else drawWeb();
  }

  svg.addEventListener("click", (e) => {
    const g = e.target.closest(".mm-n");
    touched = true;
    if (g && g.dataset.id) { tap(g.dataset.id); return; }
    if (g || moved) return;
    // The background: nothing picked.
    selected = null;
    card.hidden = true;
    if (view === "map") render(null); else paintWeb();
  });
  svg.addEventListener("keydown", (e) => {
    const g = e.target.closest && e.target.closest(".mm-n");
    if (!g || (e.key !== "Enter" && e.key !== " ")) return;
    e.preventDefault();
    g.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });

  // Dragging the map about (with a finger, sideways: up and down scrolls the page).
  let drag = null, moved = false;
  svg.addEventListener("pointerdown", (e) => {
    if (view === "outline") return;
    drag = { x: e.clientX, y: e.clientY, cam: { ...camera }, touch: e.pointerType === "touch" };
    moved = false;
  });
  window.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const dx = e.clientX - drag.x, dy = drag.touch ? 0 : e.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 5) return;
    moved = true;
    svg.classList.add("is-panning");
    camera = { ...drag.cam, x: drag.cam.x + dx, y: drag.cam.y + dy };
    if (view === "map") paint(); else paintWeb();
  });
  window.addEventListener("pointerup", () => {
    drag = null;
    svg.classList.remove("is-panning");
    setTimeout(() => { moved = false; }, 0);
  });
  svg.addEventListener("click", (e) => { if (moved) e.stopImmediatePropagation(); }, true);

  // The Recaps page beside: names and chapters on the map.
  demo.querySelectorAll("[data-show]").forEach((b) => b.addEventListener("click", () => { touched = true; show(b.dataset.show); }));
  demo.querySelectorAll("[data-map]").forEach((b) => b.addEventListener("click", () => {
    touched = true;
    setScope(scope === b.dataset.map ? null : b.dataset.map);
  }));
  scopePill.addEventListener("click", () => { touched = true; setScope(null); });
  focusPill.addEventListener("click", () => { touched = true; toggleFocus(focused); });

  // Outline ----------------------------------------------------------------------

  const outlineOpen = new Set(["people", "places", "chapters", "events"]);
  function renderOutline() {
    outline.innerHTML = "";
    const list = (nodes, depth) => {
      const ul = document.createElement("ul");
      if (depth === 0) ul.setAttribute("role", "tree");
      for (const node of nodes) {
        const li = document.createElement("li");
        const row = document.createElement("button");
        row.type = "button";
        row.className = `sv-ol__row${node.kind === "branch" ? " is-branch" : ""}${node.kind === "fact" ? " is-fact" : ""}`;
        const color = COLOR[node.branch];
        const kids = node.children.length > 0;
        if (kids) row.setAttribute("aria-expanded", String(outlineOpen.has(node.id)));
        row.innerHTML = `<svg class="sv-ol__chev" viewBox="0 0 24 24" aria-hidden="true">${kids ? '<path d="m9 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>' : ""}</svg>`
          + `<span class="sv-ol__mark" style="color:${color};${node.ring >= 1 ? `background:${color}` : ""}" aria-hidden="true"></span>`;
        const name = document.createElement("span");
        name.textContent = node.title;
        row.append(name);
        if (node.tags && node.tags.length) {
          const tags = document.createElement("span");
          tags.className = "sv-ol__tags";
          tags.setAttribute("aria-hidden", "true");
          node.tags.forEach((t) => { const i = document.createElement("i"); i.style.background = TAG[t]; tags.append(i); });
          row.append(tags);
        }
        row.addEventListener("click", () => {
          touched = true;
          if (kids) { if (outlineOpen.has(node.id)) outlineOpen.delete(node.id); else outlineOpen.add(node.id); }
          selected = node.id;
          showCard(node);
          renderOutline();
          const again = outline.querySelector(`[data-row="${CSS.escape(node.id)}"]`);
          if (again) again.focus();
        });
        row.dataset.row = node.id;
        li.append(row);
        if (kids && outlineOpen.has(node.id)) li.append(list(node.children, depth + 1));
        ul.append(li);
      }
      return ul;
    };
    outline.append(list(tree.children, 0));
  }

  // Web ----------------------------------------------------------------------------

  const webLayer = el("g", {}, svg);
  let web = null;
  function drawWeb() {
    // Who's in it (in a chapter's map, that chapter's), linked as they are; places by who goes there.
    const people = scope ? CAST[scope].people.map(([id]) => id) : Object.keys(P);
    const places = scope ? CAST[scope].places.map(([id]) => id) : Object.keys(PL);
    const nodes = [
      ...people.map((id, i) => ({ id: `w:${id}`, key: id, kind: "person", name: P[id].name, r: 9 + 15 * Math.sqrt(P[id].seen / READ), i })),
      ...places.map((id, i) => ({ id: `w:${id}`, key: id, kind: "place", name: PL[id].name, r: 8 + 11 * Math.sqrt(PL[id].seen / READ), i: i + people.length })),
    ];
    const index = new Map(nodes.map((n) => [n.key, n]));
    const edges = [];
    const seen = new Set();
    for (const id of people) for (const [label, other] of P[id].links) {
      const k = [id, other].sort().join("|");
      if (!index.has(other) || seen.has(k)) continue;
      seen.add(k);
      edges.push({ a: index.get(id), b: index.get(other), tie: !!label });
    }
    for (const id of places) for (const w of PL[id].who) if (index.has(w)) edges.push({ a: index.get(id), b: index.get(w), place: true });
    // A few hundred steps of springs and pushes, the same each time.
    nodes.forEach((n) => { const a = n.i * 2.399963; const d = 30 * Math.sqrt(n.i + 1); n.x = d * Math.cos(a); n.y = d * Math.sin(a); n.vx = 0; n.vy = 0; });
    for (let step = 0; step < 400; step++) {
      const heat = 1 - step / 400;
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        let dx = a.x - b.x, dy = a.y - b.y;
        const d2 = Math.max(dx * dx + dy * dy, 1), d = Math.sqrt(d2);
        const push = 17000 / d2;
        dx /= d; dy /= d;
        a.vx += dx * push; a.vy += dy * push; b.vx -= dx * push; b.vy -= dy * push;
      }
      for (const e of edges) {
        const dx = e.b.x - e.a.x, dy = e.b.y - e.a.y, d = Math.max(1, Math.hypot(dx, dy));
        const pull = (e.tie ? .045 : .02) * (d - (e.a.r + e.b.r + 80));
        e.a.vx += dx / d * pull; e.a.vy += dy / d * pull; e.b.vx -= dx / d * pull; e.b.vy -= dy / d * pull;
      }
      for (const n of nodes) {
        n.vx = (n.vx - n.x * .009) * .8 * heat; n.vy = (n.vy - n.y * .012) * .8 * heat;
        n.x += Math.max(-40, Math.min(40, n.vx)); n.y += Math.max(-40, Math.min(40, n.vy));
      }
    }
    webLayer.innerHTML = "";
    const lines = el("g", {}, webLayer);
    for (const e of edges) {
      el("line", { x1: e.a.x, y1: e.a.y, x2: e.b.x, y2: e.b.y, stroke: "#EDEDF0", "stroke-opacity": e.tie ? .42 : .2,
                   "stroke-width": e.tie ? 1.6 : 1, "stroke-dasharray": e.place ? "4 4" : "" }, lines);
    }
    for (const n of nodes) {
      const g = el("g", { class: "mm-n", tabindex: 0, role: "button", "aria-label": n.name, transform: `translate(${n.x} ${n.y})` }, webLayer);
      g.dataset.web = n.key;
      const color = n.kind === "person" ? COLOR.people : COLOR.places;
      el("circle", { class: "mm-sel", r: n.r + 5, fill: "none", stroke: color, "stroke-width": 2 }, g);
      el("circle", { r: n.r, fill: color }, g);
      if (n.kind === "person") {
        const initials = n.name.split(" ").filter((w) => !/^(Mr|Mrs|Miss|Sir|Lady)\.?$/.test(w) && /^[A-Z]/.test(w));
        const t = el("text", { "text-anchor": "middle", y: n.r * .36, "font-size": n.r * .8, "font-weight": 700, style: "fill:#fff" }, g);
        t.textContent = (initials.length > 1 ? initials[0][0] + initials[initials.length - 1][0] : (initials[0] || "?")[0]);
      } else {
        // A map pin.
        const r = n.r;
        el("path", { d: `M0 ${r * .52}L${-r * .3} ${-r * .02}A${r * .36} ${r * .36} 0 1 1 ${r * .3} ${-r * .02}Z`, fill: "#fff" }, g);
        el("circle", { cy: -r * .2, r: r * .13, fill: color }, g);
      }
      const label = el("text", { "text-anchor": "middle", y: n.r + 15, "font-size": 12, "font-weight": 500 }, g);
      label.textContent = n.name;
    }
    web = { nodes };
    paintWeb(true);
  }
  function paintWeb(fit = false) {
    if (!web) return;
    if (fit) {
      const W = pane.clientWidth, H = pane.clientHeight, top = Math.max(56, H * .085) + (scope ? 34 : 0);
      const x0 = Math.min(...web.nodes.map((n) => n.x - n.r - 50)), x1 = Math.max(...web.nodes.map((n) => n.x + n.r + 50));
      const y0 = Math.min(...web.nodes.map((n) => n.y - n.r)), y1 = Math.max(...web.nodes.map((n) => n.y + n.r + 20));
      const s = Math.min(1.3, (W - 30) / (x1 - x0), (H - top - 20) / (y1 - y0));
      camera = { s, x: (W - (x1 - x0) * s) / 2 - x0 * s, y: top + (H - top - 20 - (y1 - y0) * s) / 2 - y0 * s };
    }
    webLayer.setAttribute("transform", `translate(${camera.x.toFixed(1)} ${camera.y.toFixed(1)}) scale(${camera.s.toFixed(4)})`);
    webLayer.querySelectorAll(".mm-n").forEach((g) => g.classList.toggle("is-selected", selected === `w:${g.dataset.web}`));
  }
  webLayer.addEventListener("click", (e) => {
    const g = e.target.closest(".mm-n");
    if (!g) return;
    e.stopPropagation();
    touched = true;
    const key = g.dataset.web;
    selected = `w:${key}`;
    const node = P[key] ? personNode(key) : placeNode(key);
    showCard({ ...node, children: [] });
    paintWeb();
  });

  // Map, Outline, Web ---------------------------------------------------------------

  const seg = demo.querySelector(".sv-seg");
  function setView(next, draw = true) {
    view = next;
    seg.querySelectorAll('[role="radio"]').forEach((r) => {
      const on = r.dataset.view === next;
      r.setAttribute("aria-checked", String(on));
      r.tabIndex = on ? 0 : -1;
    });
    outline.hidden = next !== "outline";
    world.style.display = next === "map" ? "" : "none";
    webLayer.style.display = next === "web" ? "" : "none";
    svg.style.visibility = next === "outline" ? "hidden" : "";
    selected = null;
    card.hidden = true;
    if (!draw) return;
    if (next === "map") render(null, false);
    if (next === "outline") renderOutline();
    if (next === "web") drawWeb();
  }
  radioGroup(seg, (radio) => { touched = true; setView(radio.dataset.view); });

  // Start: once the fonts are in (the layout measures text), and refitted as the window changes.
  let ready = false;
  const begin = () => {
    if (ready) return;
    ready = true;
    render(null, false);
    new ResizeObserver(() => {
      if (view === "map") render(selected, false);
      if (view === "web") paintWeb(true);
    }).observe(pane);
    // A first look, once it's on screen: the Bennets opened, and Elizabeth's connections.
    if (reduceMotion) return;
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      setTimeout(() => { if (!touched) tap("f:bennets"); }, 900);
      setTimeout(() => { if (!touched) show("elizabeth"); }, 2300);
    }, { threshold: .5 });
    io.observe(demo);
  };
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(begin); else begin();
})();

// iPhone Duo: each way you hold it ----------------------------------------------

(() => {
  const fold = document.getElementById("fold");
  const template = document.getElementById("fold-screen");
  if (!fold || !template) return;
  const items = [...fold.querySelectorAll(".fold__item")];
  const [up, down] = fold.querySelectorAll(".fold__step");
  const slider = document.getElementById("fold-slider");
  const stage = fold.querySelector(".fold__stage");
  const rig = fold.querySelector(".fold__rig");
  const hinged = fold.querySelector(".fold__half--a");
  const fixed = fold.querySelector(".fold__half--b");
  // The inner screen runs across the fold: each half has all of it, showing its own side.
  fold.querySelectorAll(".fold__screen").forEach((screen) => screen.append(template.content.cloneNode(true)));
  const modes = [...fold.querySelectorAll(".fcv__mode")];
  const faces = {
    inA: hinged.querySelector(".fold__face--in"),
    outer: hinged.querySelector(".fold__face--out"),
    inB: fixed.querySelector(".fold__face--in"),
  };

  // Each way to hold it: where the Duo sits (in its open width), how it's turned (degrees, CSS's
  // axes: y down, z toward you), how far the left half is folded over (180 is shut), and what the
  // inner screen shows.
  const POSES = {
    book: { x: 0, y: .03, s: 1, rx: 14, ry: -26, rz: 0, fold: 52, mode: "spread" },
    flat: { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 0, fold: 0, mode: "wide" },
    tall: { x: 0, y: 0, s: 1, rx: 0, ry: 0, rz: 90, fold: 0, mode: "tall" },
    closed: { x: -.235, y: 0, s: 1.04, rx: 0, ry: 16, rz: 0, fold: 180, mode: "spread" },
    table: { x: 0, y: .15, s: 1.04, rx: 62, ry: 0, rz: 90, fold: 62, mode: "table" },
  };
  // The slider: shut at 0, flat at 1, kept in the middle as it opens. Partway, it's a book.
  const sliding = (v) => {
    const angle = 180 * (1 - v);
    const middle = angle >= 90 ? .25 : .25 * (1 - Math.cos(angle * Math.PI / 180));
    return { x: -middle, y: 0, s: 1, rx: 0, ry: 0, rz: 0, fold: angle, mode: v >= .999 ? "wide" : "spread" };
  };

  // Light from the top left: how much a face darkens as it turns away from it.
  const rad = Math.PI / 180;
  const light = [-.25, -.4, 1].map((c, _, v) => c / Math.hypot(...v));
  const turned = ([x, y, z], p) => {
    // rotateZ, then rotateY, then rotateX, the order CSS applies them in.
    const [cz, sz, cy, sy, cx, sx] = [p.rz, p.rz, p.ry, p.ry, p.rx, p.rx].map((d, i) => (i % 2 ? Math.sin : Math.cos)(d * rad));
    [x, y] = [x * cz - y * sz, x * sz + y * cz];
    [x, z] = [x * cy + z * sy, z * cy - x * sy];
    [y, z] = [y * cx - z * sx, y * sx + z * cx];
    return [x, y, z];
  };
  const shade = (n) => {
    const lit = n[0] * light[0] + n[1] * light[1] + n[2] * light[2];
    return Math.min(.5, Math.max(0, (1 - lit / light[2]) * .45)).toFixed(3);
  };

  // Where the Duo is, springing toward where it's going: a critically damped spring for each
  // number, so a move eases in and out, and the slider is followed closely but smoothly.
  const KEYS = ["x", "y", "s", "rx", "ry", "rz", "fold"];
  let now = sliding(0), target = sliding(0), stiffness = 7, frame = 0, last = 0, width = 0;
  const speed = Object.fromEntries(KEYS.map((k) => [k, 0]));

  const apply = () => {
    const p = now;
    rig.style.transform = `translate3d(${p.x * width}px, ${p.y * width}px, 0) scale3d(${p.s}, ${p.s}, ${p.s}) rotateX(${p.rx}deg) rotateY(${p.ry}deg) rotateZ(${p.rz}deg)`;
    hinged.style.transform = `rotateY(${p.fold}deg)`;
    const f = p.fold * rad;
    faces.inA.style.setProperty("--shade", shade(turned([Math.sin(f), 0, Math.cos(f)], p)));
    faces.outer.style.setProperty("--shade", shade(turned([-Math.sin(f), 0, -Math.cos(f)], p)));
    faces.inB.style.setProperty("--shade", shade(turned([0, 0, 1], p)));
  };
  const step = (t) => {
    const dt = Math.min(.064, last ? (t - last) / 1000 : 1 / 60);
    last = t;
    const n = Math.ceil(dt * 240), h = dt / n;
    let moving = false;
    for (const k of KEYS) {
      for (let i = 0; i < n; i++) {
        speed[k] += (stiffness * stiffness * (target[k] - now[k]) - 2 * stiffness * speed[k]) * h;
        now[k] += speed[k] * h;
      }
      const near = k === "rx" || k === "ry" || k === "rz" || k === "fold" ? .02 : 1e-4;
      if (Math.abs(target[k] - now[k]) > near || Math.abs(speed[k]) > near) moving = true;
    }
    if (!moving) KEYS.forEach((k) => { now[k] = target[k]; speed[k] = 0; });
    apply();
    frame = moving ? requestAnimationFrame(step) : 0;
  };
  const run = () => {
    if (reduceMotion) { now = { ...target }; apply(); return; }
    if (!frame) { last = 0; frame = requestAnimationFrame(step); }
  };

  // What the inner screen shows: the old layout fades as the new one comes in.
  let mode = "";
  const show = (m) => {
    if (m === mode) return;
    mode = m;
    modes.forEach((el) => el.classList.toggle("is-on", el.dataset.mode === m));
  };

  const go = (pose) => {
    if (pose === "fold") { stiffness = 8; target = sliding(slider.value / 1000); }
    else { stiffness = 6; target = POSES[pose]; }
    show(target.mode);
    run();
  };

  // The list: the one picked opens into its card, the one before closes back to a pill.
  let at = 0, touched = false;
  const pick = (i) => {
    if (i < 0 || i >= items.length || i === at) return;
    const before = items.map((li) => li.getBoundingClientRect());
    const hadFocus = items[i].contains(document.activeElement);
    items.forEach((li, j) => {
      const open = j === i;
      li.classList.toggle("is-open", open);
      li.querySelector(".fold__pill").setAttribute("aria-expanded", String(open));
      li.querySelector(".fold__card").hidden = !open;
    });
    if (!reduceMotion) {
      items.forEach((li, j) => {
        const a = before[j], b = li.getBoundingClientRect();
        if (Math.abs(a.width - b.width) < 1 && Math.abs(a.height - b.height) < 1) return;
        li.animate([{ width: `${a.width}px`, height: `${a.height}px` }, { width: `${b.width}px`, height: `${b.height}px` }],
          { duration: 520, easing: "cubic-bezier(.3, .7, .2, 1)" });
        const inside = li.querySelector(li.classList.contains("is-open") ? ".fold__card" : ".fold__pill");
        inside.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 380, delay: 140, easing: "ease", fill: "backwards" });
      });
    }
    // The pill pressed is gone: keep the keyboard where it was, on the card that replaced it.
    if (hadFocus) items[i].querySelector(".fold__card").focus({ preventScroll: true });
    at = i;
    up.disabled = i === 0;
    down.disabled = i === items.length - 1;
    go(items[i].dataset.pose);
  };
  items.forEach((li, i) => {
    li.querySelector(".fold__card").tabIndex = -1;
    li.querySelector(".fold__pill").addEventListener("click", () => { touched = true; pick(i); });
  });
  up.addEventListener("click", () => { touched = true; pick(at - 1); });
  down.addEventListener("click", () => { touched = true; pick(at + 1); });

  const slide = () => {
    const v = slider.value / 1000;
    slider.setAttribute("aria-valuetext", v <= 0 ? "Closed" : v >= 1 ? "Open flat" : `${Math.round(v * 100)}% open`);
    if (items[at].dataset.pose !== "fold") return;
    stiffness = 11;
    target = sliding(v);
    show(target.mode);
    run();
  };
  slider.addEventListener("input", () => { touched = true; slide(); });

  // Sizes follow the stage; the Duo's moves are in its own width.
  new ResizeObserver(() => { width = fixed.offsetWidth * 2; apply(); }).observe(stage);
  show(now.mode);

  // A first look, once it's on screen: it opens partway, into a book.
  if (reduceMotion) return;
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    setTimeout(() => {
      if (touched || at !== 0) return;
      const start = performance.now();
      const ease = (k) => (k < .5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
      const tick = (t) => {
        if (touched || at !== 0) return;
        const k = Math.min(1, (t - start) / 1800);
        slider.value = String(Math.round(620 * ease(k)));
        slide();
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, 500);
  }, { threshold: .45 });
  io.observe(stage);
})();

// Page themes and the status line ---------------------------------------------

(() => {
  const fold = document.getElementById("fold");
  const group = document.querySelector("#reading .themes");
  if (!fold || !group) return;
  radioGroup(group, (radio) => { fold.dataset.themePage = radio.dataset.setTheme; });

  // Tap the line under the page for the next one. In a spread the left page names the chapter,
  // like a printed book, or the book when the right one names the chapter.
  const clock = () => new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const choices = [
    () => ({ one: "6 pages left in chapter · 4 min", left: "Chapter 10" }),
    () => ({ one: "341 pages left in book · 6 hr 10 min · 16%", left: "Chapter 10" }),
    () => ({ one: "Chapter 10", left: "Pride and Prejudice" }),
    () => ({ one: "Chapter 10 · Pride and Prejudice", right: "Chapter 10", left: "Pride and Prejudice" }),
    () => ({ one: clock(), left: "Chapter 10" }),
    () => ({ one: "", left: "" }),
  ];
  let at = 0;
  const paint = () => {
    const line = choices[at]();
    fold.querySelectorAll("[data-status]").forEach((el) => {
      const which = el.dataset.status;
      el.textContent = which === "right" ? line.right ?? line.one : line[which];
    });
  };
  paint();
  fold.addEventListener("click", (e) => {
    if (!e.target.closest("[data-status]")) return;
    at = (at + 1) % choices.length;
    paint();
  });
})();

// Sync: an iPhone and an iPad on the same book ----------------------------------
// Turn the iPhone's pages and the iPad's Home keeps up: the newest progress from either device, and
// pages read on both. Open the book on the iPad and it goes to the newest place, the iPhone's, with
// the Continue pill to go back, as the app does (ContinueOffer, ContinueRules). The iPad never moves
// while its book is open.

(() => {
  const demo = document.getElementById("handoff");
  const source = document.getElementById("hand-text");
  if (!demo || !source) return;
  const pad = demo.querySelector('[data-hand="pad"]');
  const home = pad.querySelector('[data-view="home"]');
  const padScreen = pad.querySelector('[data-view="reader"]');
  const card = pad.querySelector("[data-open]");
  const pill = pad.querySelector("[data-pill]");
  const pillCaption = pad.querySelector("[data-pill-caption]");

  // Where the passage sits in Gutenberg's edition (front matter and all), in words; printed pages
  // are TextLength.wordsPerPage words, and reading time is at 250 words a minute.
  const BOOK_WORDS = 130469, START_WORD = 6552, WORDS_PER_PAGE = 275, WPM = 250;
  const TURNS_TO_KEEP = 6;
  const progress = (word) => (START_WORD + word) / BOOK_WORDS;
  const percent = (word) => `${Math.round(progress(word) * 100)}%`;

  // A screen's book: the passage in columns a screen apart, each word's page measured from where it
  // landed, so a place is a word and each screen finds its own page for it.
  function book(screen) {
    const flow = screen.querySelector("[data-flow]");
    flow.append(source.content.cloneNode(true));
    flow.setAttribute("aria-hidden", "true");
    const words = wrapWords(flow, "hw");
    const status = screen.querySelector("[data-hand-status]");
    let pageOf = [], starts = [], page = 0, step = 1;
    const r = {
      words,
      chapterAt: words.indexOf(flow.querySelector("[data-chapter] .hw")),
      get page() { return page; },
      get pages() { return starts.length; },
      measure() {
        // A column and the gap after it, as laid out.
        const left = flow.getBoundingClientRect().left;
        step = flow.clientWidth + (parseFloat(getComputedStyle(flow).columnGap) || 0);
        pageOf = words.map((w) => Math.max(0, Math.floor((w.getBoundingClientRect().left - left + 2) / step)));
        starts = [];
        pageOf.forEach((p, i) => { if (starts[p] === undefined) starts[p] = i; });
        for (let p = 1; p < starts.length; p++) if (starts[p] === undefined) starts[p] = starts[p - 1];
      },
      pageOf: (word) => pageOf[Math.min(Math.max(word, 0), words.length - 1)] ?? 0,
      start: (p) => starts[p] ?? 0,
      // `word`, the place on the page, for the status line: its first word unless it's another
      // device's place.
      show(next, animate = false, word = null) {
        page = Math.min(Math.max(next, 0), starts.length - 1);
        flow.classList.toggle("is-turning", animate && !reduceMotion);
        flow.style.transform = `translateX(${-page * step}px)`;
        // "1,030 pages left in book · 8 hr 14 min · 5%", as the status line can say it.
        word ??= starts[page] ?? 0;
        const left = BOOK_WORDS - START_WORD - word;
        const minutes = Math.round(left / WPM);
        const screenPages = Math.round(left / (words.length / Math.max(starts.length, 1)));
        status.textContent = `${screenPages.toLocaleString("en-US")} pages left in book · ${Math.floor(minutes / 60)} hr ${minutes % 60} min · ${percent(word)}`;
      },
    };
    return r;
  }

  const phone = book(demo.querySelector('[data-hand="phone"]'));
  const ipad = book(padScreen);
  phone.measure();
  ipad.measure();

  // Each device's place, as a word; which read last; and the reading log both add to.
  let phoneWord = phone.chapterAt;
  let padWord = 0;
  let newest = "phone";
  let backTo = null;
  let turnsSinceMove = 0;
  let today = 18, week = 103;
  let homeTimer = 0;

  const chapterOf = (word) => (word < phone.chapterAt ? "Chapter II" : "Chapter III");

  // Home: the newest progress anywhere (syncedProgress), after a moment for iCloud.
  const pct = pad.querySelector("[data-hand-pct]");
  const short = pad.querySelector("[data-hand-short]");
  const bar = pad.querySelector("[data-hand-bar]");
  const todayEl = pad.querySelector("[data-hand-today]");
  const weekEl = pad.querySelector("[data-hand-week]");
  function setText(el, text, flash) {
    if (el.textContent === text) return;
    el.textContent = text;
    if (flash && !reduceMotion) { el.classList.remove("is-new"); void el.offsetWidth; el.classList.add("is-new"); }
  }
  function paintHome(flash = true) {
    const word = newest === "phone" ? phoneWord : padWord;
    setText(pct, `${percent(word)} read`, flash);
    setText(short, percent(word), flash);
    bar.style.width = `${(progress(word) * 100).toFixed(2)}%`;
    setText(todayEl, String(today), flash);
    setText(weekEl, String(week), flash);
  }

  function setReading(on) {
    pad.classList.toggle("is-reading", on);
    home.setAttribute("aria-hidden", String(on));
    padScreen.setAttribute("aria-hidden", String(!on));
    card.tabIndex = on ? -1 : 0;
    padScreen.querySelectorAll("button").forEach((b) => { b.tabIndex = on ? 0 : -1; });
  }

  function hidePill() { pill.hidden = true; padScreen.classList.remove("has-pill"); backTo = null; }

  // "Tap to go back to Chapter II · 3 pages back": printed pages from the new place to the old one.
  function showPill(from, to) {
    const raw = (from - to) / WORDS_PER_PAGE;
    const count = raw === 0 ? 0 : Math.sign(raw) * Math.max(1, Math.round(Math.abs(raw)));
    const distance = count === 0 ? "On this page"
      : Math.abs(count) === 1 ? `1 page ${count > 0 ? "ahead" : "back"}`
      : `${Math.abs(count)} pages ${count > 0 ? "ahead" : "back"}`;
    const place = chapterOf(from) === chapterOf(to) ? "your place here" : chapterOf(from);
    backTo = from;
    turnsSinceMove = 0;
    pill.hidden = false;
    padScreen.classList.add("has-pill");
    pillCaption.textContent = `Tap to go back to ${place} · ${distance}`;
    if (pillCaption.scrollWidth > pillCaption.clientWidth + 1) pillCaption.textContent = `Tap to go back · ${distance}`;
  }

  // Opening the book: to the iPhone's newer place, unless it's on the page already showing.
  function openPad() {
    clearTimeout(homeTimer);
    hidePill();
    const from = padWord;
    if (newest === "phone" && ipad.pageOf(phoneWord) !== ipad.pageOf(padWord)) {
      padWord = phoneWord;
      ipad.show(ipad.pageOf(padWord), false, padWord);
      setReading(true);
      setTimeout(() => showPill(from, padWord), reduceMotion ? 0 : 380);
    } else {
      ipad.show(ipad.pageOf(padWord), false, padWord);
      setReading(true);
    }
  }

  function closePad() {
    hidePill();
    setReading(false);
    paintHome(false);
  }

  function turnPhone(step) {
    const next = phone.page + step;
    if (next < 0 || next >= phone.pages) return;
    phone.show(next, true);
    phoneWord = phone.start(next);
    newest = "phone";
    if (step > 0) { today += 1; week += 1; }
    clearTimeout(homeTimer);
    homeTimer = setTimeout(() => paintHome(true), reduceMotion ? 0 : 900);
  }

  function turnPad(step) {
    const next = ipad.page + step;
    if (next < 0 || next >= ipad.pages) return;
    ipad.show(next, true);
    padWord = ipad.start(next);
    newest = "pad";
    if (step > 0) { today += 1; week += 1; }
    if (backTo !== null && ++turnsSinceMove >= TURNS_TO_KEEP) hidePill();
  }

  phone.show(phone.pageOf(phoneWord));
  ipad.show(0);
  paintHome(false);
  setReading(false);

  // After a resize or the fonts settle, each screen finds its page for its place again.
  let frame = 0;
  const relayout = () => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      phone.measure();
      ipad.measure();
      phone.show(phone.pageOf(phoneWord), false, phoneWord);
      ipad.show(ipad.pageOf(padWord), false, padWord);
    });
  };
  window.addEventListener("resize", relayout);
  if (document.fonts) document.fonts.ready.then(relayout);

  // Played once as it comes into view, until you take over.
  let touched = false;
  const timers = [];
  const takeOver = () => { touched = true; timers.forEach(clearTimeout); card.classList.remove("is-pressed"); };
  demo.addEventListener("pointerdown", takeOver);
  demo.addEventListener("keydown", takeOver);

  demo.querySelectorAll('[data-hand="phone"] [data-turn]').forEach((b) => b.addEventListener("click", () => turnPhone(Number(b.dataset.turn))));
  padScreen.querySelectorAll("[data-turn]").forEach((b) => b.addEventListener("click", () => turnPad(Number(b.dataset.turn))));
  card.addEventListener("click", openPad);
  pad.querySelector("[data-close]").addEventListener("click", closePad);
  pad.querySelector("[data-pill-keep]").addEventListener("click", hidePill);
  pad.querySelector("[data-pill-back]").addEventListener("click", () => {
    if (backTo === null) return;
    padWord = backTo;
    newest = "pad";
    ipad.show(ipad.pageOf(padWord), true, padWord);
    hidePill();
  });

  if (reduceMotion || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    io.disconnect();
    if (touched) return;
    let at = 700;
    const later = (ms, fn) => { at += ms; timers.push(setTimeout(() => { if (!touched) fn(); }, at)); };
    later(0, () => turnPhone(1));
    later(1300, () => turnPhone(1));
    later(1300, () => turnPhone(1));
    later(2000, () => card.classList.add("is-pressed"));
    later(220, () => { card.classList.remove("is-pressed"); openPad(); });
  }, { threshold: .45 });
  io.observe(demo.querySelector(".hand__stage"));
})();

// Copy buttons for the contact address ----------------------------------------

document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const source = document.querySelector(btn.dataset.copy);
    if (!source) return;
    const label = btn.textContent;
    const done = (text) => { btn.textContent = text; setTimeout(() => { btn.textContent = label; }, 1800); };
    const select = () => {
      const range = document.createRange();
      range.selectNodeContents(source);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      done("Selected");
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(source.textContent.trim()).then(() => done("Copied"), select);
    } else {
      select();
    }
  });
});

// A look around: the arrows scroll the screenshots a few at a time ---------------
{
  const rail = document.querySelector(".tour__rail");
  const buttons = document.querySelectorAll("[data-tour]");
  if (rail && buttons.length) {
    const update = () => {
      const max = rail.scrollWidth - rail.clientWidth - 2;
      buttons.forEach((b) => { b.disabled = b.dataset.tour === "-1" ? rail.scrollLeft <= 2 : rail.scrollLeft >= max; });
    };
    buttons.forEach((b) => b.addEventListener("click", () => {
      const item = rail.querySelector(".tour__item");
      const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(item.parentElement).columnGap || 0) : 240;
      const by = Math.max(1, Math.floor(rail.clientWidth / step) - 1) * step;
      rail.scrollBy({ left: Number(b.dataset.tour) * by, behavior: reduceMotion ? "auto" : "smooth" });
    }));
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }
}
