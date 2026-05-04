const body = document.body;
const logos = document.querySelectorAll('[data-logo], [data-footer-logo]');
const header = document.querySelector('[data-header]');
const menuToggle = document.querySelector('[data-menu-toggle]');
const nav = document.querySelector('[data-nav]');

function applyFixedTheme() {
  document.documentElement.style.colorScheme = 'dark';

  logos.forEach((logo) => {
    logo.src = 'assets/logos/logo-white.png';
  });
}
function handleHeaderScroll() {
  if (!header) return;
  header.classList.toggle('is-scrolled', window.scrollY > 20);
}

function closeMobileMenu() {
  if (!nav || !menuToggle) return;
  nav.classList.remove('is-open');
  menuToggle.classList.remove('is-active');
  menuToggle.setAttribute('aria-expanded', 'false');
}

function setupMobileMenu() {
  if (!menuToggle || !nav) return;

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeMobileMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) closeMobileMenu();
  });
}

function setupRevealAnimation() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  if (!('IntersectionObserver' in window)) {
    elements.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });

  elements.forEach((element) => observer.observe(element));
}

function setupCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const animateCounter = (element) => {
    const target = Number(element.dataset.counter || 0);
    const duration = 1400;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      element.textContent = target === 100 ? `${value}%` : `+${value}`;

      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  counters.forEach((counter) => observer.observe(counter));
}

function setupCarousel() {
  const carousel = document.querySelector('[data-carousel]');
  const track = document.querySelector('[data-carousel-track]');
  const prev = document.querySelector('[data-carousel-prev]');
  const next = document.querySelector('[data-carousel-next]');
  if (!carousel || !track) return;

  const scrollAmount = () => Math.max(280, track.clientWidth * 0.72);

  prev?.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
  next?.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));

  let autoplay = window.setInterval(() => {
    const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    track.scrollTo({ left: reachedEnd ? 0 : track.scrollLeft + scrollAmount(), behavior: 'smooth' });
  }, 4200);

  carousel.addEventListener('mouseenter', () => window.clearInterval(autoplay));
  carousel.addEventListener('mouseleave', () => {
    autoplay = window.setInterval(() => {
      const reachedEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
      track.scrollTo({ left: reachedEnd ? 0 : track.scrollLeft + scrollAmount(), behavior: 'smooth' });
    }, 4200);
  });
}

function setupProjectModal() {
  const modal = document.querySelector('[data-project-modal]');
  const close = document.querySelector('[data-modal-close]');
  const title = document.querySelector('#modal-title');
  const text = document.querySelector('[data-modal-text]');
  const cards = document.querySelectorAll('[data-project-card]');

  if (!modal || !cards.length) return;

  const openModal = (card) => {
    const cardTitle = card.querySelector('h2')?.textContent || 'Projeto RM Construção';
    const cardText = card.querySelector('p')?.textContent || 'Serviço executado com padrão profissional.';
    title.textContent = cardTitle;
    text.textContent = `${cardText} Fale com a RM para adaptar esse tipo de solução ao seu projeto.`;
    modal.showModal();
  };

  cards.forEach((card) => {
    card.addEventListener('click', () => openModal(card));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openModal(card);
      }
    });
  });

  close?.addEventListener('click', () => modal.close());
  modal.addEventListener('click', (event) => {
    if (event.target === modal) modal.close();
  });
}

applyFixedTheme();
setupMobileMenu();
setupRevealAnimation();
setupCounters();
setupCarousel();
setupProjectModal();
handleHeaderScroll();

window.addEventListener('scroll', handleHeaderScroll, { passive: true });
