# horizonalh.net

Static site for Horizon Assisted Living Home. Plain HTML, no build step.

## Live site rules

- **A push to `main` is live at once.** GitHub Pages serves `main` at www.horizonalh.net (`CNAME`). Never push `main` without Filip's yes in that turn.
- **This repo is public and Pages builds it with Jekyll.** Any `.md` file not listed in `_config.yml` `exclude` gets published as a page. Add every new working doc or folder to that list.
- **Never write the state licence number in any file here**, not in copy, schema, docs or tickets. The site may say the home is licensed. See `docs/adr/0003-licensed-without-the-number.md`.
- **No price anywhere on the site, shown or hidden**: no dollar amount in the page, no `priceRange` in the business data. See `docs/adr/0004-no-price-on-the-site.md`.
- Work happens on a branch. `main` gets one merge and one push at the end, after Filip has seen the result.

## Page check

    node C:/dev/HorizonALH.net/checks/site-check.mjs

Reads the home page and prints pass or fail per settled decision (business data, licence number shape, em-dashes, card names). Run it before every commit that touches `index.html`. Give it a URL to check the live page: `node C:/dev/HorizonALH.net/checks/site-check.mjs https://www.horizonalh.net/`. Each ticket adds its own checks there first, sees them fail, then makes them pass.

- A check in `checks/site-check.mjs` is never weakened or deleted to get a pass; it changes only when Filip changes the decision behind it.
- The grill's mock pictures used draft wording that was never approved: write copy fresh from the spec.

## Traps

- **Never `Read` the `svg class="svc-ic"` lines of `index.html` (inside `.cards`; find them with `grep -n svc-ic index.html | cut -c1-40`).** They hold inline SVG icons, about 25k tokens. Use `grep -o` or a Node string swap to look at or change the cards.
- Phone links are `href="#call"` on purpose. `/assets/site.js` fills in the number. Not a bug.
- The page has a CSP meta tag. `style-src` allows inline styles; `script-src` is `'self'` plus Google hosts, so **no new inline scripts**. JSON-LD data blocks are fine. New hosts need a CSP change.
- All home page CSS is inline in `index.html`. The small pages (`/contact/`, `/privacy/`, `/messaging-terms/`) use `/assets/pages.css`.
- Visible copy never has em-dashes.
- Do not invent care facts. Use what the site already says, `GLOSSARY.md` and the spec. Anything else is a question for Filip.
- `.hero p` sets the font size of `.eyebrow` and `.hero-note` inside the hero. Leave it.
- The `code-review` skill skips untracked files. Run `git add -N <file>` on new files first.
- The cost block checks read the block as plain text, split it on question marks, and put attribute text (`alt`, `title`, `aria-label`) at the end. So: no question mark in its eyebrow or heading, every answer ends with a full stop, and no `aria-label` inside the block.

## Agent skills

### Issue tracker

Local markdown under `.scratch/<feature>/`. See `docs/agents/issue-tracker.md`.

### Domain docs

Single-context: `GLOSSARY.md` at the root, decisions in `docs/adr/`. See `docs/agents/domain.md`.

## SEO work: do not (from the park handoffs, 11/25/2026)

- Do not put a dollar amount or a price range anywhere: page, business data, alt text, description, docs, commit messages.
- Do not push anything, and do not merge into `main`, before ticket 07 and Filip's yes in that turn.
- Do not write the licence number in any file, copy, schema, ticket, check or commit message.
- Do not reuse the mock copy from the grill (`build-mocks.mjs`): draft wording, never approved.
- Do not weaken or delete a check to get a pass (the 950-word floor included).
- Do not overwrite a `before-*` or `after-*` picture. A retake uses a new label.
- Do not let a picture script of our own page reach the ad or analytics hosts.
- Do not change the page title or description, the six card names or their text, or the existing "24 hours" / "24/7" lines. No "night staff / overnight / awake" wording, no visiting hours, no care fact that is not in the spec, the glossary or already on the site. Never "Medicaid" alone for ALTCS.
- Do not add FAQ, rating or review markup (ADR 0002), an accordion script, or a new inline script.
- Do not change anything on Yelp, Apple Maps, BBB, A Place for Mom or ADHS, and do not build the phone layout things: offered to Filip, wait for his yes.
- Do not start another session or a background build agent for the tickets: Filip watches the build in this session.
- Do not invent, shorten or polish a review, do not put a reviewer's surname in the repo, and do not put a review in the page before Filip has seen it.
