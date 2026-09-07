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
    '.cta-band .wrap > *'
  ];
  const revealEls = document.querySelectorAll(revealSelectors.join(','));
  revealEls.forEach((el) => el.classList.add('reveal'));

  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }
});
