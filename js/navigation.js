const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function closeNavMenu() {
  if (navMenu && hamburger && navMenu.classList.contains('show')) {
    navMenu.classList.remove('show');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.focus();
  }
}

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    const isShow = navMenu.classList.toggle('show');
    hamburger.setAttribute('aria-expanded', isShow ? 'true' : 'false');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('show')) {
      closeNavMenu();
    }
  });

  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('show') && !navMenu.contains(e.target) && !hamburger.contains(e.target)) {
      closeNavMenu();
    }
  });
}

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
