# 05: Three real Google reviews on the home page

**What to build:** A family reads three real reviews, word for word from the home's Google profile, each with a first name only, and a "Read all on Google" link. Plain quotes, no stars drawn from markup.

Google profile: `https://maps.google.com/?cid=8962275276666028087`

**Blocked by:** 01

**Status:** done
**Flow:** grill-me

- [x] The reviews are read fresh from the Google profile in Chrome (count and texts were helper-reported, not checked)
- [x] Three are picked: specific, warm, about care, different voices. **Filip sees the three and says yes before they go into the page.** This is the one stop in this ticket: ask with a picture of the block, then wait
- [x] Text is word for word; a long review may be cut only with a clear "..." and never so that its meaning changes
- [x] First name only
- [x] Checks added first and seen failing: three quotes present; a link to the Google profile; guard: no rating or review markup (ADR 0002)
- [x] Reference picked first; result judged next to it by eye; pictures at phone and desktop width
- [x] Follows `~/.claude/rules/ui-design-checklist.md` and `~/.claude/rules/no-em-dashes-in-ui-copy.md` (a reviewer's own em-dash is replaced with a comma or a full stop)
- [x] All checks pass. Committed on the work branch, only this ticket's files, by name. No push.

## Comments

11/25/2026, built:

- The Google profile was read fresh in Chrome on 11/25/2026: 9 reviews, all 5 stars. Filip saw a picture of the block and chose "Use these 3": Kim, Debbie, Jacqueline.
- Kim and Jacqueline are whole, word for word. Debbie is cut to her first two sentences plus one later one, joined by "...". First name only. No stars, no quote marks, no rating or review markup (ADR 0002). Reference: the Sunrise Senior Living testimonials page (first name only, no stars, whole short quotes).
- The block sits between the gallery and the "come see it" strip: eyebrow "Google reviews", heading "What families say", sage background, a bold "Read all on Google" link to the profile.
- Kim's review is long, so three equal cards left a big empty hole in the other two. Kim's card is 1.5 times as wide on desktop and the three cards come out even (12, 12 and 11 lines at 1280 px). Under 1000 px the cards stack in one column (at 820 px the side cards had text only 147 px wide).
- 4 new checks, seen failing first; 29 of 29 pass. 14 break cases, each caught by the right check only (run again after the last change). There is no em-dash check of its own: the page-wide one covers the block (break case 13). Code review at `low` gave no findings.
- Looked at on desktop and phone: no sideways overflow at 821, 900, 1024, 1100 and 1280 px, no page errors. The rest of the page did not move: the contact part is the same height on the old and the new page (1547.3 px at 1280 wide, 2164.4 px at 390 wide); the 1 px seen in the pictures was rounding, because the part now starts at a different half pixel.
- A fresh eyes pass, not done, on purpose: equal card widths (the hole comes back, and Kim's text cannot be cut without a new yes); an arrow or a Google mark on the link; a "Reviews" entry in the side menu (it lights "Gallery" here, as it does for the cost block); a "Google" tag or date on each card (the eyebrow says it); Jacqueline's two empty lines; a second link above the cards on the phone; less space above and below (same padding as the other parts).
- `CLAUDE.md`: new section "SEO work: do not".
