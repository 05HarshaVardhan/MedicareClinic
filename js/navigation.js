/* =================================================================
   MedCare Clinic - Navigation Module (Hamburger Menu & Back To Top)
   ================================================================ */

// 1. MOBILE NAVIGATION (Hamburger Menu)
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
  });
}

// 2. BACK TO TOP BUTTON
function debounce(callback, delay = 100) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

const backToTopBtn = document.createElement('button');
backToTopBtn.type = 'button';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up" aria-hidden="true"></i>';
document.body.appendChild(backToTopBtn);

function updateBackToTopVisibility() {
  backToTopBtn.classList.toggle('show', window.scrollY > 400);
}

backToTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

window.addEventListener('scroll', debounce(updateBackToTopVisibility), { passive: true });
updateBackToTopVisibility();
