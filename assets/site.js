/* Shared behaviour for every page. Kept out of the HTML so the Content-Security-Policy
   can forbid inline script outright, with no hashes to keep in step with each edit. */

/* Google Fonts stylesheet: preloaded in <head>, switched on here so it never blocks the first paint. */
document.querySelectorAll('link[data-font-css]').forEach(l => { l.rel = 'stylesheet'; });

const rev = s => s.split('').reverse().join('');
const dialNum = '0114767' + '206' + '1+';
document.querySelectorAll('.tel-link').forEach(a => {
  a.addEventListener('click', e => { e.preventDefault(); location.href = 'tel:' + rev(dialNum); });
});
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* gallery: View more paging and the lightbox */
const grid = document.getElementById('gallery-grid');
if (grid) {
  const box = document.getElementById('lightbox');
  const boxImg = box.querySelector('.lb-figure img');
  const tiles = Array.from(grid.querySelectorAll('button'));
  const moreWrap = document.getElementById('gallery-more');
  const moreBtn = document.getElementById('gallery-more-btn');
  const STEP = 12;
  let shown = tiles.filter(t => !t.hidden).length;

  const syncMore = () => {
    if (shown >= tiles.length) moreWrap.hidden = true;
  };
  const revealMore = () => {
    const next = tiles.slice(shown, shown + STEP);
    next.forEach((tile, i) => {
      tile.hidden = false;
      tile.style.setProperty('--d', i);
      tile.classList.add('tile-in');
      tile.addEventListener('animationend', () => tile.classList.remove('tile-in'), { once: true });
    });
    shown += next.length;
    syncMore();
  };
  syncMore();
  moreBtn.addEventListener('click', revealMore);

  tiles.forEach(btn => {
    btn.addEventListener('click', () => {
      boxImg.src = btn.dataset.full;
      boxImg.alt = btn.querySelector('img').alt;
      box.showModal();
    });
  });
  box.addEventListener('click', e => { if (e.target !== boxImg) box.close(); });
  box.addEventListener('close', () => { boxImg.removeAttribute('src'); boxImg.alt = ''; });
}

/* contact form: sent with fetch so the visitor stays on the page. Without JavaScript the
   form's own action posts to the same FormSubmit inbox instead. */
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const f = e.target;
    const sendBtn = f.querySelector('button[type="submit"]');
    const note = f.querySelector('.form-note');
    const fullName = (f.first.value + ' ' + f.last.value).trim();
    sendBtn.disabled = true;
    const restLabel = sendBtn.textContent;
    sendBtn.textContent = 'Sending...';
    try {
      const res = await fetch('https://formsubmit.co/ajax/info@horizonalh.net', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          name: fullName,
          email: f.email.value,
          phone: f.phone.value,
          sms_consent: f.sms_consent.checked
            ? 'YES, opted in to SMS at ' + new Date().toISOString()
            : 'No SMS consent given',
          message: f.message.value,
          _subject: 'Website inquiry from ' + fullName,
          _template: 'table',
          _captcha: 'false',
          _honey: f._honey.value
        })
      });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      // FormSubmit can answer 200 and still not send (an unactivated or blocked form): it says so in the body.
      const data = await res.json().catch(() => ({}));
      if (data.success === false || data.success === 'false') throw new Error(data.message || 'not sent');
      f.reset();
      note.textContent = 'Thank you! Your message has been sent.';
    } catch (err) {
      note.textContent = 'The message could not be sent. Please email us directly at info@horizonalh.net.';
    }
    sendBtn.disabled = false;
    sendBtn.textContent = restLabel;
  });
}

/* section rail: scroll progress + active section */
const navAnchors = Array.from(document.querySelectorAll('.rail a'));
if (navAnchors.length) {
  const progress = document.getElementById('scroll-progress');
  const spyTargets = navAnchors
    .map(a => ({ link: a, el: document.querySelector(a.getAttribute('href')) }))
    .filter(t => t.el);
  let spyQueued = false;

  const syncNav = () => {
    spyQueued = false;
    const y = window.scrollY;
    let current = null;
    for (const t of spyTargets) {
      if (t.el.getBoundingClientRect().top <= 140) current = t;
    }
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 8) {
      current = spyTargets[spyTargets.length - 1];
    }
    navAnchors.forEach(a => {
      const on = current && a === current.link;
      a.classList.toggle('active', !!on);
      if (on) { a.setAttribute('aria-current', 'true'); } else { a.removeAttribute('aria-current'); }
    });

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = 'scaleY(' + (max > 0 ? Math.min(y / max, 1) : 0) + ')';
    }
  };
  const queueNavSync = () => {
    if (!spyQueued) { spyQueued = true; requestAnimationFrame(syncNav); }
  };
  window.addEventListener('scroll', queueNavSync, { passive: true });
  window.addEventListener('resize', queueNavSync, { passive: true });
  syncNav();
}
