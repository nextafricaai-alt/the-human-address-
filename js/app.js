/* -------------------------------------------------------------
   THE HUMAN ADDRESS - Main Application Script
   Controls scroll reveal animations, UI states, and theme toggling.
   ------------------------------------------------------------- */

// Immediately set theme from localStorage to avoid Flash of Unstyled Content (FOUC)
(function() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Theme Toggle
  initThemeToggle();

  // Initialize Reveal Animations
  initRevealAnimations();

  // Initialize Subscription Forms
  initSubscriptionForms();
});

/**
 * Handles switching between light and dark themes
 */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

/**
 * Reveal elements smoothly on scroll using Intersection Observer
 */
function initRevealAnimations() {
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -8% 0px'
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Add visible class
          entry.target.classList.add('visible');
          
          // Optionally add inline delay if specified
          const delay = entry.target.getAttribute('data-delay');
          if (delay) {
            entry.target.style.transitionDelay = `${delay}s`;
          }

          // Unobserve after animating in
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      // Set initial styles for transitions
      revealObserver.observe(el);
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('visible'));
  }
}

/**
 * Handle subscription form submissions dynamically
 */
function initSubscriptionForms() {
  const subscribeForms = document.querySelectorAll('.subscribe-form');
  
  subscribeForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const emailInput = form.querySelector('.subscribe-input');
      const submitBtn = form.querySelector('.subscribe-submit');
      const noteEl = form.nextElementSibling; // The .subscribe-note text container
      
      if (!emailInput || !submitBtn) return;
      
      const email = emailInput.value.trim();
      if (!email) return;

      // Disable inputs during submission simulation
      emailInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulate API submission
      setTimeout(() => {
        submitBtn.textContent = 'Sent';
        emailInput.value = '';
        
        if (noteEl && noteEl.classList.contains('subscribe-note')) {
          noteEl.textContent = 'Thank you — the next address will arrive in your inbox.';
          noteEl.style.color = '#C9922A'; // highlight gold
        }
      }, 1000);
    });
  });
}
