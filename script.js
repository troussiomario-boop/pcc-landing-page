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
// FAQ ACCORDION
// ============================================================

function setupFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach((item) => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    // Set initial max-height to 0
    content.style.maxHeight = '0px';

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other items
      faqItems.forEach((otherItem) => {
        if (otherItem !== item && otherItem.classList.contains('is-open')) {
          otherItem.classList.remove('is-open');
          const otherContent = otherItem.querySelector('.faq-content');
          if (otherContent) {
            otherContent.style.maxHeight = '0px';
          }
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('is-open');
        content.style.maxHeight = '0px';
      } else {
        item.classList.add('is-open');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
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
  setupCtaTracking();
  setupSmoothScroll();
  setupFaqAccordion();
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
