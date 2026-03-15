// Parkon Landing Page functionality
document.addEventListener('DOMContentLoaded', () => {
  console.log('Parkon initialized');

  // ─── Animated Stats Counters ──────────────────────────────────────────────
  const counters = document.querySelectorAll('.counter');

  const animateCounter = (el) => {
    const target   = parseInt(el.dataset.target, 10);
    const start    = el.dataset.start !== undefined ? parseInt(el.dataset.start, 10) : 0;
    const suffix   = el.dataset.suffix || '';
    const isDown   = el.classList.contains('counter-down');
    const duration = 2000; // ms
    const startTime = performance.now();

    const step = (now) => {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);

      let current;
      if (isDown) {
        current = Math.round(start - ease * (start - target));
      } else {
        current = Math.round(start + ease * (target - start));
      }

      el.textContent = current + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    };

    requestAnimationFrame(step);
  };

  // Trigger when stats row enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          counters.forEach((counter) => animateCounter(counter));
          observer.disconnect(); // run only once
        }
      });
    },
    { threshold: 0.4 }
  );

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) observer.observe(statsRow);

  // ─── 24/7 pulse glow ──────────────────────────────────────────────────────
  const el247 = document.querySelector('.counter-247');
  if (el247) {
    setInterval(() => {
      el247.style.textShadow = '0 0 20px rgba(0,186,74,0.8)';
      setTimeout(() => { el247.style.textShadow = 'none'; }, 600);
    }, 2000);
  }
});

