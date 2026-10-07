/**
 * SHEETAL SOLAR POWER COMPANY - NEXT LEVEL ANIMATION ENGINE
 * High-performance, lightweight (vanilla JS), 60fps animations:
 * - Real-time reading scroll progress bar
 * - Scroll-triggered IntersectionObserver element reveals with cascading stagger
 * - Eased animated number counters (200+, ₹1.2 Cr+, ₹78,000, 25 Years, 100%)
 * - Floating circular buttons continuous radar wave pulse
 * - Calculator micro-interaction tick animations on slider & preset change
 * - Sticky navbar shadow elevation on scroll
 */

(function () {
  'use strict';

  // 1. INJECT READING PROGRESS BAR
  function initProgressBar() {
    let bar = document.getElementById('reading-progress');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'reading-progress';
      document.body.prepend(bar);
    }

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      bar.style.width = scrollPercent + '%';
    }, { passive: true });
  }

  // 2. SCROLL REVEAL OBSERVER
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => observer.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('revealed'));
    }
  }

  // 3. EASED LIVE NUMBER COUNTERS
  function easeOutExpo(x) {
    return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
  }

  function animateCounter(el) {
    const target = parseFloat(el.getAttribute('data-counter-target'));
    if (isNaN(target)) return;

    const prefix = el.getAttribute('data-counter-prefix') || '';
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const decimals = parseInt(el.getAttribute('data-counter-decimals') || '0', 10);
    const duration = parseInt(el.getAttribute('data-counter-duration') || '1800', 10);
    const startTime = performance.now();

    function updateNumber(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);
      const current = easedProgress * target;

      const formattedNumber = decimals > 0 
        ? current.toFixed(decimals) 
        : Math.round(current).toLocaleString('en-IN');

      el.textContent = `${prefix}${formattedNumber}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        const finalFormatted = decimals > 0 
          ? target.toFixed(decimals) 
          : Math.round(target).toLocaleString('en-IN');
        el.textContent = `${prefix}${finalFormatted}${suffix}`;
        el.classList.add('pop-highlight');
        setTimeout(() => el.classList.remove('pop-highlight'), 300);
      }
    }

    requestAnimationFrame(updateNumber);
  }

  function initNumberCounters() {
    const counters = document.querySelectorAll('[data-counter-target]');
    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            obs.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.25
      });

      counters.forEach(counter => observer.observe(counter));
    } else {
      counters.forEach(counter => animateCounter(counter));
    }
  }

  // 4. NAVBAR SCROLL ELEVATION
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
    }, { passive: true });
  }

  // 5. CALCULATOR VALUE TICK PULSE
  window.triggerCalcTick = function() {
    const targets = [
      document.getElementById('calcCapacity'),
      document.getElementById('calcArea'),
      document.getElementById('calcSubsidy'),
      document.getElementById('calcMonthlySavings'),
      document.getElementById('calcAnnualSavings'),
      document.getElementById('calcLifetimeSavings'),
      document.getElementById('calcPayback')
    ];
    targets.forEach(el => {
      if (!el) return;
      el.classList.remove('calc-tick');
      void el.offsetWidth; // trigger reflow
      el.classList.add('calc-tick');
    });
  };

  // INITIALIZE ON DOM READY
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initProgressBar();
      initScrollReveal();
      initNumberCounters();
      initNavbarScroll();
    });
  } else {
    initProgressBar();
    initScrollReveal();
    initNumberCounters();
    initNavbarScroll();
  }

})();
