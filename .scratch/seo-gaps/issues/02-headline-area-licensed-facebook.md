# 02: Headline names the town, the area line, "licensed", and the dead Facebook link goes

**What to build:** A visitor sees "Assisted living home in Glendale, Arizona" as part of the main headline (the small line above it becomes part of the headline, same look), reads "In Arrowhead Ranch, minutes from Peoria and Sun City" by the address, reads one warm mention that the home is licensed, and finds no Facebook link in the footer.

**Blocked by:** 01

**Status:** done
**Flow:** grill-me

- [x] Checks added first and seen failing: main headline contains "Assisted living home in Glendale, Arizona"; the area line is present; the word "licensed" is present; no link to Facebook
- [x] Before the area line is written: confirm on a map that the home's address is inside Arrowhead Ranch and that Peoria and Sun City are a short drive. If not, stop and ask Filip
- [x] There is still exactly one main headline on the page
- [x] The licence number appears nowhere (ADR 0003)
- [x] Before and after pictures at phone and desktop width, looked at side by side; the look is unchanged apart from the new words
- [x] Follows `~/.claude/rules/ui-design-checklist.md` and `~/.claude/rules/no-em-dashes-in-ui-copy.md`
- [x] All checks pass. Committed on the work branch, only this ticket's files, by name. No push.

## Comments

- Map: OpenStreetMap puts the address in "Arrowhead Ranch Phase II". About 10.7 road km to Sun City and 11.3 to old town Peoria.
- "licensed" sits in the about paragraph: "a licensed, full-service assisted living home". "full-service" is kept on one line so it does not split at its hyphen.
- The area line is right under the address. The tours line comes last, with a small gap above it, so the two grey lines do not read as one.
- The top part of the page is 36px taller on desktop and 66px taller on a phone, all from the address note going from one thought to three.
- The small headline line still wraps to two lines, as it did before this ticket.
- Reference looked at: Brookdale Arrowhead Ranch (name, then address, then phone, stacked at the top).
- Seen in the pictures but there before this ticket and not touched: on a phone the menu comes after the address, the hero photo is far down, and the two "Our Home" photos sit small and to the right. Not SEO work; offered to Filip as its own job.
