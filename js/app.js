/* -------------------------------------------------------------
   THE HUMAN ADDRESS - Main Application Script
   Controls scroll reveal animations, UI states, and theme toggling.
   ------------------------------------------------------------- */

document.addEventListener('DOMContentLoaded', () => {
  // Hero intro — text appears after the clip ends
  initHeroIntro();

  // Initialize Reveal Animations
  initRevealAnimations();

  // Initialize Subscription Forms
  initSubscriptionForms();
});

/**
 * Hero intro — keep the hero text hidden while the 19s clip plays,
 * then reveal it when the video ends (freezing on its last frame).
 * Falls back to revealing promptly if autoplay is blocked.
 */
function initHeroIntro() {
  const hero = document.querySelector('.hero');
  const content = hero ? hero.querySelector('.hero-content') : null;
  if (!content) return;

  const video = hero.querySelector('video.hero-bg');
  const still = hero.querySelector('.hero-still');
  const reveal = () => {
    content.classList.add('entered');
    if (still) still.classList.add('shown');
  };

  if (!video) { reveal(); return; }

  let started = false;
  video.addEventListener('play', () => { started = true; });
  video.addEventListener('ended', reveal);
  video.addEventListener('error', reveal);

  // If autoplay is blocked, the poster acts as the still — reveal promptly
  setTimeout(() => { if (!started) reveal(); }, 1800);

  // Absolute safety net
  setTimeout(reveal, 20500);
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
  
  // FormSubmit AJAX endpoint — delivers subscriber emails to the address inbox
  const FORM_ENDPOINT = 'https://formsubmit.co/ajax/533f15f3a56b7ba03d1cf770279fd083';

  subscribeForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const emailInput = form.querySelector('.subscribe-input');
      const submitBtn = form.querySelector('.subscribe-submit');
      const noteEl = form.nextElementSibling; // The .subscribe-note text container

      if (!emailInput || !submitBtn) return;

      const email = emailInput.value.trim();
      if (!email) return;

      // Disable inputs during submission
      emailInput.disabled = true;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: 'New subscriber — The Address in Writing',
          _template: 'table',
          _captcha: 'false'
        })
      })
        .then(response => response.json())
        .then(() => {
          submitBtn.textContent = 'Sent';
          emailInput.value = '';
          if (noteEl && noteEl.classList.contains('subscribe-note')) {
            noteEl.textContent = 'Thank you — the next address will arrive in your inbox.';
            noteEl.style.color = '#C9922A'; // highlight gold
          }
        })
        .catch(() => {
          // Re-enable so the visitor can retry
          emailInput.disabled = false;
          submitBtn.disabled = false;
          submitBtn.textContent = 'Subscribe';
          if (noteEl && noteEl.classList.contains('subscribe-note')) {
            noteEl.textContent = 'Something went wrong — please try again.';
            noteEl.style.color = '';
          }
        });
    });
  });
}
