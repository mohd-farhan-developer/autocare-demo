// AutoCare demo site. DEMO = true: buttons that would call, e-mail or open WhatsApp show a note instead,
// because the business and its numbers are fictional. Set DEMO = false for a real client.
const DEMO = true;

const toast = document.querySelector('.toast');
let toastTimer;
function notify(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toast.hidden = true; }, 5000);
}

if (DEMO) {
  const what = {
    call: 'On a real site this button calls the shop.',
    email: 'On a real site this opens an e-mail to the shop.',
    whatsapp: 'On a real site this opens a WhatsApp chat with the shop.',
    map: 'On a real site this opens the shop\'s location in Google Maps.',
  };
  document.querySelectorAll('[data-demo]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    notify('Demo website: ' + what[a.dataset.demo]);
  }));
}

// mobile menu
const menuBtn = document.querySelector('.menu-btn');
const nav = document.getElementById('site-nav');
menuBtn.addEventListener('click', () => {
  const open = menuBtn.getAttribute('aria-expanded') === 'true';
  menuBtn.setAttribute('aria-expanded', String(!open));
  nav.classList.toggle('open', !open);
});
nav.addEventListener('click', e => {
  if (e.target.closest('a')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); menuBtn.focus(); }
});

// open now? (shop hours in India time)
(function openNow() {
  const el = document.getElementById('open-now');
  const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const day = now.getDay(), mins = now.getHours() * 60 + now.getMinutes();
  const secondTuesday = day === 2 && now.getDate() >= 8 && now.getDate() <= 14;
  let open = false;
  if (!secondTuesday) {
    if (day >= 1 && day <= 6) open = mins >= 9 * 60 + 30 && mins < 20 * 60 + 30;
    else open = mins >= 10 * 60 && mins < 14 * 60;
  }
  el.innerHTML = open ? '<span class="open">Open now.</span> Walk in any time before closing.'
                      : '<span class="closed">Closed right now.</span> Send an enquiry and we\'ll reply when we open.';
})();

// enquiry form
const form = document.getElementById('enquiry');
const status = form.querySelector('.status');
// (form.name would be the form's own name attribute, so fields are read through form.elements)
const field = id => form.elements.namedItem(id);
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = field('name').value.trim(), phone = field('phone').value.trim();
  field('name').setAttribute('aria-invalid', String(!name));
  const phoneOk = /^[0-9 +]{10,15}$/.test(phone);
  field('phone').setAttribute('aria-invalid', String(!phoneOk));
  if (!name) { status.textContent = 'Please enter your name.'; field('name').focus(); return; }
  if (!phoneOk) { status.textContent = 'Please enter a valid 10-digit phone number.'; field('phone').focus(); return; }
  const msg = `Hi AutoCare, I'm ${name} (${phone}). Car: ${field('car').value.trim() || 'not given'}. I need: ${field('need').value}.`;
  if (DEMO) {
    status.textContent = `Thank you, ${name}! Demo website: on a real site your enquiry would be sent to the shop on WhatsApp.`;
  } else {
    window.open('https://wa.me/919876500001?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    status.textContent = 'Opening WhatsApp with your enquiry…';
  }
  form.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
