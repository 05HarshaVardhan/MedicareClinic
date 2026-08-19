(function() {
  const modules = ['theme.js', 'navigation.js', 'doctors.js', 'booking.js', 'locator.js', 'carousel.js', 'lazyloader.js', 'router.js'];
  
  const scripts = document.getElementsByTagName('script');
  let basePath = 'js/';
  for (let s of scripts) {
    if (s.src && s.src.includes('main.js')) {
      basePath = s.src.replace(/main\.js(\?.*)?$/, '');
      break;
    }
  }

  modules.forEach(file => {
    const script = document.createElement('script');
    script.src = basePath + file;
    script.async = false;
    document.head.appendChild(script);
  });
})();
