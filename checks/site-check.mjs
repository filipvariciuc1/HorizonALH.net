// Reads the home page the way a visitor or Google does and fails when a settled
// decision is broken. Plain Node, no installs.
//
//   node checks/site-check.mjs                              the index.html in this repo
//   node checks/site-check.mjs https://www.horizonalh.net/  the live page
//   node checks/site-check.mjs path/to/page.html            any saved copy
//
// The decisions come from .scratch/seo-gaps/spec.md and docs/adr/.

import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const PHONE = '+1-602-767-4110';
const CARD_NAMES = [
  'Assisted Living',
  'Independent Living',
  'Memory Care',
  'Respite Care',
  'Medication Management',
  'Visiting Professionals',
];
const HEADLINE_TOWN = 'Assisted living home in Glendale, Arizona';
const HEADLINE_OWN = 'A real home for your loved one';
const AREA_LINE = 'In Arrowhead Ranch, minutes from Peoria and Sun City';
const BANNED_TYPES = ['AggregateRating', 'Rating', 'Review', 'FAQPage', 'Question', 'Answer'];
const BANNED_KEYS = ['aggregateRating', 'review', 'reviews', 'sameAs'];
// The shape of an Arizona assisted living licence number. The number itself is never written here.
const LICENCE_SHAPE = /\bAL[\s-]?\d{4,6}[\s-]?H?\b/i;
const EM_DASH = /—|&mdash;|&#8212;|&#x2014;/i;

