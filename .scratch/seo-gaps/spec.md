# Spec: close the SEO gaps on horizonalh.net

**Status:** open
**Flow:** grill-me

Settled with Filip in a grill on 11/25/2026. His words are quoted where they decide something. Vocabulary is from `GLOSSARY.md`; decisions that must not be undone are in `docs/adr/`.

## Problem Statement

A family searching for an assisted living home near Glendale, Peoria or Sun City has a hard time finding Horizon, and when they land on the site they cannot see what the monthly price covers, whether their situation fits, or what other families say. The page headline names no town and no service. The hidden business data Google reads has no phone number. The nearby towns are never named. There are no questions and answers and no reviews. Other listings around the web show different phone numbers, which makes Google trust the home less. The footer links to a Facebook page that no longer exists.

## Solution

The one home page says plainly what Horizon is and where it is, names the area it serves, says what the monthly price covers (the amount is given by phone, never printed), answers the common questions with facts Filip gave, says a little more about each care service, and shows three real Google reviews. The hidden business data carries the right phone and no price. Filip gets a checklist to fix the phone number on other listings. Nothing goes live until he has seen all of it; then it goes live in one push.

## User Stories

1. As a family member searching "assisted living home Glendale AZ", I want the page headline to say "Assisted living home in Glendale, Arizona", so that I know at once I am in the right place.
2. As a family member in Peoria or Sun City, I want to read "In Arrowhead Ranch, minutes from Peoria and Sun City" by the address, so that I know the home is close to me.
3. ~~As a family member, I want to see a starting price, so that I know if a call is worth making.~~ Struck. Filip, 11/25/2026: no price on the site (ADR 0004). The page says "Call us for pricing".
4. As a family member, I want to see what the monthly price covers (the room and furnishings, meals, care, housekeeping and laundry, medication management), so that I can compare homes fairly.
5. As a family member on ALTCS, I want to see that ALTCS is accepted next to the price, so that I do not rule the home out.
6. As a family member paying myself, I want to see private pay named, so that I know both ways of paying are welcome.
7. As a family member, I want to know if rooms are private or shared, so that I can picture the stay. Answer: both.
8. As a spouse, I want to know if couples can move in together. Answer: yes.
9. As a family member, I want to know about pets. Answer: pets can visit; no pets live at the home.
10. As a family member, I want to know if my parent can stay when hospice starts. Answer: yes.
11. As a family member, I want to know how to start. Answer: call and tour.
12. As a family member whose parent has memory loss, I want a few clear words on Directed Care and Memory Care, so that I know the home can keep them safe.
13. As a family caregiver who needs a break, I want a few clear words on Respite Care, so that I know short stays are possible.
14. As a family member, I want to read what other families said in their own words, with a link to read all reviews on Google, so that I trust the home.
15. As a family member, I want to read that the home is licensed, so that I feel safe, without the page feeling like a government form.
16. As a family member, I want every link in the footer to work, so that the home looks cared for. The dead Facebook link is gone.
17. As Google, I want the business data to carry the phone number and no price, so that I can match the site to the Google profile.
18. As Filip, I want the site to keep its warm look and its one page, so that it still feels like my home and not a brochure.
19. As Filip, I want to see the three reviews before they are used, so that I am happy with whose words are on my site.
20. As Filip, I want to see the whole result before anything is live, so that nothing surprises me.
21. As Filip, I want a short checklist for fixing the phone number on Yelp, Apple Maps, BBB, A Place for Mom and the ADHS file, so that every listing shows (602) 767-4110.
22. As a later session, I want one check I can run that fails if a settled decision is broken, so that nobody "fixes" the site back.

## Implementation Decisions

