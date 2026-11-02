# Libretto website

A static site: plain HTML, CSS and JavaScript, with no build step. Open `index.html` in a browser to preview it, or upload the folder to any static host (GitHub Pages, Netlify, Cloudflare Pages). Help search fetches the guide pages, so preview it over HTTP (`python3 -m http.server --directory Website`), not from `file://`.

## The look

An evening with a book. Night sections are the app icon's navy, lit by a reading lamp (a warm gold glow in the hero). Light sections are a cool periwinkle Mist (with a faint grain) and a near-white Page, drawn from the icon's navy, plus one Forest section (Hands-free). In dark mode the light sections turn to deep indigo. The cyan line is Read-Along's narration marker; flamingo pink is kept for the Story features, as in the app. All colors are tokens at the top of `assets/styles.css`.

Fonts: Fraunces (headings, with its soft axis turned up) and Hanken Grotesk (text) from Google Fonts. Book pages use the reader's own font stack: New York on Apple devices, Georgia elsewhere.

## Files

| File | What |
|---|---|
| `index.html` | The product page: hero with the reading demo, a tour of real screenshots, then Read-Along, the Story features, Reading, Hands-free, Notebook, Sync, Goals, Everywhere (Watch, TV, iPad and Duo, widgets, Siri), Library, Privacy, Pricing, Questions, and an invitation to the guides |
| `help/` | The Help Center: `index.html` (search, the most-asked three, every guide in parts) and twelve guides (see below) |
| `help/_template.html` | The guide template. The site nav, guide list and footer in it are the master copies |
| `support.html` | Support (App Store Connect asks for its URL): search, where to look first, requirements, contact |
| `privacy.html` | Privacy policy (App Store Connect asks for its URL), word for word the app's own (`Libretto/App/PrivacyPolicyView.swift`) |
| `assets/styles.css` | Tokens and everything on the product, support and privacy pages |
| `assets/help.css` | The guides: the reading desk layout, short version, steps, options, notes, screenshots, diagrams |
| `assets/main.js` | The nav's icon waking up on the first page of a visit (the app's splash: `Libretto/App/SplashArt.swift`), and the demos: the headline read aloud, the narrating phone, Catch Me Up, the Story Map (the iPad's Recaps and mind map: tap names to open them, Map / Outline / Web; Pride and Prejudice after 17 chapters, written for the page), the iPhone Duo in 3D (open and close it with the slider, or pick a way to hold it), the page themes, the status line, Sync (an iPhone and an iPad on the same book, with the Continue pill), and the screenshot tour's arrows |
| `assets/help.js` | On a guide: On This Page (beside it, or folded under the title), a link on each heading, the guide list folding away on a phone, the reading time. Search across every guide, on the Help home and from the box beside each guide |
| `tools/help-chrome.py` | Keeps the guides' shared nav, guide list and footer the same as the template, and fills in each guide's minutes to read on the contents lists |
| `assets/img/` | App icon sizes, from `Libretto/Assets.xcassets/AppIcon.appiconset/AppIcon.png` |
| `assets/shots/` | Screenshots from the "Libretto Marketing" simulator (public-domain books only), 720 px wide JPEGs |

## The guides

| Guide | File |
|---|---|
| Getting started | `help/getting-started.html` |
| Reading | `help/reading.html` |
| Read-Along and audiobooks | `help/read-along.html` |
| Hands-free reading | `help/hands-free.html` |
| Recaps, Story Map and the AI | `help/story.html` |
| Sync with iCloud | `help/sync.html` |
| Goals, stats and sharing | `help/goals.html` |
| Hardcover | `help/hardcover.html` |
| iPad, Duo, Watch and TV | `help/devices.html` |
| Widgets, Siri and Shortcuts | `help/shortcuts.html` |
| Every setting | `help/settings.html` |
| Troubleshooting | `help/troubleshooting.html` |

Each opens with **The short version** (a few bullets a reader can stop after), then goes as deep as it needs, with the app's exact names for every control, and ends with Questions. They use only the markup in `help/_template.html`: `.gist`, `section.doc__sec` (with an `id`, so other pages can link to it), `ol.steps` for real sequences, `dl.opts` for settings (`.opts__default` for the default), `aside.note` (`note--tip`, `note--privacy`, `note--heads-up`), `figure.shot` (`shot--side` to sit beside the text), `span.path` for paths like Settings → iCloud & Storage, `details.qa`, and `figure.diagram` for inline SVG diagrams drawn with the `d-…` classes in `help.css` so they follow light and dark. Some guides still carry `<!-- DIAGRAM: … -->` notes for diagrams not drawn yet.

**Adding or changing a guide:** copy `help/_template.html`, fill in the content between the CONTENT START and END comments and the pager, add it to the guide list in the template, to `GUIDES` in `assets/help.js` and to the contents on `help/index.html`, then run `python3 Website/tools/help-chrome.py`. Changing the nav or footer: edit the template (and the product, support and privacy pages, which have their own copies), then run the script.

**Keeping them true:** the guides describe the app as built, from the Swift source. When a setting, label or behavior changes in the app, search the guides for its old name.

## Before it goes live

- **App Store link:** set `APP_STORE_URL` at the top of `assets/main.js`. Every Download button picks it up. When the app is live, consider Apple's official "Download on the App Store" badge in place of the drawn button.
- **Pricing:** the page says Libretto Pro is a one-time $7.99 and lists what it unlocks, from `docs/app-store-launch-prd.md` §7.1, Sync with iCloud included. The purchase isn't built in the app yet, so the guides don't say which features are paid. Change the hero note, the Pricing section and Support's Libretto Pro paragraph if that changes.
- **CarPlay** isn't mentioned anywhere yet: Apple hasn't granted the CarPlay entitlement. Add it to the Everywhere section and `help/devices.html` once it ships.
- **Privacy:** `privacy.html` is the app's policy word for word. Change the app's first, then this page.
- **Social preview:** `og:image` in `index.html` is a relative path. Most sites that show link previews want a full URL, so make it absolute once the domain is known.
