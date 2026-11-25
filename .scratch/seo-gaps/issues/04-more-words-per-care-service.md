# 04: A few more true words per care service

**What to build:** The home page says a little more about each care service (Assisted Living, Directed Care, Memory Care, Respite Care, Independent Living), so a family and Google can both tell what the home does. It is laid out as part of the page's own design. A plain wall of text on the green band was mocked in the grill and looked weak; do better than that.

Corrected by Filip on 11/25/2026 (fixed in ticket 07): Directed Care and Memory Care are two different things, and Horizon does both. Each gets its own plain meaning from `GLOSSARY.md`, in words a worried family would use.

**Blocked by:** 01

**Status:** done
**Flow:** grill-me

- [x] Checks added first and seen failing: each care service is named in running text outside its card; the page has clearly more words than before (it had 726)
- [x] The six card names and their order are unchanged
- [x] Every sentence traces to the site as it was, `GLOSSARY.md` or the spec. Anything else is a question for Filip, asked with a picture
- [x] Independent Living is not oversold: it is offered but rare
- [x] Reference picked first; result judged next to it by eye; pictures at phone and desktop width for Filip
- [x] Never `Read` the card icon lines of the home page whole (see `CLAUDE.md` Traps)
- [x] Follows `~/.claude/rules/ui-design-checklist.md` and `~/.claude/rules/no-em-dashes-in-ui-copy.md`
- [x] All checks pass. Committed on the work branch, only this ticket's files, by name. No push.

## Comments

11/25/2026, built:

- A care guide card sits under the six cards: "Four kinds of care, in plain words". Four entries, each led by a family situation (daily life needs a hand, memory loss makes it unsafe to be alone, a caregiver needs a rest, only a little help is needed), then one line saying Medication Management and Visiting Professionals come with every kind of care. Two columns on desktop, one on phone. Reference: Brookdale Arrowhead Ranch and Sunrise of Scottsdale (one plain sentence per care service, dementia named outright for Memory Care).
- Filip's "neurocognitive deficit" became "memory loss or dementia" (a worried family's words). He is told in the picture caption and can overrule.
- 4 new checks, seen failing first; 25 page checks pass. 9 break cases, each caught by the right check only. Page words went from 824 to about 1010. Code review found nothing.
- Looked at on desktop and phone. A fresh eyes pass led to three fixes: headings and the last line no longer leave one word alone, the two service names in the last line are bold, and the Assisted Living sentence reads plainer. Not done, on purpose: cutting "memory loss or dementia" to even the columns, softening "rare" for Independent Living, rewording the Respite sentence (it is the old card's wording), a louder Call us link (same style as the rest of the page).
- `CLAUDE.md`: the stale line numbers for the icon lines are replaced by a way to find them.
