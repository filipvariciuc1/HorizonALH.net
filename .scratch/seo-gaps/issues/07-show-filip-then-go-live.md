# 07: Show Filip everything, then one push

**What to build:** Filip sees the whole finished home page, before and after, and says yes. Then it goes live in one merge and one push, and the live site is checked.

His words: "Build all, show me, push once."

**Blocked by:** 01, 02, 03, 04, 05, 06

**Status:** in-progress
**Flow:** grill-me

- [x] The full check script passes on the work branch
- [x] Full-page before and after pictures at phone and desktop width are sent to Filip, with a five-line list of what changed
- [ ] **Stop and wait for his yes.** Anything he wants changed is fixed and shown again
- [ ] After his yes in that turn: `git pull --rebase` on `main`, merge the work branch, push once. Never force
- [ ] Live check, read back from www.horizonalh.net: the new headline, price line and reviews are there; the business data on the live page has the phone
- [ ] Live check: `/GLOSSARY.html`, `/GLOSSARY.md`, `/CLAUDE.html` and `/docs/` do not load
- [ ] The live page is run through Google's Rich Results Test with no errors
- [ ] Filip is told in three lines what is live and how to see it
