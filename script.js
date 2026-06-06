/* ============================================================
   Pay Comedy Club — landing page logic
   - smooth-scroll CTAs
   - sticky mobile CTA (visible after hero, hidden when form is shown)
   - FAQ accordion
   - 3-step lead form with validation + POST submission
   ============================================================ */

// --- CONFIG ---------------------------------------------------
// TODO: remplacer par l'endpoint réel de réception des leads (webhook, CRM, etc.)
window.PCC_FORM_ENDPOINT = window.PCC_FORM_ENDPOINT || 'https://example.com/api/leads';

(function () {
  'use strict';

  /* ---------- Smooth scroll for CTAs ---------- */
  document.querySelectorAll('.js-scroll').forEach(function (el) {
    el.addEventListener('click', function (e) {
      var target = document.querySelector(el.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* ---------- Sticky mobile CTA ---------- */
  var stickyCta = document.getElementById('stickyCta');
  var hero = document.getElementById('hero');
  var form = document.getElementById('formulaire');

  if (stickyCta && hero && form && 'IntersectionObserver' in window) {
    var heroVisible = true;
    var formVisible = false;

    function updateSticky() {
      // Show only when hero is out of view AND the form is not yet visible.
      var shouldShow = !heroVisible && !formVisible;
      stickyCta.hidden = !shouldShow;
    }

    new IntersectionObserver(function (entries) {
      heroVisible = entries[0].isIntersecting;
      updateSticky();
    }, { threshold: 0 }).observe(hero);

    new IntersectionObserver(function (entries) {
      formVisible = entries[0].isIntersecting;
      updateSticky();
    }, { threshold: 0.15 }).observe(form);
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq__q').forEach(function (btn) {
    var panel = btn.nextElementSibling;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      panel.style.maxHeight = open ? '0' : panel.scrollHeight + 'px';
    });
  });

  /* ---------- Multi-step form ---------- */
  var leadForm = document.getElementById('leadForm');
  if (!leadForm) return;

  var steps = Array.prototype.slice.call(leadForm.querySelectorAll('.step'));
  var progressFill = document.getElementById('progressFill');
  var progressLabel = document.getElementById('progressLabel');
  var current = 0;

  function showStep(i) {
    steps.forEach(function (s, idx) { s.classList.toggle('is-active', idx === i); });
    current = i;
    var pct = (i / steps.length) * 100;
    if (progressFill) progressFill.style.width = pct + '%';
    if (progressLabel) progressLabel.textContent = 'Étape ' + (i + 1) + ' / ' + steps.length;
    var firstField = steps[i].querySelector('input');
    if (firstField) firstField.focus({ preventScroll: true });
  }

  function showError(stepEl, message) {
    var err = stepEl.querySelector('.field-error');
    if (!err) return;
    if (message) {
      var msgSpan = err.querySelector('.field-error__msg');
      if (msgSpan) msgSpan.textContent = message;
    }
    err.hidden = false;
  }
  function clearError(stepEl) {
    var err = stepEl.querySelector('.field-error');
    if (err) err.hidden = true;
  }

  // French phone: accepts 0X........ or +33X........ with optional spaces/dots/dashes
  function isValidFrenchPhone(value) {
    var cleaned = value.replace(/[\s.\-]/g, '');
    return /^(?:(?:\+33|0033)[1-9]\d{8}|0[1-9]\d{8})$/.test(cleaned);
  }
  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  function validateStep(i) {
    var stepEl = steps[i];
    clearError(stepEl);

    if (i === 0) {
      if (!leadForm.querySelector('input[name="montant"]:checked')) {
        showError(stepEl); return false;
      }
      return true;
    }

    if (i === 1) {
      var hasExp = leadForm.querySelector('input[name="experience"]:checked');
      var hasObj = leadForm.querySelector('input[name="objectif"]:checked');
      if (!hasExp || !hasObj) { showError(stepEl); return false; }
      return true;
    }

    if (i === 2) {
      var prenom = leadForm.prenom;
      var nom = leadForm.nom;
      var email = leadForm.email;
      var tel = leadForm.telephone;
      var c1 = leadForm.consent_contact;
      var c2 = leadForm.consent_risque;
      var ok = true, msg = 'Remplis tous les champs et coche les deux cases.';

      [prenom, nom, email, tel].forEach(function (f) { f.classList.remove('is-invalid'); });

      if (!prenom.value.trim()) { prenom.classList.add('is-invalid'); ok = false; }
      if (!nom.value.trim()) { nom.classList.add('is-invalid'); ok = false; }
      if (!isValidEmail(email.value.trim())) {
        email.classList.add('is-invalid'); ok = false;
        if (email.value.trim()) msg = 'Vérifie le format de ton email.';
      }
      if (!isValidFrenchPhone(tel.value.trim())) {
        tel.classList.add('is-invalid'); ok = false;
        if (tel.value.trim()) msg = 'Numéro de téléphone français invalide (ex : 06 12 34 56 78).';
      }
      if (!c1.checked || !c2.checked) ok = false;

      if (!ok) { showError(stepEl, msg); return false; }
      return true;
    }
    return true;
  }

  leadForm.querySelectorAll('.js-next').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (validateStep(current)) showStep(current + 1);
    });
  });
  leadForm.querySelectorAll('.js-prev').forEach(function (btn) {
    btn.addEventListener('click', function () {
      clearError(steps[current]);
      showStep(current - 1);
    });
  });

  /* ---------- Submission ---------- */
  function collectData() {
    var fd = new FormData(leadForm);
    var data = {};
    fd.forEach(function (v, k) { data[k] = v; });
    data.consent_contact = leadForm.consent_contact.checked;
    data.consent_risque = leadForm.consent_risque.checked;
    data.submitted_at = new Date().toISOString();
    data.page = location.href;
    return data;
  }

  function showSuccess(data) {
    leadForm.hidden = true;
    document.querySelector('.progress').hidden = true;
    var screen = document.getElementById('successScreen');
    var msg = document.getElementById('successMsg');

    if (data.montant === 'Moins de 440€') {
      msg.textContent = 'Tu vas être ajouté à notre liste d\'attente prioritaire — on revient vers toi quand on ouvre des places pour les capitaux plus modestes.';
    } else {
      msg.textContent = 'On te recontacte sous 24h ouvrées.';
    }
    screen.hidden = false;
    screen.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validateStep(2)) return;

    var data = collectData();
    var submitBtn = leadForm.querySelector('.js-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi…';

    fetch(window.PCC_FORM_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        showSuccess(data);
      })
      .catch(function () {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Envoyer ma candidature';
        showError(steps[2], 'Une erreur est survenue, contacte-nous sur Telegram.');
      });
  });

  // init
  showStep(0);
})();
