document.addEventListener('DOMContentLoaded', () => {
  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });

  // Scroll reveal — sections and cards "draft in" as they enter view
  const revealSelectors = [
    '.section-head', '.feature-card', '.why-item', '.testi-card', '.value-card',
    '.story-block .stat-col', '.story-block > div:last-child',
    '.about-hero .wrap > div', '.hero-visual',
    '.plans-hero .wrap > *', '.video-section .wrap > *',
    '.cta-band .wrap > *', '.photo-band .glass-panel'
  ];
  const revealEls = Array.from(document.querySelectorAll(revealSelectors.join(',')));
  revealEls.forEach((el) => el.classList.add('reveal'));

  if (revealEls.length) {
    let pending = revealEls.slice();
    const checkReveal = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - 40 && rect.bottom > 0) {
          el.classList.add('is-visible');
          return false;
        }
        return true;
      });
      if (!pending.length) {
        window.removeEventListener('scroll', checkReveal);
        window.removeEventListener('resize', checkReveal);
      }
    };
    checkReveal();
    window.addEventListener('scroll', checkReveal, { passive: true });
    window.addEventListener('resize', checkReveal);
    // Safety net: if something never crosses the threshold (e.g. very short
    // page, unusual layout), reveal everything after a short delay anyway.
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 2500);
  }

  // Plan filter chips (Plans page)
  const filterRow = document.getElementById('planFilters');
  if (filterRow) {
    const chips = filterRow.querySelectorAll('.filter-chip');
    const cards = document.querySelectorAll('.feature-card[data-category]');
    const grids = document.querySelectorAll('.feature-grid');
    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chips.forEach((c) => c.classList.remove('active'));
        chip.classList.add('active');
        const filter = chip.getAttribute('data-filter');
        cards.forEach((card) => {
          const match = filter === 'all' || card.getAttribute('data-category') === filter;
          card.classList.toggle('is-hidden', !match);
        });
        grids.forEach((grid) => {
          const anyVisible = grid.querySelector('.feature-card:not(.is-hidden)');
          grid.style.display = anyVisible ? '' : 'none';
        });
      });
    });
  }

  // Liquid glass — cursor-reactive specular highlight
  document.querySelectorAll('.liquid-glass').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', x + '%');
      el.style.setProperty('--my', y + '%');
    });
  });

  // Card tilt-on-hover — subtle 3D tilt that tracks the cursor
  const tiltEls = document.querySelectorAll('.feature-card, .testi-card, .value-card');
  const isTouch = window.matchMedia ? window.matchMedia('(hover: none), (pointer: coarse)').matches : ('ontouchstart' in window);
  if (!isTouch) {
    tiltEls.forEach((el) => {
      el.style.transformStyle = 'preserve-3d';
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotateX = (-py * 6).toFixed(2);
        const rotateY = (px * 6).toFixed(2);
        el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  // Adaptive nav — glass intensifies once the page is scrolled
  const header = document.querySelector('.site-header');
  if (header) {
    const setHeaderState = () => {
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });
  }
});
