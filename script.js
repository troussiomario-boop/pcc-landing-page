/* ============================================================
   PLAY COMEDY CLUB — LANDING PAGE SCRIPTS
   ============================================================ */

// Configuration centralisée
const TG_LINK = 'https://t.me/+GI6hoThpldJjZWI0';

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

function generateEventId() {
  return 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9);
}

// ============================================================
// SCARCITY COUNTER
// ============================================================

function setupScarcityCounter() {
  const counterEl = document.getElementById('scarcity-counter');
  if (!counterEl) return;

  let current = parseInt(counterEl.textContent) || 47;

  // Decrease counter every 15-30 seconds (simulating someone joining)
  setInterval(() => {
    if (current > 15) {
      current = Math.max(15, current - Math.floor(Math.random() * 3 + 1));
      counterEl.textContent = current;
      counterEl.style.animation = 'pulse 0.3s ease-out';
      setTimeout(() => {
        counterEl.style.animation = '';
      }, 300);
    }
  }, Math.random() * 15000 + 15000);

  // Decrease counter when CTA is clicked
  document.querySelectorAll('.cta-telegram').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (current > 15) {
        current = Math.max(15, current - 1);
        counterEl.textContent = current;
        counterEl.parentElement.style.animation = 'scarcity-pulse 0.5s ease-out';
        setTimeout(() => {
          counterEl.parentElement.style.animation = '';
        }, 500);
      }
    });
  });
}

// ============================================================
// META PIXEL — LEAD EVENT TRACKING
// ============================================================

function setupCtaTracking() {
  document.querySelectorAll('.cta-telegram').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const eventId = generateEventId();

      // Send Lead event to Meta Pixel
      if (typeof fbq !== 'undefined') {
        fbq('track', 'Lead', {
          content_category: 'telegram_click',
          content_name: 'pcc_telegram_join',
          value: 0,
          currency: 'EUR'
        }, { eventID: eventId });
      }

      // Petit delay pour s'assurer que l'event est envoyé avant la redirection
      setTimeout(() => {
        window.open(TG_LINK, '_blank', 'noopener,noreferrer');
      }, 150);

      e.preventDefault();
    });
  });
}

// ============================================================
// SMOOTH SCROLL FOR INTERNAL LINKS
// ============================================================

function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

// ============================================================
// MOBILE TESTIMONIALS CAROUSEL
// ============================================================

function setupTestimonialsCarousel() {
  const carousel = document.querySelector('.testimonials-carousel');

  if (!carousel) return;

  // Enable scroll-snap on mobile
  if (window.innerWidth < 768) {
    carousel.style.scrollSnapType = 'x mandatory';
    const cards = carousel.querySelectorAll('.testimonial-card');
    cards.forEach((card) => {
      card.style.scrollSnapAlign = 'center';
    });
  }
}

// ============================================================
// HERO CAROUSEL MOBILE FALLBACK
// ============================================================

function setupHeroCarouselMobile() {
  const carousel = document.querySelector('.hero__carousel');

  if (!carousel) return;

  if (window.innerWidth < 1024) {
    carousel.style.overflowX = 'auto';
    carousel.style.scrollSnapType = 'x mandatory';
    carousel.style.webkitOverflowScrolling = 'touch';

    const images = carousel.querySelectorAll('.hero__carousel-img');
    images.forEach((img) => {
      img.style.scrollSnapAlign = 'center';
      img.style.minWidth = '140px';
      img.style.flexShrink = 0;
    });
  }
}

// ============================================================
// LUCIDE ICONS FALLBACK
// ============================================================

function replaceLucideIcons() {
  // Lucide is loaded via CDN, but this ensures compatibility
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

// ============================================================
// IMAGE LAZY LOADING POLYFILL
// ============================================================

function setupLazyLoading() {
  const images = document.querySelectorAll('img[loading="lazy"]');

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src || img.src;
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    });

    images.forEach((img) => imageObserver.observe(img));
  }
}

// ============================================================
// INIT — RUN ALL SCRIPTS
// ============================================================

function init() {
  setupScarcityCounter();
  setupCtaTracking();
  setupSmoothScroll();
  setupTestimonialsCarousel();
  setupHeroCarouselMobile();
  replaceLucideIcons();
  setupLazyLoading();
}

// Wait for DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Re-init lucide icons after TikTok embed loads (in case DOM changed)
window.addEventListener('load', () => {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
});
