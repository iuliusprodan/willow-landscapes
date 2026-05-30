(function () {
  'use strict';

  var toggle = document.querySelector('.nav-toggle');
  var mobileNav = document.querySelector('.nav-mobile');
  var backdrop = document.querySelector('.nav-backdrop');

  if (toggle && mobileNav) {
    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      mobileNav.classList.toggle('is-open', open);
      mobileNav.hidden = !open;
      document.body.classList.toggle('nav-open', open);
      if (backdrop) {
        backdrop.classList.toggle('is-visible', open);
        backdrop.hidden = !open;
        backdrop.setAttribute('aria-hidden', open ? 'false' : 'true');
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () { setOpen(false); });
    }

    mobileNav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () { setOpen(false); });
    });

    window.addEventListener('resize', function () {
      if (window.matchMedia('(min-width: 768px)').matches) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        toggle.focus();
      }
    });

    setOpen(false);
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var revealEls = document.querySelectorAll('.reveal');
    if (revealEls.length && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

      revealEls.forEach(function (el) { observer.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  } else {
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  var form = document.getElementById('quote-form');
  if (!form) return;

  var success = document.getElementById('form-success');

  function showError(field, msg) {
    var group = field.closest('.form-group');
    var err = group && group.querySelector('.form-error');
    field.classList.add('error');
    if (err) {
      err.textContent = msg;
      err.classList.add('visible');
    }
  }

  function clearErrors() {
    form.querySelectorAll('.error').forEach(function (el) { el.classList.remove('error'); });
    form.querySelectorAll('.form-error').forEach(function (el) {
      el.classList.remove('visible');
      el.textContent = '';
    });
    if (success) success.hidden = true;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    clearErrors();
    var valid = true;

    var name = form.querySelector('[name="name"]');
    var phone = form.querySelector('[name="phone"]');
    var email = form.querySelector('[name="email"]');
    var postcode = form.querySelector('[name="postcode"]');
    var service = form.querySelector('[name="service"]');
    var message = form.querySelector('[name="message"]');

    if (!name.value.trim()) {
      showError(name, 'Please enter your name.');
      valid = false;
    }
    var digits = phone.value.replace(/\D/g, '');
    if (!phone.value.trim() || digits.length < 10) {
      showError(phone, 'Please enter a valid UK phone number.');
      valid = false;
    }
    if (email.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError(email, 'Please enter a valid email address.');
      valid = false;
    }
    if (!postcode.value.trim()) {
      showError(postcode, 'Please enter your postcode.');
      valid = false;
    }
    if (!service.value) {
      showError(service, 'Please select a service.');
      valid = false;
    }
    if (!message.value.trim() || message.value.trim().length < 10) {
      showError(message, 'Please describe your project (at least 10 characters).');
      valid = false;
    }

    if (valid && success) {
      success.hidden = false;
      form.reset();
      success.focus({ preventScroll: true });
    }
  });

  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('input', function () {
      field.classList.remove('error');
      var err = field.closest('.form-group');
      if (err) {
        err = err.querySelector('.form-error');
        if (err) err.classList.remove('visible');
      }
    });
  });
})();
