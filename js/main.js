// Header scroll
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// Mobile menu
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// Reveal on scroll
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

reveals.forEach(el => revealObserver.observe(el));

// Lightbox galeria
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');

document.querySelectorAll('.galeria-item').forEach(item => {
  item.addEventListener('click', () => {
    const img = item.querySelector('img');
    if (img && img.complete && img.naturalWidth > 0) {
      lightboxImg.src = img.src;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });
});

function closeLightbox() {
  lightbox.classList.remove('active');
  document.body.style.overflow = '';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeLightbox();
});

// Antes & Depois — slider comparativo
function initBeforeAfter(compare) {
  if (compare.dataset.baInit) return;
  compare.dataset.baInit = '1';

  const beforeWrap = compare.querySelector('.ba-before-wrap');
  const handle = compare.querySelector('.ba-handle');
  const beforeImg = compare.querySelector('.ba-before');
  if (!beforeWrap || !handle || !beforeImg) return;

  let dragging = false;

  function setPosition(x) {
    const rect = compare.getBoundingClientRect();
    if (rect.width <= 0) return;
    let pct = ((x - rect.left) / rect.width) * 100;
    pct = Math.max(5, Math.min(95, pct));
    beforeWrap.style.width = pct + '%';
    handle.style.left = pct + '%';
  }

  function syncBeforeWidth() {
    const w = compare.offsetWidth;
    if (w > 0) {
      beforeImg.style.width = w + 'px';
      beforeImg.style.maxWidth = 'none';
    }
  }

  const onLoad = () => syncBeforeWidth();
  compare.querySelectorAll('img').forEach((img) => {
    if (img.complete) onLoad();
    else img.addEventListener('load', onLoad);
  });

  syncBeforeWidth();
  new ResizeObserver(syncBeforeWidth).observe(compare);

  compare.addEventListener('mousedown', (e) => {
    dragging = true;
    setPosition(e.clientX);
    e.preventDefault();
  });
  compare.addEventListener('touchstart', (e) => {
    dragging = true;
    setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('mousemove', (e) => {
    if (dragging) setPosition(e.clientX);
  });
  window.addEventListener('touchmove', (e) => {
    if (dragging) setPosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('mouseup', () => { dragging = false; });
  window.addEventListener('touchend', () => { dragging = false; });
}

document.querySelectorAll('[data-ba]').forEach(initBeforeAfter);

const baRevealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      initBeforeAfter(entry.target);
      const beforeImg = entry.target.querySelector('.ba-before');
      const w = entry.target.offsetWidth;
      if (beforeImg && w > 0) beforeImg.style.width = w + 'px';
    }
  });
}, { threshold: 0.05 });
document.querySelectorAll('[data-ba]').forEach((el) => baRevealObserver.observe(el));

// Smooth active nav highlight
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 120;
  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-links a[href="#${id}"]`);
    if (link && scrollY >= top && scrollY < top + height) {
      document.querySelectorAll('.nav-links a').forEach(a => a.style.color = '');
      link.style.color = 'var(--pink-500)';
    }
  });
});
