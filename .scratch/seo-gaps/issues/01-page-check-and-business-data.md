# 01: Page check, and the business data carries the phone and price range

**What to build:** One check script that reads the home page and fails when a settled decision is broken, plus the first thing it guards: the hidden business data Google reads now has the phone (602) 767-4110 in international form and a price range, and still has no rating, review, FAQ or social profile entries. Running the check with one command prints pass or fail per rule.

**Blocked by:** None (can start immediately)

**Status:** done
**Flow:** grill-me

- [x] The check script exists, runs with one command noted in `CLAUDE.md`, and its folder is listed in `_config.yml` `exclude`
- [x] Checks written first and seen failing: business data parses as JSON; has the phone; has a price range
- [x] Guard checks that pass today and must keep passing: no rating, review or FAQ types; nothing shaped like a state licence number anywhere on the page; no em-dash in visible text; the six card names unchanged
- [x] The business data is changed and every check passes
- [x] The business data validates in Google's Rich Results Test or the Schema.org validator (paste the code, no live URL needed)
- [x] Committed on the work branch, only this ticket's files, by name. No push.

## Comments

11/25/2026, built:

- `checks/site-check.mjs`, 7 checks. First run: 5 of 7 passed; the phone and the price range failed, as they should. "Parses as JSON" already passed, the data was valid before. After the change: 7 of 7.
- Each check was proven able to fail: a copy of the page was broken 12 ways (bad JSON, a rating, a social list, an FAQ block, licence-shaped text, an em-dash as a character, as an entity and in alt text, a card renamed, cards reordered, wrong phone, price removed). All 12 were caught by the right check.
- Business data now has `telephone` `+1-602-767-4110`. (A price field was added here and later taken out: ADR 0004.) validator.schema.org on the pasted block: 0 errors, 0 warnings, one `LocalBusiness`.
- Not checked yet: that GitHub Pages keeps `checks/` off the live site. Ticket 07 reads the live URL back.
- 11/25/2026: the price range was taken out again in ticket 03 (Filip: no price on the site, shown or hidden; ADR 0004). The check is now "no price anywhere".
