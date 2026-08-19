(function() {
  const mainContent = document.getElementById('main-content');
  if (!mainContent) return;

  function updateActiveNav(targetUrl) {
    const currentPath = new URL(targetUrl, window.location.origin).pathname;
    const navLinks = document.querySelectorAll('.nav-link, .footer-links a');

    navLinks.forEach(link => {
      const linkPath = new URL(link.href, window.location.origin).pathname;
      const isMatch = linkPath === currentPath || 
                      (currentPath.endsWith('/') && linkPath.endsWith('index.html')) ||
                      (linkPath.endsWith('/') && currentPath.endsWith('index.html'));

      if (link.classList.contains('nav-link')) {
        link.classList.toggle('active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'page');
        } else {
          link.removeAttribute('aria-current');
        }
      }
    });
  }

  function rebindModules() {
    if (typeof window.initDoctorsModule === 'function') window.initDoctorsModule();
    if (typeof window.initBookingModule === 'function') window.initBookingModule();
    if (typeof window.initLocatorModule === 'function') window.initLocatorModule();
    if (typeof window.initCarouselModule === 'function') window.initCarouselModule();
    if (typeof window.initLazyLoading === 'function') window.initLazyLoading();
  }

  async function loadRoute(url, pushToHistory = true) {
    try {
      mainContent.classList.add('page-fade-out');

      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const htmlText = await response.text();

      const parser = new DOMParser();
      const newDoc = parser.parseFromString(htmlText, 'text/html');

      const newMain = newDoc.getElementById('main-content');
      if (!newMain) {
        window.location.href = url;
        return;
      }

      document.title = newDoc.title || document.title;
      mainContent.innerHTML = newMain.innerHTML;

      if (pushToHistory) {
        history.pushState({ url }, '', url);
      }

      updateActiveNav(url);
      rebindModules();

      window.scrollTo(0, 0);
      mainContent.focus();

      if (typeof closeNavMenu === 'function') {
        closeNavMenu();
      }

      mainContent.classList.remove('page-fade-out');
      mainContent.classList.add('page-fade-in');
      setTimeout(() => mainContent.classList.remove('page-fade-in'), 300);

    } catch (err) {
      window.location.href = url;
    }
  }

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a');
    if (!anchor) return;

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
    if (anchor.target === '_blank' || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const targetUrl = new URL(anchor.href, window.location.origin);
    if (targetUrl.origin !== window.location.origin) return;

    e.preventDefault();
    if (targetUrl.href !== window.location.href) {
      loadRoute(targetUrl.href, true);
    }
  });

  window.addEventListener('popstate', (e) => {
    loadRoute(window.location.href, false);
  });

  updateActiveNav(window.location.href);
  window.navigateToRoute = loadRoute;
})();
