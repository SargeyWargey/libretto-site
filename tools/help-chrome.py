"""Keep the help guides' shared chrome in step, and fill in reading times.

Run after editing a guide or help/_template.html: `python3 Website/tools/help-chrome.py`.

- SITE-NAV, GUIDE-NAV and SITE-FOOT in every help/*.html guide are replaced with the canonical
  blocks from help/_template.html (GUIDE-NAV gains a search box; the page's own link gets
  aria-current="page").
- Each guide's minutes to read (its content at 230 words a minute) go into the
  `data-minutes` spans on index.html, support.html and help/index.html.
"""
import html, re
from pathlib import Path

site = Path(__file__).resolve().parent.parent
help_dir = site / "help"
template = (help_dir / "_template.html").read_text()

def block(text, name):
    m = re.search(rf"<!-- {name}[^>]*-->.*?<!-- /{name} -->", text, re.S)
    return m.group(0) if m else None

site_nav = block(template, "SITE-NAV")
guide_nav = block(template, "GUIDE-NAV")
site_foot = block(template, "SITE-FOOT")

search = '''    <a class="guide-nav__home" href="index.html">All guides</a>
    <form class="guide-search" role="search" action="index.html">
      <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" stroke-width="2"/><path d="m15.5 15.5 4.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
      <input name="q" type="search" placeholder="Search the guides" aria-label="Search the guides" autocomplete="off">
    </form>'''
if "guide-search" not in guide_nav:
    guide_nav = guide_nav.replace('    <a class="guide-nav__home" href="index.html">All guides</a>', search)
guide_nav = guide_nav.replace(' aria-current="page"', "")

minutes = {}
for page in sorted(help_dir.glob("*.html")):
    if page.name in ("_template.html", "index.html"):
        continue
    text = page.read_text()
    for name, canonical in (("SITE-NAV", site_nav), ("SITE-FOOT", site_foot)):
        old = block(text, name)
        if old:
            text = text.replace(old, canonical)
    old = block(text, "GUIDE-NAV")
    if old:
        mine = guide_nav.replace(f'<a href="{page.name}">', f'<a href="{page.name}" aria-current="page">')
        text = text.replace(old, mine)
    page.write_text(text)

    m = re.search(r"CONTENT START.*?-->(.*?)<!-- =+ CONTENT END", text, re.S)
    if m:
        words = len(html.unescape(re.sub(r"<[^>]+>", " ", re.sub(r"<!--.*?-->", " ", m.group(1), flags=re.S))).split())
        minutes[page.name] = max(2, round(words / 230))
        print(f"{page.name:24} {words:6} words  {minutes[page.name]:3} min")

for listing in (site / "index.html", site / "support.html", help_dir / "index.html"):
    text = listing.read_text()
    def fill(m):
        name = m.group(1).split("/")[-1]
        n = minutes.get(name)
        return f'<span class="contents__n" data-minutes="{m.group(1)}">{f"{n} min" if n else ""}</span>'
    text = re.sub(r'<span class="contents__n" data-minutes="([^"]+)">[^<]*</span>', fill, text)
    listing.write_text(text)
