document.addEventListener('DOMContentLoaded', () => {
  // Side menu — hamburger opens a drawer with all page links (mobile + desktop)
  const sideMenuOverlay = document.getElementById('sideMenuOverlay');
  const navToggleBtn = document.querySelector('.nav-toggle');
  if (sideMenuOverlay && navToggleBtn && !sideMenuOverlay.dataset.bound) {
    sideMenuOverlay.dataset.bound = 'true';
    const sideMenuClose = document.getElementById('sideMenuClose');
    const openSideMenu = () => {
      sideMenuOverlay.classList.add('open');
      sideMenuOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('menu-open');
    };
    const closeSideMenu = () => {
      sideMenuOverlay.classList.remove('open');
      sideMenuOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
    };
    navToggleBtn.addEventListener('click', openSideMenu);
    if (sideMenuClose) sideMenuClose.addEventListener('click', closeSideMenu);
    sideMenuOverlay.addEventListener('click', (e) => {
      if (e.target === sideMenuOverlay) closeSideMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && sideMenuOverlay.classList.contains('open')) closeSideMenu();
    });
  }

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
    const toggle = () => {
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => {
        i.classList.remove('open');
        const iq = i.querySelector('.faq-q');
        if (iq) iq.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        q.setAttribute('aria-expanded', 'true');
      }
    };
    q.addEventListener('click', toggle);
    q.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        toggle();
      }
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

  // Plan detail modal — click a plan card to open a big box with
  // its picture, full description, and details. Only cards that
  // carry a data-modal-image attribute participate.
  const planCards = document.querySelectorAll('.feature-card[data-modal-image]');
  const modalOverlay = document.getElementById('planModalOverlay');
  if (planCards.length && modalOverlay) {
    const modalImage = document.getElementById('planModalImage');
    const modalTag = document.getElementById('planModalTag');
    const modalTitle = document.getElementById('planModalTitle');
    const modalDesc = document.getElementById('planModalDesc');
    const modalFeatures = document.getElementById('planModalFeatures');
    const modalPrice = document.getElementById('planModalPrice');
    const modalLink = document.getElementById('planModalLink');
    const modalClose = document.getElementById('planModalClose');
    let lastFocused = null;

    const openModal = (card) => {
      const title = card.querySelector('h3');
      const desc = card.querySelector('p');
      const tag = card.querySelector('.tag');
      const features = card.querySelector('.feature-list');
      const price = card.querySelector('.price');
      const link = card.querySelector('.feature-card-foot a');
      const image = card.getAttribute('data-modal-image');

      modalImage.src = image;
      modalImage.alt = title ? title.textContent : '';
      modalTitle.textContent = title ? title.textContent : '';
      modalDesc.textContent = desc ? desc.textContent : '';
      modalFeatures.innerHTML = features ? features.innerHTML : '';
      modalPrice.innerHTML = price ? price.innerHTML : '';
      if (tag) {
        modalTag.textContent = tag.textContent;
        modalTag.className = tag.className;
        modalTag.hidden = false;
      } else {
        modalTag.hidden = true;
      }
      if (link) modalLink.href = link.href;

      lastFocused = document.activeElement;
      modalOverlay.classList.add('open');
      modalOverlay.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      modalClose.focus();
    };

    const closeModal = () => {
      modalOverlay.classList.remove('open');
      modalOverlay.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    };

    planCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return; // let the WhatsApp link work as normal
        openModal(card);
      });
      card.addEventListener('keydown', (e) => {
        if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') && e.target === card) {
          e.preventDefault();
          openModal(card);
        }
      });
    });

    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
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
  const prefersReducedMotion = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
  if (!isTouch && !prefersReducedMotion) {
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
