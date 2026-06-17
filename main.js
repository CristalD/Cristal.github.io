// ============================================
// CRISTAL CAMPINO PORTFOLIO — main.js
// ============================================

// ── NAV TOGGLE ──
const navToggle = document.getElementById('navToggle');
const navLinks  = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// ── TERMINAL TYPING ANIMATION ──
const terminalLines = [
  { prompt: '$', cmd: 'whoami', output: 'Cristal Campino Saavedra' },
  { prompt: '$', cmd: 'cat rol.txt', output: 'Ingeniero TI · Analista QA Senior · BI Developer' },
  { prompt: '$', cmd: 'ls experience/', output: 'S3Chile/  QualityFactory/  DuocUC/  SII/  Aduanas/' },
  { prompt: '$', cmd: 'cat skills.json | grep top', output: '"QA", "Power BI", "ETL", "Selenium", "Scrum"' },
  { prompt: '$', cmd: 'cat awards.txt', output: '⭐ FemIT — Más Mujeres en las TICs' },
  { prompt: '$', cmd: '', output: '' },
];

const terminalBody = document.getElementById('terminalBody');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeText(el, text, speed = 45) {
  for (const ch of text) {
    el.textContent += ch;
    await sleep(speed);
  }
}

async function runTerminal() {
  if (!terminalBody) return;

  for (const line of terminalLines) {
    // Prompt + command
    const cmdLine = document.createElement('p');
    cmdLine.innerHTML = `<span class="t-prompt">${line.prompt}</span> `;
    const cmdSpan = document.createElement('span');
    cmdSpan.className = 't-cmd';
    cmdLine.appendChild(cmdSpan);
    terminalBody.appendChild(cmdLine);

    await typeText(cmdSpan, line.cmd, 55);
    await sleep(180);

    if (line.output) {
      const outLine = document.createElement('p');
      outLine.className = 't-output';
      terminalBody.appendChild(outLine);
      await typeText(outLine, line.output, 18);
      await sleep(120);
    }
  }

  // Blinking cursor at end
  const cursor = document.createElement('span');
  cursor.className = 't-cursor';
  cursor.textContent = '█';
  terminalBody.appendChild(cursor);
}

runTerminal();

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.skill-card, .timeline__card, .edu__card, .contact-card, .carousel__card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(18px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  observer.observe(el);
});

// ── ACTIVE NAV LINK ON SCROLL ──
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav__links a');

const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      links.forEach(l => l.style.color = '');
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent-light)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));

// ── CERTIFICATE MODAL ──
const certModal        = document.getElementById('certModal');
const certModalImg     = document.getElementById('certModalImg');
const certModalTitle   = document.getElementById('certModalTitle');
const certModalClose   = document.getElementById('certModalClose');
const certModalBackdrop = document.getElementById('certModalBackdrop');
const eduCards         = document.querySelectorAll('.edu__card');

let lastFocusedCard = null;

function openCertModal(src, title) {
  certModalImg.src = src;
  certModalImg.alt = `Certificado: ${title}`;
  certModalTitle.textContent = title;
  certModal.classList.add('is-open');
  certModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  certModalClose.focus();
}

function closeCertModal() {
  certModal.classList.remove('is-open');
  certModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  certModalImg.src = '';
  if (lastFocusedCard) lastFocusedCard.focus();
}

eduCards.forEach(card => {
  card.addEventListener('click', () => {
    lastFocusedCard = card;
    const src = card.getAttribute('data-cert');
    const title = card.getAttribute('data-title');
    openCertModal(src, title);
  });
});

if (certModalClose) certModalClose.addEventListener('click', closeCertModal);
if (certModalBackdrop) certModalBackdrop.addEventListener('click', closeCertModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && certModal.classList.contains('is-open')) {
    closeCertModal();
  }
});

// ── CAROUSELS (Proyectos / Destacados) ──
document.querySelectorAll('.carousel').forEach(carousel => {
  const key   = carousel.getAttribute('data-carousel');
  const track = carousel.querySelector('.carousel__track');
  const prevBtn = carousel.querySelector(`[data-carousel-prev="${key}"]`);
  const nextBtn = carousel.querySelector(`[data-carousel-next="${key}"]`);
  if (!track) return;

  function cardStep() {
    const card = track.querySelector('.carousel__card');
    if (!card) return 300;
    const gap = parseFloat(getComputedStyle(track).gap) || 20;
    return card.getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    if (!prevBtn || !nextBtn) return;
    const maxScroll = track.scrollWidth - track.clientWidth - 4;
    prevBtn.disabled = track.scrollLeft <= 4;
    nextBtn.disabled = track.scrollLeft >= maxScroll;
  }

  if (prevBtn) prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -cardStep(), behavior: 'smooth' });
  });
  if (nextBtn) nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: cardStep(), behavior: 'smooth' });
  });

  track.addEventListener('scroll', updateArrows);
  window.addEventListener('resize', updateArrows);
  updateArrows();
});

// ── MEDIA MODAL (videos/documentos embebidos en Proyectos y Destacados) ──
const mediaModal        = document.getElementById('mediaModal');
const mediaModalFrame   = document.getElementById('mediaModalFrame');
const mediaModalTitle   = document.getElementById('mediaModalTitle');
const mediaModalClose   = document.getElementById('mediaModalClose');
const mediaModalBackdrop = document.getElementById('mediaModalBackdrop');

let lastFocusedMediaCard = null;

function openMediaModal(src, title) {
  mediaModalFrame.src = src;
  mediaModalTitle.textContent = title;
  mediaModal.classList.add('is-open');
  mediaModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  mediaModalClose.focus();
}

function closeMediaModal() {
  mediaModal.classList.remove('is-open');
  mediaModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  mediaModalFrame.src = ''; // detiene la reproducción al cerrar
  if (lastFocusedMediaCard) lastFocusedMediaCard.focus();
}

document.querySelectorAll('.carousel__card[data-media-type]').forEach(card => {
  card.addEventListener('click', () => {
    const type  = card.getAttribute('data-media-type');
    const src   = card.getAttribute('data-media-src');
    const title = card.getAttribute('data-title');

    if (type === 'link') {
      // Repositorio de GitHub: abre en pestaña nueva, sin modal
      window.open(src, '_blank', 'noopener');
      return;
    }
    // type === 'video' o 'doc': abre modal con iframe embebido
    lastFocusedMediaCard = card;
    openMediaModal(src, title);
  });
});

if (mediaModalClose) mediaModalClose.addEventListener('click', closeMediaModal);
if (mediaModalBackdrop) mediaModalBackdrop.addEventListener('click', closeMediaModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mediaModal.classList.contains('is-open')) {
    closeMediaModal();
  }
});