- **Phone.** (602) 767-4110 is the only number on the site and in the business data. The business data carries it in international form.
- **Business data.** Add the phone. No price range: Filip took the price off the site, shown and hidden (ADR 0004). No social profile list: the only candidate, Facebook, is dead. No rating, review or FAQ markup (ADR 0002). The Peoria address at W Camino De Oro is "Not mine" (Filip) and appears nowhere.
- **Headline.** The small line above the headline becomes part of the main headline, so the main headline reads "Assisted living home in Glendale, Arizona" plus the current words. Same look as today.
- **Area line.** "In Arrowhead Ranch, minutes from Peoria and Sun City" sits by the address. Check on a map that the home is inside Arrowhead Ranch before the words are used; if it is not, stop and ask Filip.
- **Cards.** All six cards keep their names and order. "Assisted Living" stays on the first card (Filip chose this after a before and after picture).
- **Licensed.** One warm mention that the home is licensed. Never the number (ADR 0003).
- **Cost and questions block.** One new block on the home page. It says what the monthly price covers, close to Filip's words ("Prices include the room & furnishings, meals, care, housekeeping and laundry, medication management", "Accept ALTCS too"), names private pay, and says "Call us for pricing". No amount is printed (ADR 0004). Questions: rooms (private and shared), couples (yes), pets (visits only), hospice (yes), how to move in (call and tour). Visiting hours and night staff are left out because Filip skipped them.
- **More words per care service.** The home page says a little more about each care service using only what the site already says, the glossary, and this spec. It is laid out as part of the page's own design, not as a wall of text on the green band (that mock looked weak). Directed Care and Memory Care are two different things (Filip's correction, 11/25/2026; `GLOSSARY.md` has each meaning). Each gets its own plain meaning in family-friendly words, with no training or doctor details.
- **Reviews.** Three real reviews copied word for word from the Google profile, first name only, shown as plain quotes with a "Read all on Google" link. The builder picks three and Filip sees them before they go in.
- **One page.** No new pages, so the sitemap does not change (ADR 0001).
- **Styles and scripts.** New styles go where the page's styles already live. No new inline scripts (the page's security policy blocks them).
- **Listings checklist.** A short doc for Filip, saved to his Desktop, not to this public repo. Each listing is looked up fresh when the checklist is written.
- **Branch and going live.** All work is committed on the work branch. `main` gets one merge and one push after Filip says yes.

## Testing Decisions

- A good test here reads the page the way a visitor or Google does and checks what is there, not how the HTML is arranged.
- **One seam: the home page as served.** A single check script reads the page and fails if a settled decision is broken: the business data parses and has the phone, no price range and no rating, review or FAQ types; the headline has the town and "assisted living home"; the area line, the call-for-pricing line and each agreed answer are present; no dollar amount anywhere in the page source; no Facebook link; nothing that looks like a state licence number; no em-dash in visible text; the six card names are unchanged; no visiting hours or night staff claim.
- Each ticket adds its own checks to that script first, sees them fail, then makes them pass.
- Looks are checked by eye: a before and after picture of the changed part at phone and desktop width, next to a reference, per the UI design checklist. Filip gets the pictures.
- No prior tests exist in this repo. The mock builder from the grill (a script that serves a copy of the site and takes pictures with Playwright) is the prior art for the pictures.

## Out of Scope

- New pages of any kind (per town, per care service).
- Review stars, rating or FAQ markup.
- The licence number, visiting hours, night staff claims.
- Renaming any card.
- An `llms.txt` file, the Claude SEO plugin and its audit.
- Fixing the other listings for Filip: he does that with the checklist.
- A new Facebook page.

## Further Notes

- The test seam and the ticket list below were **taken under Long-Run, Filip can overrule**.
- The repo is public and Pages publishes any markdown file not excluded in `_config.yml`. The check script's folder must be on that list too.
- Facts that came from a helper on 11/25/2026 and were not re-checked: the review count and texts, "in Arrowhead Ranch", the distances to Peoria and Sun City. Each is re-checked in the ticket that uses it.
- Draft copy in the grill mocks was never approved. Tickets write copy fresh from this spec.
