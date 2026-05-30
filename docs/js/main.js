/* ============================================================
   DAT Masters — Site interactions
   ============================================================ */

(() => {
  'use strict';

  // ---------- Flip no-js → js (enables JS-gated reveal styles) ----------
  document.documentElement.classList.replace('no-js', 'js');

  // ---------- Theme toggle (dark mode) ----------
  // The inline script in <head> already set [data-theme] from localStorage if present,
  // so this just wires the toggle button + handles state.
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    const getCurrentTheme = () => {
      const explicit = document.documentElement.getAttribute('data-theme');
      if (explicit) return explicit;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };
    const updateLabel = () => {
      const current = getCurrentTheme();
      themeBtn.setAttribute('aria-label',
        current === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    };
    updateLabel();
    themeBtn.addEventListener('click', () => {
      const next = getCurrentTheme() === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('dm-theme', next); } catch (e) {}
      updateLabel();
    });
    // Respect system-pref changes when user hasn't manually overridden
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener?.('change', () => {
      if (!localStorage.getItem('dm-theme')) updateLabel();
    });
  }

  // ---------- Sticky nav shadow ----------
  const nav = document.getElementById('nav');
  if (nav) {
    let ticking = false;
    const update = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 12);
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    update();
  }

  // ---------- Mobile nav toggle (with Escape + outside-click + focus return) ----------
  const toggle = document.getElementById('nav-toggle');
  if (toggle && nav) {
    const closeNav = ({ returnFocus = false } = {}) => {
      if (!nav.classList.contains('is-open')) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation');
      if (returnFocus) toggle.focus();
    };
    const openNav = () => {
      nav.classList.add('is-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation');
    };
    toggle.addEventListener('click', () => {
      nav.classList.contains('is-open') ? closeNav({ returnFocus: true }) : openNav();
    });
    // Close on link click
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => closeNav());
    });
    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeNav({ returnFocus: true });
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.classList.contains('is-open')) return;
      if (nav.contains(e.target)) return;
      closeNav();
    });
  }

  // ---------- FAQ accordion: close siblings on open ----------
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach(o => { if (o !== item && o.open) o.open = false; });
      }
    });
  });

  // ---------- Reveal on scroll ----------
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    // Fallback: show all immediately
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
  }

  // ---------- Guide waitlist form ----------
  // Until Lona wires up a real ESP (ConvertKit / MailerLite / GHL), every
  // submission opens the visitor's email client with a pre-filled "add me to
  // the guide waitlist" message — so nothing is silently dropped on the floor.
  const form = document.getElementById('guide-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      const email = (emailInput?.value || '').trim();
      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        emailInput?.focus();
        emailInput.style.borderColor = 'var(--color-error)';
        return;
      }
      // Open a real mailto so the visitor has a verifiable trail.
      const subject = encodeURIComponent('DAT Masters — free guide waitlist');
      const body = encodeURIComponent(
        `Hi Lona,\n\nPlease add me to the waitlist for the free DAT guide.\n\nEmail: ${email}\n\n— Sent from datmasters.com`
      );
      window.location.href = `mailto:lona@datmasters.com?subject=${subject}&body=${body}`;
      // Surface confirmation locally too.
      form.classList.add('is-success');
      const msg = form.querySelector('.success-msg');
      msg?.focus?.();
    });
  }

  // ---------- Booking flow ----------
  // Single config block — replace BOOKING_URL with Calendly/GHL once live.
  // Until then every [data-cta="book"] button falls back to a real mailto.
  const BOOKING_URL = ''; // e.g., 'https://calendly.com/lona-datmasters/strategy'
  const BOOKING_EMAIL = 'lona@datmasters.com';
  const MAILTO = `mailto:${BOOKING_EMAIL}` +
    '?subject=' + encodeURIComponent('Free DAT strategy call — request') +
    '&body=' + encodeURIComponent(
      "Hi Lona,\n\n" +
      "I'd like to book the free strategy call.\n\n" +
      "Target DAT date: \n" +
      "Current target AA: \n" +
      "Where I'm stuck right now: \n\n" +
      "Best times for a 30-min call: \n\n" +
      "— Sent from datmasters.com"
    );

  document.querySelectorAll('[data-cta="book"]').forEach(el => {
    // Set the live href so right-click "copy link" + keyboard users get a real action.
    if (el.tagName === 'A') el.setAttribute('href', BOOKING_URL || MAILTO);
    el.addEventListener('click', (e) => {
      if (BOOKING_URL) return; // let the real link work
      // mailto: works as a normal anchor; no preventDefault needed.
    });
  });

  // ---------- Group classes inquiry CTA ----------
  const GROUP_MAILTO = `mailto:${BOOKING_EMAIL}` +
    '?subject=' + encodeURIComponent('DAT Masters — group classes inquiry') +
    '&body=' + encodeURIComponent(
      "Hi Lona,\n\n" +
      "I'd like to learn more about the group classes offered by your team of tutors.\n\n" +
      "Target DAT date: \n" +
      "Sections I want to focus on: \n" +
      "Preferred days/times for classes: \n\n" +
      "— Sent from datmasters.com"
    );
  document.querySelectorAll('[data-cta="inquire-group"]').forEach(el => {
    if (el.tagName === 'A') el.setAttribute('href', GROUP_MAILTO);
  });

})();
