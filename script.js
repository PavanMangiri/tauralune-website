/* Tauralune – shared script for every page.
   Loaded in <head> (not deferred) so the saved theme is applied before the page paints.
   Everything that touches page content waits for DOMContentLoaded. */
(function () {
  'use strict';

  var SUPPORT_EMAIL = 'support@tauralune.com';
  var THEME_KEY = 'tauralune-theme';
  var THEME_COLORS = { light: '#F3F5F9', dark: '#0E1424' };
  var root = document.documentElement;
  var darkQuery = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  /* ---------- Theme (runs immediately) ---------- */
  function readStoredTheme() {
    try {
      var value = window.localStorage.getItem(THEME_KEY);
      return value === 'dark' || value === 'light' ? value : null;
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      window.localStorage.setItem(THEME_KEY, theme);
    } catch (error) {
      /* Storage can be blocked (private mode); the toggle still works for this visit. */
    }
  }

  function systemTheme() {
    return darkQuery && darkQuery.matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute('content', THEME_COLORS[theme]);
    }
    var toggles = document.querySelectorAll('.theme-toggle');
    Array.prototype.forEach.call(toggles, function (toggle) {
      var isDark = theme === 'dark';
      toggle.setAttribute('aria-pressed', isDark ? 'true' : 'false');
      var label = toggle.querySelector('.theme-toggle-label');
      if (label) {
        label.textContent = isDark ? 'Light theme' : 'Dark theme';
      }
      toggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    });
  }

  applyTheme(readStoredTheme() || systemTheme());

  if (darkQuery) {
    var onSystemChange = function () {
      if (!readStoredTheme()) {
        applyTheme(systemTheme());
      }
    };
    if (darkQuery.addEventListener) {
      darkQuery.addEventListener('change', onSystemChange);
    } else if (darkQuery.addListener) {
      darkQuery.addListener(onSystemChange);
    }
  }

  /* ---------- Page setup ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(root.getAttribute('data-theme') || systemTheme());
    setupThemeToggle();
    setupMenu();
    setupSmoothScroll();
    setupCopyButtons();
    setupPrintButtons();
    setupInquiryForm();
    hideUnfilledOptionalLinks();
    setYear();
  });

  function setupThemeToggle() {
    var toggles = document.querySelectorAll('.theme-toggle');
    Array.prototype.forEach.call(toggles, function (toggle) {
      toggle.addEventListener('click', function () {
        var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        storeTheme(next);
      });
    });
  }

  /* ---------- Mobile drawer menu ---------- */
  function setupMenu() {
    var button = document.querySelector('.menu-toggle');
    var nav = document.getElementById('site-nav');
    var backdrop = document.querySelector('.nav-backdrop');
    if (!button || !nav) {
      return;
    }
    var label = button.querySelector('.visually-hidden');
    var desktop = window.matchMedia ? window.matchMedia('(min-width: 861px)') : null;

    function isOpen() {
      return button.getAttribute('aria-expanded') === 'true';
    }

    function open() {
      button.setAttribute('aria-expanded', 'true');
      if (label) { label.textContent = 'Close menu'; }
      document.body.classList.add('nav-open');
      if (backdrop) { backdrop.hidden = false; }
      var firstLink = nav.querySelector('a, button');
      if (firstLink) {
        window.setTimeout(function () { firstLink.focus(); }, 50);
      }
    }

    function close(returnFocus) {
      button.setAttribute('aria-expanded', 'false');
      if (label) { label.textContent = 'Open menu'; }
      document.body.classList.remove('nav-open');
      if (backdrop) { backdrop.hidden = true; }
      if (returnFocus) { button.focus(); }
    }

    button.addEventListener('click', function () {
      if (isOpen()) {
        close(false);
      } else {
        open();
      }
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () { close(true); });
    }

    nav.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        close(false);
      }
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        close(true);
      }
    });

    if (desktop) {
      var onDesktop = function (query) {
        if (query.matches && isOpen()) { close(false); }
      };
      if (desktop.addEventListener) {
        desktop.addEventListener('change', onDesktop);
      } else if (desktop.addListener) {
        desktop.addListener(onDesktop);
      }
    }
  }

  /* ---------- Smooth scrolling for same-page links ---------- */
  function setupSmoothScroll() {
    var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link) { return; }
      var url;
      try {
        url = new URL(link.getAttribute('href'), window.location.href);
      } catch (error) {
        return;
      }
      var samePage = url.pathname === window.location.pathname && url.origin === window.location.origin;
      if (!samePage || !url.hash || url.hash.length < 2) { return; }

      var target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) { return; }

      event.preventDefault();
      target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', url.hash);
      }
      if (!target.hasAttribute('tabindex')) {
        target.setAttribute('tabindex', '-1');
      }
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Copy email ---------- */
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var area = document.createElement('textarea');
      area.value = text;
      area.setAttribute('readonly', '');
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      try {
        var ok = document.execCommand('copy');
        document.body.removeChild(area);
        if (ok) { resolve(); } else { reject(new Error('Copy command failed')); }
      } catch (error) {
        document.body.removeChild(area);
        reject(error);
      }
    });
  }

  function announce(message) {
    var status = document.querySelector('.copy-status');
    if (status) {
      status.textContent = message;
    }
  }

  function setupCopyButtons() {
    var buttons = document.querySelectorAll('[data-copy]');
    Array.prototype.forEach.call(buttons, function (button) {
      var original = button.textContent;
      button.addEventListener('click', function () {
        var text = button.getAttribute('data-copy');
        copyText(text).then(function () {
          button.textContent = 'Copied';
          button.classList.add('is-done');
          announce(text + ' copied to clipboard.');
          window.setTimeout(function () {
            button.textContent = original;
            button.classList.remove('is-done');
          }, 2000);
        }, function () {
          announce('Could not copy automatically. Our email address is ' + text + '.');
        });
      });
    });
  }

  function setupPrintButtons() {
    var buttons = document.querySelectorAll('[data-print]');
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () { window.print(); });
    });
  }

  /* ---------- Inquiry form: opens the visitor's email app (mailto) ---------- */
  function setupInquiryForm() {
    var form = document.getElementById('inquiry-form');
    if (!form) { return; }
    var status = form.querySelector('.form-status');

    function setStatus(message, kind) {
      status.textContent = message;
      status.classList.remove('is-ok', 'is-error');
      if (kind) { status.classList.add(kind); }
    }

    form.addEventListener('input', function (event) {
      if (event.target.getAttribute('aria-invalid') === 'true' && event.target.checkValidity()) {
        event.target.removeAttribute('aria-invalid');
      }
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();

      var fields = ['name', 'email', 'message'];
      var firstInvalid = null;
      fields.forEach(function (name) {
        var field = form.elements[name];
        field.value = field.value.trim();
        if (!field.checkValidity()) {
          field.setAttribute('aria-invalid', 'true');
          if (!firstInvalid) { firstInvalid = field; }
        } else {
          field.removeAttribute('aria-invalid');
        }
      });

      if (firstInvalid) {
        setStatus('Please fill in your name, a valid email address and your message.', 'is-error');
        firstInvalid.focus();
        return;
      }

      var name = form.elements.name.value;
      var email = form.elements.email.value;
      var topic = form.elements.topic.value;
      var message = form.elements.message.value;

      var subject = '[Tauralune] ' + topic + ' from ' + name;
      var body = [
        message,
        '',
        '---',
        'Name: ' + name,
        'Reply to: ' + email,
        'Topic: ' + topic,
        'Sent from the form at https://tauralune.com/#support'
      ].join('\n');

      var href = 'mailto:' + SUPPORT_EMAIL +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      window.location.href = href;

      setStatus(
        'Your email app should now be open with this message filled in. Nothing has been sent yet: press Send in your email app. ' +
        'If no email app opened, write to ' + SUPPORT_EMAIL + ' directly.',
        'is-ok'
      );
    });
  }

  /* ---------- Hide optional links whose marker was not replaced ---------- */
  function hideUnfilledOptionalLinks() {
    var links = document.querySelectorAll('[data-optional-link]');
    Array.prototype.forEach.call(links, function (link) {
      var href = link.getAttribute('href') || '';
      if (href.indexOf('REPLACE_WITH') !== -1 || href === '') {
        var container = link.closest('[data-optional]');
        if (container) {
          container.hidden = true;
        } else {
          link.hidden = true;
        }
      }
    });
  }

  function setYear() {
    var year = String(new Date().getFullYear());
    var spans = document.querySelectorAll('[data-year]');
    Array.prototype.forEach.call(spans, function (span) {
      span.textContent = year;
    });
  }
})();