const target = process.argv[2] ?? fileURLToPath(new URL('../index.html', import.meta.url));
async function fetchPage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} answered ${res.status}`);
  return res.text();
}
const html = /^https?:\/\//.test(target) ? await fetchPage(target) : await readFile(target, 'utf8');

// ---- reading the page ----

function businessDataBlocks(page) {
  const blocks = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of page.matchAll(re)) blocks.push(m[1]);
  return blocks;
}

// Every object inside a parsed JSON-LD value, however deep.
function* nodes(value) {
  if (Array.isArray(value)) {
    for (const v of value) yield* nodes(v);
  } else if (value && typeof value === 'object') {
    yield value;
    for (const v of Object.values(value)) yield* nodes(v);
  }
}

function decode(text) {
  return text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#39;|&rsquo;/g, "'")
    .replace(/&quot;/g, '"');
}

// What a person can read: text on the page, plus the words in alt text, labels
// and the description lines that show up in search results and link previews.
function visibleText(page) {
  const body = page
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ');
  const attrs = [...body.matchAll(/\s(?:alt|title|aria-label|placeholder|content)="([^"]*)"/gi)].map((m) => m[1]);
  return [body.replace(/<[^>]+>/g, ' '), ...attrs].join(' ');
}

function headings(page, level) {
  const re = new RegExp(`<h${level}[^>]*>([\\s\\S]*?)</h${level}>`, 'gi');
  return [...page.matchAll(re)].map((m) => decode(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim());
}

// ---- the checks ----

const results = [];
function check(name, fn) {
  let problem;
  try {
    problem = fn();
  } catch (err) {
    problem = err.message;
  }
  results.push({ name, problem });
}

let parsed = [];
let parseProblem;
const blocks = businessDataBlocks(html);
try {
  parsed = blocks.map((b) => JSON.parse(b));
} catch (err) {
  parseProblem = err.message;
}
const business = [...nodes(parsed)].find((n) => n['@type'] === 'LocalBusiness');
const needBusiness = () => {
  if (parseProblem) throw new Error('business data did not parse');
  if (!business) throw new Error('no LocalBusiness entry found');
  return business;
};

check('business data parses as JSON', () => {
  if (blocks.length === 0) return 'no business data block on the page';
  return parseProblem;
});

check(`business data has the phone ${PHONE}`, () => {
  const phone = needBusiness().telephone;
  if (phone !== PHONE) return `telephone is ${JSON.stringify(phone)}`;
});

// Filip, 11/25/2026: no price on the site, shown or hidden (docs/adr/0004).
check('no price anywhere: no dollar amount in the page source and no priceRange in the business data', () => {
  const at = html.search(/\$\s?\d/);
  if (at !== -1) return `found a dollar amount near "${html.slice(Math.max(0, at - 30), at + 20).replace(/\s+/g, ' ').trim()}"`;
  needBusiness();
  for (const node of nodes(parsed)) if ('priceRange' in node) return 'the business data has a priceRange';
});

check('no rating, review, FAQ or social profile entries in the business data', () => {
  if (parseProblem) return 'business data did not parse';
  const found = new Set();
  for (const node of nodes(parsed)) {
    for (const type of [node['@type']].flat()) if (BANNED_TYPES.includes(type)) found.add(type);
    for (const key of BANNED_KEYS) if (key in node) found.add(key);
  }
  const inMarkup = html.match(/schema\.org\/(AggregateRating|Rating|Review|FAQPage|Question)/i);
  if (inMarkup) found.add(inMarkup[1]);
  if (found.size) return `found ${[...found].join(', ')}`;
});

check('nothing shaped like a state licence number anywhere on the page', () => {
  if (LICENCE_SHAPE.test(html)) return 'found text shaped like a licence number';
});

check('no em-dash in text a person can read', () => {
  const text = visibleText(html);
  const at = text.search(EM_DASH);
  if (at !== -1) return `near "${text.slice(Math.max(0, at - 40), at + 20).replace(/\s+/g, ' ').trim()}"`;
});

check('the six card names are unchanged and in order', () => {
  const h3 = headings(html, 3);
  const start = h3.indexOf(CARD_NAMES[0]);
  const run = start === -1 ? [] : h3.slice(start, start + CARD_NAMES.length);
  if (run.join('|') !== CARD_NAMES.join('|')) return `card headings are: ${h3.slice(0, 8).join(', ')}`;
});

check(`the one main headline says "${HEADLINE_TOWN}" plus its own words`, () => {
  const h1 = headings(html, 1);
  if (h1.length !== 1) return `the page has ${h1.length} main headlines`;
  for (const words of [HEADLINE_TOWN, HEADLINE_OWN]) {
    if (!h1[0].includes(words)) return `the main headline is "${h1[0]}"`;
  }
});

const readable = decode(visibleText(html)).replace(/\s+/g, ' ');

check(`the area line "${AREA_LINE}" is on the page`, () => {
  if (!readable.includes(AREA_LINE)) return 'the area line is not in text a person can read';
});

check('the page says the home is licensed', () => {
  if (!/\blicensed\b/i.test(readable)) return 'the word "licensed" is not in text a person can read';
});

check('no link to Facebook anywhere on the page', () => {
  if (/facebook\.com/i.test(html)) return 'found facebook.com in the page source';
});

// ---- the cost and questions block ----

// The words a person reads inside the cost and questions block, or '' when the block is not there.
function costBlockText(page) {
  const at = page.indexOf('id="cost"');
  if (at === -1) return '';
  const from = page.lastIndexOf('<', at);
  const to = page.indexOf('</section>', at);
  return decode(visibleText(page.slice(from, to === -1 ? undefined : to))).replace(/\s+/g, ' ');
}
const cost = costBlockText(html);
const needCost = () => {
  if (!cost) throw new Error('no block with id="cost" on the page');
  return cost;
};

// Each question in a block with the words that follow it, up to where the next question starts.
function questionsAndAnswers(block) {
  const marks = [...block.matchAll(/[^.?!]*\?/g)];
  return marks.map((m, i) => {
    const start = m.index + m[0].length;
    const end = i + 1 < marks.length ? marks[i + 1].index : block.length;
    return { question: m[0].trim(), answer: block.slice(start, end).trim() };
  });
}
function answered(about, good) {
  const asked = questionsAndAnswers(needCost()).filter(({ question }) => about.test(question));
  if (!asked.length) return 'no such question in the block';
  if (!asked.some(({ answer }) => good(answer))) return `the answer is "${asked[0].answer}"`;
}

check('the cost block says to call for the price', () => {
  const block = needCost();
  if (!/\bcall\b[^.?!]*\bpric(e|ing)\b/i.test(block)) return 'no "call ... price" or "call ... pricing" sentence in the block';
});

const COVERED = [
  ['the room', /\broom\b/i],
  ['furnishings', /\bfurnishings\b/i],
  ['meals', /\bmeals\b/i],
  ['care', /\bcare\b/i],
  ['housekeeping', /\bhousekeeping\b/i],
  ['laundry', /\blaundry\b/i],
  ['medication management', /\bmedication management\b/i],
];
check('the cost block names each thing the monthly price covers', () => {
  const block = needCost();
  const missing = COVERED.filter(([, re]) => !re.test(block)).map(([name]) => name);
  if (missing.length) return `missing: ${missing.join(', ')}`;
});

check('the cost block names ALTCS and private pay', () => {
  const block = needCost();
  if (!/\bALTCS\b/.test(block)) return '"ALTCS" is not in the block';
  if (!/\bprivate pay\b/i.test(block)) return '"private pay" is not in the block';
});

check('the cost block answers rooms: private and shared', () =>
  answered(/\brooms?\b/i, (a) => /\bprivate\b/i.test(a) && /\bshared\b/i.test(a)));

check('the cost block answers couples: yes', () => answered(/\bcouples?\b/i, (a) => /^yes\b/i.test(a)));

check('the cost block answers pets: visits are fine, none live at the home', () =>
  answered(/\bpets?\b/i, (a) => /\bvisit/i.test(a) && /\bno pets? lives?\b/i.test(a)));

check('the cost block answers hospice: yes', () => answered(/\bhospice\b/i, (a) => /^yes\b/i.test(a)));

check('the cost block answers how to start: call and tour', () =>
  answered(/\b(start|begin|move in|moving in)\b/i, (a) => /\bcall\b/i.test(a) && /\btour\b/i.test(a)));

// Filip skipped these two in the grill, so the page makes no claim about either.
check('no visiting hours anywhere on the page', () => {
  if (/\bvisiting hours\b/i.test(readable)) return 'found "visiting hours" in text a person can read';
});

check('no night staff claim anywhere on the page', () => {
  const found = readable.match(/\bnight[- ]?(?:staff|shift|nurse|caregiver)s?\b|\bovernight\b|\bawake\b/i);
  if (found) return `found "${found[0]}" in text a person can read`;
});

// ---- the care guide: a few more words per care service ----

// Directed Care and Memory Care are two different things, each a care service of its own (GLOSSARY.md).
const CARE_NAMES = ['Assisted Living', 'Directed Care', 'Memory Care', 'Respite Care', 'Independent Living'];
// The page had 726 words before the SEO work and 824 once the cost block was in.
const WORDS_AT_LEAST = 950;

// The care guide's sentences (not its headings), and where the guide sits on the page.
function careGuide(page) {
  const at = page.indexOf('id="care-fit"');
  if (at === -1) return null;
  const lastCard = page.indexOf(`${CARD_NAMES.at(-1)}</h3>`);
  const to = page.indexOf('</section>', at);
  const block = page.slice(page.lastIndexOf('<', at), to === -1 ? undefined : to);
  const entries = [...block.matchAll(/<dd[^>]*>([\s\S]*?)<\/dd>/gi)].map((m) =>
    decode(m[1].replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim());
  return { afterCards: lastCard !== -1 && at > lastCard, holdsCard: /class="card[\s"]/.test(block), entries };
}
const guide = careGuide(html);
const needGuide = () => {
  if (!guide) throw new Error('no block with id="care-fit" on the page');
  return guide;
};

check('care guide: each care service is named in running text outside its card', () => {
  const { afterCards, holdsCard, entries } = needGuide();
  if (!afterCards || holdsCard) return 'the care guide must come after the six cards and hold none of them';
  const missing = CARE_NAMES.filter((name) => !entries.some((e) => e.includes(name)));
  if (missing.length) return `not named in a sentence: ${missing.join(', ')}`;
});

check('care guide: Directed Care and Memory Care are two different things, each with its own meaning', () => {
  const entry = needGuide().entries.find((e) => e.includes('Directed Care') && e.includes('Memory Care'));
  if (!entry) return 'no one entry names both Directed Care and Memory Care';
  if (/\bcalls? it\b|\balso called\b|\btwo names\b|\bthe same\b/i.test(entry)) return `the entry says they are one thing: "${entry}"`;
  const cut = entry.indexOf('Memory Care');
  const directed = entry.slice(0, cut);
  const memory = entry.slice(cut);
  if (!/\bspeak up\b/i.test(directed) || !/\bdanger\b/i.test(directed)) return `Directed Care lacks its own meaning: "${directed}"`;
  if (/\bdementia\b|\bmemory loss\b/i.test(directed)) return `Directed Care is tied to memory loss: "${directed}"`;
  if (!/\bdementia\b/i.test(memory)) return `Memory Care lacks its own meaning: "${memory}"`;
});

check('care guide: Independent Living is not oversold, the page says it is rare', () => {
  const about = needGuide().entries.filter((e) => e.includes('Independent Living'));
  if (!about.length) return 'no entry names Independent Living';
  if (!about.some((e) => /\brare\b/i.test(e))) return `the entry is "${about[0]}"`;
});

check(`care guide: the page has clearly more words than before, at least ${WORDS_AT_LEAST}`, () => {
  const body = html.slice(Math.max(0, html.indexOf('<body')))
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-z#0-9]+;/gi, ' ');
  const words = body.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
  if (words < WORDS_AT_LEAST) return `the page has ${words} words`;
});

// ---- the reviews ----

// Three reviews from the home's Google profile, whole and word for word (read 11/25/2026).
// First names only. Filip saw the three before they went into the page.
const GOOGLE_PROFILE = 'cid=8962275276666028087';
const GOOGLE_REVIEWS = [
  { name: "Kim", text: "Choosing a place for my father’s care was one of the hardest decisions I have ever made. Filip and his staff helped us tremendously through this process.  Horizon has a beautiful warm environment with serene surroundings that my father came to love. The staff was incredible and treated my father like family. He felt close to the entire team and it made all the difference in the world through this challenging process." },
  { name: "Debbie", text: "I found the most WONDERFUL, CARING assisted living home owner's and staff for my husband, Harvey, who had Alzheimer's. Harvey and every resident was given personalized care everyday! They are professionals in every meaning of the word. You will not find a more caring, knowledgeable staff. Owner's Filip and Ana care from the heart for every resident! I was there everyday to see the amazing care from owner's to staff. The owner's bring in the finest activity director's for the residents and I was included too in the activities. They personally interact with each resident also. Harvey was a resident for a year and a half and l saw exceptional service to all the residents everyday! Horizon Assisted Living is a Triple A Plus home for your loved one that you can rest assured will get loving care! The owner's and staff are the most compassionate people you will ever meet! Bless them all. And I miss them!" },
  { name: "Jacqueline", text: "Horizon took wonderful care of our father and was a huge help to our family. Filip and the caregivers were exceptional. The house was well-kept, the food was delicious and communication was easy. We highly recommend Horizon!" },
];

// The reviews block as markup, or '' when the block is not there.
function reviewsBlock(page) {
  const at = page.indexOf('id="reviews"');
  if (at === -1) return '';
  const to = page.indexOf('</section>', at);
  return page.slice(page.lastIndexOf('<', at), to === -1 ? undefined : to);
}
const reviews = reviewsBlock(html);
const needReviews = () => {
  if (!reviews) throw new Error('no block with id="reviews" on the page');
  return reviews;
};
// Words only: no tags, one kind of apostrophe, single spaces.
const plainWords = (markup) =>
  decode(markup.replace(/<[^>]+>/g, ' ')).replace(/[‘’]/g, "'").replace(/\s+/g, ' ').trim();
const shownReviews = (block) =>
  [...block.matchAll(/<figure[^>]*>([\s\S]*?)<\/figure>/gi)].map((m) => ({
    quote: plainWords(m[1].match(/<blockquote[^>]*>([\s\S]*?)<\/blockquote>/i)?.[1] ?? ''),
    name: plainWords(m[1].match(/<figcaption[^>]*>([\s\S]*?)<\/figcaption>/i)?.[1] ?? ''),
  }));
const CUT_MARK = /\.\.\.|…/;

// A cut quote is whole sentences of the real review, in order, with "..." where some are left out.
function cutProblem(quote, whole) {
  let from = 0;
  for (const piece of quote.split(/\s*(?:\.\.\.|…)\s*/).filter(Boolean)) {
    const at = whole.indexOf(piece, from);
    if (at === -1) return `not in the Google review, word for word: "${piece.slice(0, 60)}"`;
    const startsSentence = at === 0 || /[.!?] $/.test(whole.slice(0, at));
    if (!startsSentence || !/[.!?]$/.test(piece)) return `cut in the middle of a sentence: "${piece.slice(0, 60)}"`;
    from = at + piece.length;
  }
}

check('reviews: three real quotes, word for word from Google', () => {
  const shown = shownReviews(needReviews());
  const quotes = (reviews.match(/<blockquote/gi) ?? []).length;
  if (shown.length !== 3 || quotes !== 3) return `the block has ${shown.length} reviews and ${quotes} quotes`;
  if (new Set(shown.map((s) => s.name)).size !== 3) return 'the same reviewer is shown twice';
  for (const { quote, name } of shown) {
    const real = GOOGLE_REVIEWS.find((r) => r.name === name);
    if (!real) return `no Google review on file for "${name}"`;
    const whole = plainWords(real.text);
    if (!CUT_MARK.test(quote)) {
      if (quote !== whole) return `${name}'s quote is not the whole review and shows no "..."`;
      continue;
    }
    const problem = cutProblem(quote, whole);
    if (problem) return `${name}: ${problem}`;
  }
});

