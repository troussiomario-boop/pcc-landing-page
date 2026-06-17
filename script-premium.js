/* ============================================================================
   PCC LANDING PAGE — PREMIUM JS ENHANCEMENTS
   À inclure APRÈS script.js dans index.html
   ============================================================================ */

(function () {
  'use strict';

  // Respect user's reduced-motion preference
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // =====================================================================
  // 1. SCROLL FADE-IN FOR SECTIONS
  // =====================================================================
  function initScrollAnimations() {
    if (prefersReducedMotion) {
      document.querySelectorAll('section').forEach((s) => s.classList.add('visible'));
      return;
    }

    const sections = document.querySelectorAll('section');
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -80px 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  // =====================================================================
  // 2. COUNTER ANIMATION FOR STATS
  // =====================================================================
  function animateCounter(el, targetNum, duration, suffix, prefix) {
    if (prefersReducedMotion) {
      el.textContent = (prefix || '') + targetNum.toLocaleString('fr-FR') + (suffix || '');
      return;
    }

    const start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (targetNum - start) * easeOut);

      el.textContent =
        (prefix || '') + current.toLocaleString('fr-FR') + (suffix || '');

      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  function initStatCounters() {
    const statSelectors = [
      '.stat-number',
      '.big-number',
      '[class*="stat-card"] strong',
      '[class*="stat"] [class*="number"]',
      '[data-counter]',
    ];

    const stats = document.querySelectorAll(statSelectors.join(', '));
    if (!stats.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.animated) {
            const el = entry.target;
            const originalText = el.textContent.trim();

            // Skip pure text values like "5j / 7", "10 min", "0€"
            const numMatch = originalText.match(/(\d[\d\s,]*)/);
            if (!numMatch) return;

            const numStr = numMatch[1].replace(/\s/g, '');
            const targetNum = parseInt(numStr, 10);

            // Only animate counters above 50 (smaller numbers don't need counter)
            if (isNaN(targetNum) || targetNum < 50) return;

            const idx = originalText.indexOf(numMatch[1]);
            const prefix = originalText.substring(0, idx);
            const suffix = originalText.substring(idx + numMatch[1].length);

            el.dataset.animated = 'true';
            animateCounter(el, targetNum, 1800, suffix, prefix);
          }
        });
      },
      { threshold: 0.4 }
    );

    stats.forEach((stat) => observer.observe(stat));
  }

  // =====================================================================
  // 3. PARTICLES IN HERO
  // =====================================================================
  function initParticles() {
    if (prefersReducedMotion) return;

    // Pick the hero section (try multiple patterns)
    const hero =
      document.querySelector('.hero') ||
      document.querySelector('[class*="hero"]') ||
      document.querySelector('section:first-of-type') ||
      document.querySelector('main > section:first-child');

    if (!hero) return;

    // Avoid duplicate particles if script runs twice
    if (hero.querySelector('.particles-container')) return;

    hero.style.position = hero.style.position || 'relative';

    const container = document.createElement('div');
    container.className = 'particles-container';
    hero.appendChild(container);

    const NUM_PARTICLES = window.innerWidth < 768 ? 10 : 18;

    for (let i = 0; i < NUM_PARTICLES; i++) {
      const particle = document.createElement('div');
      let className = 'particle';
      if (i % 3 === 0) className += ' cyan';
      if (i % 5 === 0) className += ' large';
      particle.className = className;

      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 18 + 's';
      particle.style.animationDuration = 16 + Math.random() * 10 + 's';
      particle.style.opacity = String(0.3 + Math.random() * 0.4);

      container.appendChild(particle);
    }
  }

  // =====================================================================
  // 4. AI ACTIVE BADGE OVERLAY ON HERO VIDEO
  // =====================================================================
  function initAiBadge() {
    // Try to find the hero video
    const heroVideo =
      document.querySelector('.hero video') ||
      document.querySelector('[class*="hero"] video') ||
      document.querySelector('section:first-of-type video');

    if (!heroVideo) return;

    // Find the video's container (prefer immediate parent)
    const container = heroVideo.parentElement;
    if (!container || container.querySelector('.ai-badge')) return;

    container.style.position = container.style.position || 'relative';

    const badge = document.createElement('div');
    badge.className = 'ai-badge';
    badge.innerHTML = '🤖 IA Active';
    container.appendChild(badge);
  }

  // =====================================================================
  // 5. CTA CLICK RIPPLE EFFECT
  // =====================================================================
  function initRipples() {
    if (prefersReducedMotion) return;

    document.addEventListener('click', function (e) {
      const target = e.target.closest('[class*="cta"], a[href*="t.me"]');
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: rgba(255, 255, 255, 0.6);
        border-radius: 50%;
        transform: scale(0);
        opacity: 1;
        animation: ripple-effect 0.6s ease-out;
        pointer-events: none;
      `;

      target.style.position = target.style.position || 'relative';
      target.style.overflow = 'hidden';
      target.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });

    // Inject ripple keyframe if not already present
    if (!document.querySelector('#ripple-style')) {
      const style = document.createElement('style');
      style.id = 'ripple-style';
      style.textContent = `
        @keyframes ripple-effect {
          to { transform: scale(2.5); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  // =====================================================================
  // INIT EVERYTHING WHEN DOM IS READY
  // =====================================================================
  function init() {
    initScrollAnimations();
    initStatCounters();
    initParticles();
    initAiBadge();
    initRipples();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
