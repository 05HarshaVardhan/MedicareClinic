function initLazyLoading() {
  const lazyImages = document.querySelectorAll('img.lazy-img[data-src]');
  if (lazyImages.length === 0) return;

  function loadImage(img) {
    const highResSrc = img.getAttribute('data-src');
    if (!highResSrc) return;

    const tempImg = new Image();
    tempImg.src = highResSrc;
    tempImg.onload = () => {
      img.src = highResSrc;
      img.classList.add('loaded');
      img.removeAttribute('data-src');
    };
    tempImg.onerror = () => {
      img.classList.add('loaded');
    };
  }

  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          loadImage(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '150px 0px 150px 0px',
      threshold: 0.01
    });

    lazyImages.forEach(img => {
      if (img.classList.contains('loaded')) return;
      imageObserver.observe(img);
    });
  } else {
    lazyImages.forEach(img => loadImage(img));
  }
}

window.initLazyLoading = initLazyLoading;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLazyLoading);
} else {
  initLazyLoading();
}
