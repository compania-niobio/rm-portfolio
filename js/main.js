const body = document.body;
const logo = document.querySelector('[data-logo]');
const footerLogo = document.querySelector('[data-footer-logo]');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

const assets = {
  logoDay: 'assets/logos/logo-black.png',
  logoNight: 'assets/logos/logo-white.png'
};

function applyThemeByTime() {
  const hour = new Date().getHours();
  const isDay = hour >= 6 && hour < 18; // 06h até 17h59 = tema claro; 18h até 05h59 = tema escuro

  body.classList.toggle('theme-day', isDay);
  body.classList.toggle('theme-night', !isDay);

  const logoSrc = isDay ? assets.logoDay : assets.logoNight;

  if (logo) logo.src = logoSrc;
  if (footerLogo) footerLogo.src = logoSrc;
}

function handleHeaderScroll() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

function setupMobileMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

function setupRevealAnimation() {
  const elements = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14 });

  elements.forEach((element) => observer.observe(element));
}

applyThemeByTime();
setupMobileMenu();
setupRevealAnimation();
handleHeaderScroll();

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
setInterval(applyThemeByTime, 60 * 1000);
