# 03: Cost and questions block

**What to build:** A new block on the home page where a family reads what the monthly price covers, that ALTCS and private pay are both welcome, that the price is given by phone, and short answers to the common questions. It looks like it was always part of the page.

Filip's wording, keep close to it: "Prices include the room & furnishings, meals, care, housekeeping and laundry, medication management. Accept ALTCS too". No amount: "Yeah honestly i wouldnt want to show prices honestly" (Filip, 11/25/2026, ADR 0004). The block says "Call us for pricing".

Answers, in his words: rooms "both" (private and shared); couples "yes"; pets "not permamently on site" (visits fine, no pets live there); hospice "Yes"; moving in "Call and tour".

**Blocked by:** 01

**Status:** done
**Flow:** grill-me

- [x] Checks added first and seen failing: the block says to call for the price, and no dollar amount or price range anywhere; each covered item present; ALTCS and private pay named in the block; an answer for rooms, couples, pets, hospice and moving in
- [x] Guard checks: no visiting hours, no night staff claim, no FAQ markup (ADR 0002)
- [x] No care fact that is not in the spec, the glossary or already on the site
- [x] Reference app or site picked first for how a cost and questions block should look; the result is put next to it and judged by eye
- [x] Pictures at phone and desktop width for Filip
- [x] New styles sit with the page's existing styles; no new inline script
- [x] Follows `~/.claude/rules/ui-design-checklist.md` and `~/.claude/rules/no-em-dashes-in-ui-copy.md`
- [x] All checks pass. Committed on the work branch, only this ticket's files, by name. No push.

## Comments

11/25/2026, built:

- Block sits between the daily section and the gallery: what the monthly price covers, ALTCS and private pay, Call us for pricing, five answers. No price anywhere, shown or hidden (ADR 0004). Reference: Brookdale Arrowhead Ranch (no price, a call instead) and Sunrise of Scottsdale (rows split by thin lines).
- 21 page checks pass. 11 break cases, each caught by the right check only. Looked at on desktop and phone. A fresh eyes pass led to two fixes: Call us in the last answer is a call link, and the answers no longer leave one word alone on a line.
