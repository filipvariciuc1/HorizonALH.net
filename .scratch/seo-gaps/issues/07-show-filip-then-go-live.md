# 07: Show Filip everything, then one push

**What to build:** Filip sees the whole finished home page, before and after, and says yes. Then it goes live in one merge and one push, and the live site is checked.

His words: "Build all, show me, push once."

**Blocked by:** 01, 02, 03, 04, 05, 06

**Status:** done
**Flow:** grill-me

- [x] The full check script passes on the work branch
- [x] Full-page before and after pictures at phone and desktop width are sent to Filip, with a five-line list of what changed
- [x] **Stop and wait for his yes.** Anything he wants changed is fixed and shown again
- [x] After his yes in that turn: `git pull --rebase` on `main`, merge the work branch, push once. Never force
- [x] Live check, read back from www.horizonalh.net: the new headline, price line and reviews are there; the business data on the live page has the phone
- [x] Live check: `/GLOSSARY.html`, `/GLOSSARY.md`, `/CLAUDE.html` and `/docs/` do not load
- [x] The live page is run through Google's Rich Results Test with no errors
- [x] Filip is told in three lines what is live and how to see it

## Comments

- 11/25/2026: Filip caught a false line (Directed Care and Memory Care are two different things) and asked for plain words in place of lines that read like AI. Both fixed and shown, then he said "Yes".
- Live as one squash commit `ce1f9b2` on `main`. Read back from www.horizonalh.net: new headline, care guide, what is included, 3 reviews, phone in the business data, no price anywhere (the box above says "price line"; there is none, by ADR 0004). `/GLOSSARY.html`, `/GLOSSARY.md`, `/CLAUDE.html`, `/docs/` return 404.
- Rich Results Test on the live page: 2 valid items (Local businesses, Organization), no errors. Local businesses shows "Non-critical issues detected"; not opened.
