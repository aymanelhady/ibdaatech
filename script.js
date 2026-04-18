/* =======================================================
   IBDAA TECH — script.js v3
   Features: Preloader · Navbar · Hamburger · Smooth Scroll ·
   Active Nav · Language Toggle · Scroll Reveal · Swiper ·
   EmailJS Contact Form with Bilingual Validation
   =======================================================

   ── EmailJS Setup ──────────────────────────────────────
   1. Go to https://www.emailjs.com  → create a FREE account
   2. Add a new Email Service  (Gmail → connect ipdateck@gmail.com)
      → copy the  Service ID  → paste in EMAILJS_SERVICE_ID below
   3. Create an Email Template with these template variables:
        {{from_name}}   {{from_email}}   {{from_phone}}
        {{service_type}}   {{message}}   {{to_email}}
      Set "To Email" in the template to:  ipdateck@gmail.com
      → copy the  Template ID  → paste in EMAILJS_TEMPLATE_ID below
   4. Go to Account → API Keys → copy the  Public Key
      → paste in EMAILJS_PUBLIC_KEY below
   ─────────────────────────────────────────────────────── */

(function () {
  'use strict';

  /* ── CONFIG — fill these three values ─────────────── */
  var EMAILJS_PUBLIC_KEY   = 'YOUR_PUBLIC_KEY';      // e.g. 'abc123XYZ'
  var EMAILJS_SERVICE_ID   = 'YOUR_SERVICE_ID';      // e.g. 'service_ibdaa'
  var EMAILJS_TEMPLATE_ID  = 'YOUR_TEMPLATE_ID';     // e.g. 'template_contact'
  var TO_EMAIL             = 'ipdateck@gmail.com';   // recipient (also set in template)
  /* ─────────────────────────────────────────────────── */

  /* ── Bilingual validation messages ─────────────────── */
  var VALIDATION = {
    ar: {
      required:     'هذا الحقل مطلوب',
      emailInvalid: 'صيغة البريد الإلكتروني غير صحيحة',
      phoneInvalid: 'رقم الهاتف يجب أن يكون أرقامًا فقط (7-15 رقمًا)',
      minLength:    'الرسالة قصيرة جدًا (10 أحرف على الأقل)',
      sending:      'جارٍ الإرسال...',
      send:         'إرسال الرسالة'
    },
    en: {
      required:     'This field is required',
      emailInvalid: 'Please enter a valid email address',
      phoneInvalid: 'Phone must be numbers only (7–15 digits)',
      minLength:    'Message is too short (at least 10 characters)',
      sending:      'Sending...',
      send:         'Send Message'
    }
  };

  /* ── Helpers ─────────────────────────────────────── */
  function getLang() {
    return document.documentElement.getAttribute('data-lang') || 'ar';
  }
  function t(key) {
    return VALIDATION[getLang()][key] || VALIDATION.ar[key];
  }
  function $(id) { return document.getElementById(id); }

  /* ====================================================
     1. PRELOADER
  ==================================================== */
  function initPreloader() {
    var preloader = $('preloader');
    if (!preloader) return;
    var minMs   = 2400;
    var t0      = Date.now();

    function hide() {
      var wait = Math.max(0, minMs - (Date.now() - t0));
      setTimeout(function () {
        preloader.classList.add('hidden');
        setTimeout(function () {
          if (preloader.parentNode) preloader.parentNode.removeChild(preloader);
        }, 700);
      }, wait);
    }

    if (document.readyState === 'complete') { hide(); }
    else { window.addEventListener('load', hide); }
  }

  /* ====================================================
     2. NAVBAR SCROLL EFFECT
  ==================================================== */
  function initNavbar() {
    var navbar = $('navbar');
    if (!navbar) return;
    function check() {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ====================================================
     3. HAMBURGER MENU
  ==================================================== */
  function initHamburger() {
    var btn  = $('hamburger');
    var menu = $('navLinks');
    var navbar = $('navbar');
    if (!btn || !menu) return;

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      btn.classList.toggle('active');
      menu.classList.toggle('open');
    });

    menu.querySelectorAll('.nav-link').forEach(function (l) {
      l.addEventListener('click', function () {
        btn.classList.remove('active');
        menu.classList.remove('open');
      });
    });

    document.addEventListener('click', function (e) {
      if (navbar && !navbar.contains(e.target)) {
        btn.classList.remove('active');
        menu.classList.remove('open');
      }
    });
  }

  /* ====================================================
     4. SMOOTH SCROLL
  ==================================================== */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = this.getAttribute('href');
        if (!id || id === '#') return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
        ) || 72;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
      });
    });
  }

  /* ====================================================
     5. ACTIVE NAV LINK ON SCROLL
  ==================================================== */
  function initActiveNav() {
    var sections = document.querySelectorAll('section[id]');
    var links    = document.querySelectorAll('.nav-link[href^="#"]');
    var navH     = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--nav-h'), 10
    ) || 72;

    function update() {
      var y = window.scrollY + navH + 20;
      var cur = '';
      sections.forEach(function (s) { if (s.offsetTop <= y) cur = s.id; });
      links.forEach(function (l) {
        l.classList.toggle('active', l.getAttribute('href') === '#' + cur);
      });
    }
    window.addEventListener('scroll', update, { passive: true });
    update();
  }

  /* ====================================================
     6. LANGUAGE TOGGLE
  ==================================================== */
  function initLangToggle() {
    var btn  = $('langToggle');
    var html = document.documentElement;
    if (!btn) return;

    function applyLang(lang) {
      html.setAttribute('data-lang', lang);
      html.setAttribute('lang', lang);
      html.setAttribute('dir', lang === 'en' ? 'ltr' : 'rtl');

      /* textContent elements */
      document.querySelectorAll('[data-ar][data-en]').forEach(function (el) {
        var tag = el.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea') {
          /* handle placeholders below */
          return;
        }
        if (tag === 'select') return;
        var val = el.getAttribute('data-' + lang);
        if (val) el.textContent = val;
      });

      /* inputs with placeholder attributes */
      document.querySelectorAll('[data-placeholder-ar]').forEach(function (el) {
        var key = 'data-placeholder-' + lang;
        el.placeholder = el.getAttribute(key) || el.placeholder;
      });

      /* select options */
      document.querySelectorAll('select option[data-ar]').forEach(function (opt) {
        var v = opt.getAttribute('data-' + lang);
        if (v) opt.textContent = v;
      });

      /* page title */
      var titleEl = document.querySelector('title');
      if (titleEl) {
        var tv = titleEl.getAttribute('data-' + lang);
        if (tv) document.title = tv;
      }

      /* update submit button label text */
      var btnLabel = document.querySelector('#submitBtn .btn-label');
      if (btnLabel) {
        var bv = btnLabel.getAttribute('data-' + lang);
        if (bv) btnLabel.textContent = bv;
      }

      /* store */
      try { localStorage.setItem('ibdaa_lang', lang); } catch (e) {}
    }

    btn.addEventListener('click', function () {
      applyLang(getLang() === 'ar' ? 'en' : 'ar');
    });

    /* restore saved */
    var saved = 'ar';
    try { saved = localStorage.getItem('ibdaa_lang') || 'ar'; } catch (e) {}
    if (saved !== 'ar') applyLang(saved);
  }

  /* ====================================================
     7. SCROLL REVEAL
  ==================================================== */
  function initScrollReveal() {
    var els = document.querySelectorAll('.sr-el');
    if (!els.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var delay = parseInt(entry.target.getAttribute('data-delay') || '0', 10);
          setTimeout(function () {
            entry.target.classList.add('visible');
          }, delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    els.forEach(function (el) { observer.observe(el); });
  }

  /* ====================================================
     8. SWIPER — CERTIFICATES
  ==================================================== */
  function initCertsSwiper() {
    if (typeof Swiper === 'undefined') return;
    if (!document.querySelector('.certs-swiper')) return;

    var sw = new Swiper('.certs-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 3500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true
      },
      pagination: { el: '.certs-pagination', clickable: true },
      navigation: { nextEl: '.certs-next', prevEl: '.certs-prev' },
      breakpoints: {
        640:  { slidesPerView: 2, spaceBetween: 20 },
        1024: { slidesPerView: 3, spaceBetween: 24 }
      }
    });

    var container = document.querySelector('.certs-swiper');
    if (container) {
      container.addEventListener('mouseenter', function () { sw.autoplay.stop(); });
      container.addEventListener('mouseleave', function () { sw.autoplay.start(); });
    }
  }

  /* ====================================================
     9. EMAILJS — CONTACT FORM
  ==================================================== */
  function initContactForm() {
    var form       = $('contactForm');
    var submitBtn  = $('submitBtn');
    var btnLabel   = submitBtn ? submitBtn.querySelector('.btn-label') : null;
    var spinner    = $('btnSpinner');
    var successEl  = $('formSuccess');
    var errorEl    = $('formError');
    if (!form) return;

    /* Initialise EmailJS with public key */
    try {
      if (typeof emailjs !== 'undefined') {
        emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
      }
    } catch (e) { console.warn('EmailJS init error:', e); }

    /* --- Field validator -------------------------------- */
    function validateField(id, errId, rules) {
      var el  = $(id);
      var err = $(errId);
      if (!el || !err) return true;

      var val = el.value.trim();
      var msg = '';

      if (rules.required && !val) {
        msg = t('required');
      } else if (val && rules.email) {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) msg = t('emailInvalid');
      } else if (val && rules.phone) {
        if (!/^\+?[\d\s\-]{7,15}$/.test(val)) msg = t('phoneInvalid');
      } else if (val && rules.minLength && val.length < rules.minLength) {
        msg = t('minLength');
      }

      err.textContent = msg;
      el.classList.toggle('invalid', !!msg);
      return !msg;
    }

    /* Live validation on blur */
    function bindLive(id, errId, rules) {
      var el = $(id);
      if (el) {
        el.addEventListener('blur',  function () { validateField(id, errId, rules); });
        el.addEventListener('input', function () {
          if (el.classList.contains('invalid')) validateField(id, errId, rules);
        });
      }
    }
    bindLive('fullName', 'err-name',    { required: true });
    bindLive('phone',    'err-phone',   { required: true, phone: true });
    bindLive('email',    'err-email',   { required: true, email: true });
    bindLive('message',  'err-message', { required: true, minLength: 10 });

    /* --- Submit ----------------------------------------- */
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      /* Validate all */
      var ok = true;
      ok = validateField('fullName', 'err-name',    { required: true })           && ok;
      ok = validateField('phone',    'err-phone',   { required: true, phone: true }) && ok;
      ok = validateField('email',    'err-email',   { required: true, email: true }) && ok;
      ok = validateField('message',  'err-message', { required: true, minLength: 10 }) && ok;

      if (!ok) {
        /* Shake the form */
        form.style.animation = 'none';
        void form.offsetHeight;
        form.style.animation = 'shakeFx 0.4s ease';
        return;
      }

      /* UI loading state */
      if (submitBtn) submitBtn.classList.add('loading');
      if (submitBtn) submitBtn.disabled = true;
      if (btnLabel)  btnLabel.textContent = t('sending');
      if (spinner)   spinner.classList.add('show');
      if (successEl) successEl.classList.remove('show');
      if (errorEl)   errorEl.classList.remove('show');

      var serviceEl  = $('service');
      var templateParams = {
        from_name:    $('fullName').value.trim(),
        from_email:   $('email').value.trim(),
        from_phone:   $('phone').value.trim(),
        service_type: serviceEl && serviceEl.value ? serviceEl.value : '—',
        message:      $('message').value.trim(),
        to_email:     TO_EMAIL
      };

      /* --- Send via EmailJS ------------------------------ */
      function onSuccess() {
        form.reset();
        /* clear errors */
        document.querySelectorAll('.field-error').forEach(function (el) { el.textContent = ''; });
        document.querySelectorAll('.invalid').forEach(function (el) { el.classList.remove('invalid'); });
        if (successEl) {
          var span = successEl.querySelector('span');
          if (span) {
            var msg = span.getAttribute('data-' + getLang()) || span.textContent;
            span.textContent = msg;
          }
          successEl.classList.add('show');
          setTimeout(function () { successEl.classList.remove('show'); }, 6000);
        }
        resetBtn();
      }

      function onFail(err) {
        console.error('EmailJS error:', err);
        if (errorEl) {
          var span = errorEl.querySelector('span');
          if (span) {
            var msg = span.getAttribute('data-' + getLang()) || span.textContent;
            span.textContent = msg;
          }
          errorEl.classList.add('show');
          setTimeout(function () { errorEl.classList.remove('show'); }, 7000);
        }
        resetBtn();
      }

      function resetBtn() {
        if (submitBtn) submitBtn.classList.remove('loading');
        if (submitBtn) submitBtn.disabled = false;
        if (btnLabel)  btnLabel.textContent = t('send');
        if (spinner)   spinner.classList.remove('show');
      }

      if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
        /* Real EmailJS send */
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
          .then(onSuccess, onFail);
      } else {
        /* ── DEMO MODE (no EmailJS keys set yet) ─────────
           Simulates a successful send after 1.5 s.
           Replace the keys at the top of this file to
           activate real email delivery.
        ─────────────────────────────────────────────── */
        console.info('[IBDAA TECH] EmailJS keys not set — running in demo mode.');
        setTimeout(onSuccess, 1500);
      }
    });
  }

  /* ====================================================
     INJECT GLOBAL KEYFRAMES (shake)
  ==================================================== */
  function injectKeyframes() {
    var s = document.createElement('style');
    s.textContent =
      '@keyframes shakeFx{0%,100%{transform:translateX(0)}' +
      '20%,60%{transform:translateX(-7px)}40%,80%{transform:translateX(7px)}}';
    document.head.appendChild(s);
  }

  /* ====================================================
     INIT ALL on DOMContentLoaded
  ==================================================== */
  document.addEventListener('DOMContentLoaded', function () {
    injectKeyframes();
    initPreloader();
    initNavbar();
    initHamburger();
    initSmoothScroll();
    initActiveNav();
    initLangToggle();
    initScrollReveal();
    initCertsSwiper();
    initContactForm();
  });

})();