check('reviews: first name only', () => {
  const shown = shownReviews(needReviews());
  if (!shown.length) return 'no name lines in the block';
  for (const { name } of shown) {
    if (!/^[A-Z][a-z]+$/.test(name)) return `a name line reads "${name}"`;
    if (!GOOGLE_REVIEWS.some((r) => r.name === name)) return `"${name}" is not one of the three reviewers`;
  }
});

check('reviews: a "Read all on Google" link to the home\'s Google profile', () => {
  const links = [...needReviews().matchAll(/<a\s[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/gi)];
  const toProfile = links.filter((m) => decode(m[1]).includes(GOOGLE_PROFILE));
  if (!toProfile.length) return 'no link to the Google profile in the block';
  if (!toProfile.some((m) => /read all on google/i.test(plainWords(m[2])))) return `the link reads "${plainWords(toProfile[0][2])}"`;
});

// ADR 0002: the quotes are plain text. A page with no reviews block passes.
check('reviews: plain quotes, no stars, no review markup and no script', () => {
  if (/[★☆⭐]|&#(?:9733|9734|11088);|&#x(?:2605|2606|2b50);|&starf?;/i.test(reviews)) return 'a star is drawn in the block';
  if (/aria-label="[^"]*star/i.test(reviews)) return 'a label in the block talks about stars';
  if (/\sitem(?:prop|scope|type)\b/i.test(reviews)) return 'review markup (itemprop, itemscope or itemtype) in the block';
  if (/<script/i.test(reviews)) return 'a script in the block';
});

// ---- report ----

for (const { name, problem } of results) {
  console.log(problem ? `FAIL  ${name}\n      ${problem}` : `PASS  ${name}`);
}
const failed = results.filter((r) => r.problem).length;
console.log(`\n${results.length - failed} of ${results.length} passed  (${target})`);
process.exit(failed ? 1 : 0);
