/* ==========================================================================
   Summit & Co. Events - Main JavaScript Engine
   Theme System, Nav Management, Portfolio Filtering, Form Validation, GSAP
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. Theme Toggle System (Light / Dark Mode) ---
  const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
  const THEME_KEY = 'summit_events_theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-bs-theme', theme === 'dark' ? 'dark' : 'light');
    localStorage.setItem(THEME_KEY, theme);

    themeToggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill';
          btn.setAttribute('title', 'Switch to Light Mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('title', 'Switch to Dark Mode');
        }
      }
    });
  }

  // Initialize theme
  const currentTheme = getPreferredTheme();
  setTheme(currentTheme);

  themeToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      setTheme(newTheme);
    });
  });

  // --- 1.5. RTL Layout Toggle System ---
  const rtlToggleBtns = document.querySelectorAll('.rtl-toggle-btn');
  const RTL_KEY = 'summit_events_rtl';

  function getSavedRtl() {
    return localStorage.getItem(RTL_KEY) === 'true';
  }

  function setRtl(isRtl) {
    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem(RTL_KEY, 'true');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      localStorage.setItem(RTL_KEY, 'false');
    }

    rtlToggleBtns.forEach(btn => {
      if (isRtl) {
        btn.classList.add('active');
        btn.setAttribute('title', 'Switch to LTR Layout');
      } else {
        btn.classList.remove('active');
        btn.setAttribute('title', 'Switch to RTL Layout');
      }
    });
  }

  // Initialize RTL
  const isRtl = getSavedRtl();
  setRtl(isRtl);

  rtlToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const currentlyRtl = document.documentElement.getAttribute('dir') === 'rtl';
      setRtl(!currentlyRtl);
    });
  });

  // --- 2. Navbar Scroll Behavior & Active Page Link ---
  const navbar = document.querySelector('.navbar-custom');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }

  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link-custom, .dropdown-item-custom');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- 3. Keyboard Navigation & Accessibility (ESC Key) ---
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close Bootstrap Offcanvas if open
      const openOffcanvas = document.querySelector('.offcanvas.show');
      if (openOffcanvas && window.bootstrap) {
        const bsOffcanvas = window.bootstrap.Offcanvas.getInstance(openOffcanvas);
        if (bsOffcanvas) bsOffcanvas.hide();
      }
      // Close Modal if open
      const openModal = document.querySelector('.modal.show');
      if (openModal && window.bootstrap) {
        const bsModal = window.bootstrap.Modal.getInstance(openModal);
        if (bsModal) bsModal.hide();
      }
    }
  });

  // --- 4. Portfolio Filtering & Lightbox ---
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        portfolioItems.forEach(item => {
          const category = item.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            item.style.display = 'block';
            if (window.gsap) {
              gsap.fromTo(item, { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.4 });
            }
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // Lightbox Handler
  const lightboxModal = document.getElementById('lightboxModal');
  if (lightboxModal) {
    lightboxModal.addEventListener('show.bs.modal', (e) => {
      const trigger = e.relatedTarget;
      if (trigger) {
        const imgSrc = trigger.getAttribute('data-bs-img');
        const title = trigger.getAttribute('data-bs-title');
        const category = trigger.getAttribute('data-bs-category');

        const modalImg = lightboxModal.querySelector('#lightboxImage');
        const modalTitle = lightboxModal.querySelector('#lightboxTitle');
        const modalCategory = lightboxModal.querySelector('#lightboxCategory');

        if (modalImg) modalImg.src = imgSrc;
        if (modalTitle) modalTitle.textContent = title || 'Event Showcase';
        if (modalCategory) modalCategory.textContent = category || 'Summit & Co.';
      }
    });
  }

  // --- 5. Form Validation Handlers ---
  const forms = document.querySelectorAll('.needs-validation');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
      } else {
        e.preventDefault();
        // Show success alert
        const alertBox = form.querySelector('.form-success-alert');
        if (alertBox) {
          alertBox.classList.remove('d-none');
          form.reset();
          form.classList.remove('was-validated');
        } else {
          alert('Thank you! Your inquiry has been submitted successfully. Our event team will contact you shortly.');
          form.reset();
          form.classList.remove('was-validated');
        }
      }
      form.classList.add('was-validated');
    });
  });

  // Password Visibility Toggle
  const togglePasswordBtns = document.querySelectorAll('.toggle-password-btn');
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetInputId = btn.getAttribute('data-target');
      const input = document.getElementById(targetInputId);
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        const icon = btn.querySelector('i');
        if (icon) {
          icon.className = isPassword ? 'bi bi-eye-slash' : 'bi bi-eye';
        }
      }
    });
  });

  // --- 6. Back to Top Button ---
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 7. Counter Animation for Stats ---
  const statNumbers = document.querySelectorAll('.counter-stat');
  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const endValue = parseInt(target.getAttribute('data-count'), 10);
          const suffix = target.getAttribute('data-suffix') || '';
          let startValue = 0;
          const duration = 1500;
          const stepTime = Math.abs(Math.floor(duration / endValue));

          const timer = setInterval(() => {
            startValue += 1;
            target.textContent = startValue + suffix;
            if (startValue >= endValue) {
              target.textContent = endValue + suffix;
              clearInterval(timer);
            }
          }, Math.max(stepTime, 20));

          obs.unobserve(target);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => observer.observe(stat));
  }

  // --- 8. GSAP Micro-Animations (Fallback Gracefully if GSAP not loaded) ---
  if (window.gsap) {
    gsap.from('.hero-content h1', { opacity: 0, y: 30, duration: 1, delay: 0.2 });
    gsap.from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8, delay: 0.5 });
    gsap.from('.hero-cta-group', { opacity: 0, y: 20, duration: 0.8, delay: 0.7 });
    gsap.from('.hero-stats-box', { opacity: 0, y: 30, duration: 1, delay: 0.9 });
  }
});
