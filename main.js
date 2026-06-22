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
   { prompt: '$', cmd: 'cat rol.txt', output: 'Ingeniero TI · Analista QA Senior · · Analista TI Senior' },
   { prompt: '$', cmd: 'ls experience/', output: 'S3Chile (Banchile corredor de seguros)/  QualityFactory (Ecomsur, Aguas andinas, SII)/  DuocUC/  Datactiva (Aduanas)/' },
   { prompt: '$', cmd: 'cat skills.json | grep top', output: '"QA", "FrontEnd", "BackEnd", "PL-SQL", "T-SQL", "Power BI", "ETL", "Selenium", "Scrum"' },
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
const instagramEmbedContainer = document.getElementById('instagramEmbedContainer');

let lastFocusedMediaCard = null;

function openMediaModal(src, title, type) {
  mediaModalTitle.textContent = title;
  mediaModal.classList.add('is-open');
  mediaModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  mediaModalClose.focus();

  if (type === 'instagram') {
    mediaModalFrame.style.display = 'none';
    mediaModalFrame.src = '';
    instagramEmbedContainer.style.display = 'block';
    instagramEmbedContainer.innerHTML = '';

    // Construye el blockquote oficial que pide Instagram para su embed
    const blockquote = document.createElement('blockquote');
    blockquote.className = 'instagram-media';
    blockquote.setAttribute('data-instgrm-permalink', src);
    blockquote.setAttribute('data-instgrm-version', '14');
    blockquote.style.margin = '0 auto';
    blockquote.style.maxWidth = '540px';
    blockquote.style.width = '100%';
    instagramEmbedContainer.appendChild(blockquote);

    // Espera a que el navegador pinte el contenedor visible antes de procesar
    requestAnimationFrame(() => {
      requestAnimationFrame(() => processInstagramEmbed(src));
    });
  } else {
    instagramEmbedContainer.style.display = 'none';
    instagramEmbedContainer.innerHTML = '';
    mediaModalFrame.style.display = 'block';
    mediaModalFrame.src = src;
  }
}

function processInstagramEmbed(permalink) {
  // Elimina cualquier instancia previa del script para forzar una carga limpia.
  // El script de Instagram acumula estado interno entre usos y falla en embeds
  // dinámicos repetidos si no se recarga desde cero.
  const oldScript = document.getElementById('instagramEmbedScript');
  if (oldScript) oldScript.remove();
  delete window.instgrm;

  const script = document.createElement('script');
  script.id = 'instagramEmbedScript';
  script.async = true;
  script.src = 'https://www.instagram.com/embed.js';
  script.onload = () => {
    if (window.instgrm && window.instgrm.Embeds) {
      window.instgrm.Embeds.process();
    } else {
      showInstagramFallback(permalink);
    }
  };
  script.onerror = () => showInstagramFallback(permalink);
  document.body.appendChild(script);

  // Si tras 4 segundos no se renderizó nada (el blockquote sigue como blockquote), muestra el respaldo
  setTimeout(() => {
    const stillRaw = instagramEmbedContainer.querySelector('blockquote.instagram-media');
    if (stillRaw) showInstagramFallback(permalink);
  }, 4000);
}

function showInstagramFallback(permalink) {
  instagramEmbedContainer.innerHTML = `
    <p style="text-align:center; padding:2rem; font-family:inherit; color:#444;">
      No se pudo cargar la vista previa.
      <a href="${permalink}" target="_blank" rel="noopener" style="color:#e1306c; font-weight:600;">
        Ver publicación en Instagram
      </a>
    </p>`;
}

function closeMediaModal() {
  mediaModal.classList.remove('is-open');
  mediaModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  mediaModalFrame.src = ''; // detiene la reproducción al cerrar
  instagramEmbedContainer.innerHTML = '';
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
    // type === 'video', 'doc' o 'instagram': abre modal
    lastFocusedMediaCard = card;
    openMediaModal(src, title, type);
  });
});

if (mediaModalClose) mediaModalClose.addEventListener('click', closeMediaModal);
if (mediaModalBackdrop) mediaModalBackdrop.addEventListener('click', closeMediaModal);

document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && mediaModal.classList.contains('is-open')) {
    closeMediaModal();
  }
});

// ── MINI MUSIC PLAYER ──
const bgAudio     = document.getElementById('bgAudio');
const musicToggle = document.getElementById('musicToggle');

if (bgAudio && musicToggle) {
  const iconPlay  = musicToggle.querySelector('.icon-play');
  const iconPause = musicToggle.querySelector('.icon-pause');

  musicToggle.addEventListener('click', () => {
    if (bgAudio.paused) {
      bgAudio.play().catch(() => {
        // Si el navegador bloquea la reproducción, no rompe nada
      });
    } else {
      bgAudio.pause();
    }
  });

  bgAudio.addEventListener('play', () => {
    musicToggle.setAttribute('aria-pressed', 'true');
    musicToggle.setAttribute('aria-label', 'Pausar música');
    iconPlay.style.display = 'none';
    iconPause.style.display = 'block';
  });

  bgAudio.addEventListener('pause', () => {
    musicToggle.setAttribute('aria-pressed', 'false');
    musicToggle.setAttribute('aria-label', 'Reproducir música');
    iconPlay.style.display = 'block';
    iconPause.style.display = 'none';
  });

  // Si se abre un modal con video, pausa la música de fondo para no encimar audios
  [mediaModal, certModal].forEach(modal => {
    if (!modal) return;
    const obs = new MutationObserver(() => {
      if (modal.classList.contains('is-open') && !bgAudio.paused) {
        bgAudio.pause();
      }
    });
    obs.observe(modal, { attributes: true, attributeFilter: ['class'] });
  });
}
