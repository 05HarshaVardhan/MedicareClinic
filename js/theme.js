const themeOptions = document.querySelectorAll('.theme-option');
const themeToggleBtn = document.querySelector('.theme-toggle');
const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;

function applyTheme(themeName, savePreference = true) {
  if (themeName === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (savePreference) localStorage.setItem('clinic-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (savePreference) localStorage.setItem('clinic-theme', 'light');
  }

  themeOptions.forEach(opt => {
    const isTarget = opt.getAttribute('data-theme-val') === themeName;
    opt.classList.toggle('active', isTarget);
    opt.setAttribute('aria-checked', isTarget ? 'true' : 'false');
  });

  if (themeIcon) {
    if (themeName === 'dark') {
      themeIcon.classList.remove('fa-moon');
      themeIcon.classList.add('fa-sun');
    } else {
      themeIcon.classList.remove('fa-sun');
      themeIcon.classList.add('fa-moon');
    }
  }
}

const savedTheme = localStorage.getItem('clinic-theme');
const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');

if (savedTheme === 'dark' || savedTheme === 'light') {
  applyTheme(savedTheme, true);
} else {
  const initialTheme = (systemPrefersDark && systemPrefersDark.matches) ? 'dark' : 'light';
  applyTheme(initialTheme, false);
}

if (systemPrefersDark) {
  systemPrefersDark.addEventListener('change', (e) => {
    if (!localStorage.getItem('clinic-theme')) {
      applyTheme(e.matches ? 'dark' : 'light', false);
    }
  });
}

if (themeOptions.length > 0) {
  themeOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      const selectedTheme = opt.getAttribute('data-theme-val');
      applyTheme(selectedTheme, true);
    });

    opt.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        applyTheme('light', true);
        document.querySelector('.theme-option[data-theme-val="light"]')?.focus();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        applyTheme('dark', true);
        document.querySelector('.theme-option[data-theme-val="dark"]')?.focus();
      }
    });
  });
}

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    applyTheme(currentTheme === 'dark' ? 'light' : 'dark', true);
  });
}
