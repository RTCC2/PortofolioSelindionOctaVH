/* ═══════════════════════════════════════════════════
   PORTFOLIO — script.js
   Features:
   - Sticky nav + active link on scroll
   - Mobile hamburger menu
   - Cursor glow effect
   - Scroll reveal animations
   - Skill bar animation
   - Portfolio filter
   - Typed role text animation
   - Contact form (with EmailJS or Formspree ready)
   - Current year in footer
═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ──────────────────────────────────────
     1. CURSOR GLOW
  ────────────────────────────────────── */
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow) {
    document.addEventListener('mousemove', e => {
      cursorGlow.style.left = e.clientX + 'px';
      cursorGlow.style.top  = e.clientY + 'px';
    });
  }

  /* ──────────────────────────────────────
     2. NAVBAR — scroll + active links
  ────────────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const navItems = document.querySelectorAll('.nav__item[data-section]');
  const sections = document.querySelectorAll('section[id]');

  function updateNav() {
    // Sticky shadow
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link based on scroll position
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });

    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });

    // Sync drawer active links too
    document.querySelectorAll('.nav__drawer-item[data-section]').forEach(item => {
      item.classList.toggle('active', item.dataset.section === current);
    });
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ──────────────────────────────────────
     3. MOBILE SIDEBAR DRAWER
  ────────────────────────────────────── */
  const burger      = document.getElementById('burger');
  const navDrawer   = document.getElementById('navDrawer');
  const navOverlay  = document.getElementById('navOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    burger.classList.add('open');
  }
  function closeDrawer() {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    document.body.style.overflow = '';
    burger.classList.remove('open');
  }

  if (burger) burger.addEventListener('click', openDrawer);
  if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
  if (navOverlay) navOverlay.addEventListener('click', closeDrawer);

  // Close drawer when a link inside is clicked
  if (navDrawer) {
    navDrawer.querySelectorAll('.nav__drawer-item').forEach(link => {
      link.addEventListener('click', closeDrawer);
    });
  }

  /* ──────────────────────────────────────
     4. SCROLL REVEAL ANIMATION
  ────────────────────────────────────── */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger items in same container
          const siblings = entry.target.parentElement.querySelectorAll('.reveal:not(.visible)');
          siblings.forEach((el, idx) => {
            setTimeout(() => el.classList.add('visible'), idx * 80);
          });
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

  /* ──────────────────────────────────────
     5. SKILL BAR ANIMATION
  ────────────────────────────────────── */
  const skillBarObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const fills = entry.target.querySelectorAll('.skill-bar-item__fill');
          fills.forEach(fill => {
            const width = fill.getAttribute('data-width') || '0';
            setTimeout(() => {
              fill.style.width = width + '%';
            }, 200);
          });
          skillBarObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  const skillsBlock = document.querySelector('.skills-bar-list');
  if (skillsBlock) skillBarObserver.observe(skillsBlock.closest('.skills-block'));

  /* ──────────────────────────────────────
     6. TYPED ROLE ANIMATION
  ────────────────────────────────────── */
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    const roles = [
      'Water Construction Engineering Student',
      'Leadership Management',
      'Problem Solver',
      'Analitis',
    ];
    let roleIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let pauseTimer = null;

    function typeRole() {
      const currentRole = roles[roleIdx];

      if (!deleting) {
        // Typing
        typedEl.textContent = currentRole.slice(0, charIdx + 1);
        charIdx++;
        if (charIdx === currentRole.length) {
          // Pause before deleting
          deleting = true;
          pauseTimer = setTimeout(typeRole, 2200);
          return;
        }
        setTimeout(typeRole, 90);
      } else {
        // Deleting
        typedEl.textContent = currentRole.slice(0, charIdx - 1);
        charIdx--;
        if (charIdx === 0) {
          deleting = false;
          roleIdx = (roleIdx + 1) % roles.length;
          setTimeout(typeRole, 400);
          return;
        }
        setTimeout(typeRole, 50);
      }
    }

    // Add cursor blink via CSS
    typedEl.style.borderRight = '2px solid var(--gold)';
    typedEl.style.paddingRight = '3px';
    typedEl.style.animation = 'blink 0.8s step-end infinite';

    // Inject blink keyframe if not already added
    if (!document.getElementById('blink-style')) {
      const style = document.createElement('style');
      style.id = 'blink-style';
      style.textContent = `
        @keyframes blink {
          0%, 100% { border-color: var(--gold); }
          50%       { border-color: transparent; }
        }
      `;
      document.head.appendChild(style);
    }

    setTimeout(typeRole, 800);
  }

  /* ──────────────────────────────────────
     7. PORTFOLIO FILTER
  ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card[data-category]');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('filter-btn--active'));
      btn.classList.add('filter-btn--active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = '';
          setTimeout(() => card.classList.remove('hidden'), 10);
        } else {
          card.classList.add('hidden');
          card.style.display = 'none';
        }
      });
    });
  });

  /* ──────────────────────────────────────
     8. CONTACT FORM
  ────────────────────────────────────── */
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');
  const submitBtn   = document.getElementById('submitBtn');

  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const required = contactForm.querySelectorAll('[required]');
      let valid = true;
      required.forEach(field => {
        if (!field.value.trim()) {
          field.style.borderColor = '#e55353';
          valid = false;
          setTimeout(() => { field.style.borderColor = ''; }, 3000);
        }
      });
      if (!valid) return;

      // Loading state
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<span>Mengirim...</span>';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      // Kirim ke Formspree
      try {
        const formData = new FormData(contactForm);
        const response = await fetch('https://formspree.io/f/myklykrp', {
          method: 'POST',
          body: formData,
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          showSuccess();
        } else {
          resetBtn();
          alert('Gagal mengirim. Coba lagi ya!');
        }
      } catch (err) {
        // Demo mode jika tidak ada koneksi
        showSuccess();
      }

      function showSuccess() {
        contactForm.reset();
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
        // Tampilkan notif sukses — akan hilang otomatis saat refresh
        if (formSuccess) {
          formSuccess.classList.add('show');
          // Hilang sendiri setelah 5 detik
          setTimeout(() => formSuccess.classList.remove('show'), 5000);
        }
      }

      function resetBtn() {
        submitBtn.innerHTML = originalHTML;
        submitBtn.disabled = false;
        submitBtn.style.opacity = '';
      }
    });

    // Clear error highlight on input
    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '';
      });
    });
  }

  /* ──────────────────────────────────────
     8b. DARK / LIGHT MODE TOGGLE
  ────────────────────────────────────── */
  const themeToggle       = document.getElementById('themeToggle');
  const themeIcon         = document.getElementById('themeIcon');
  const themeToggleMobile = document.getElementById('themeToggleMobile');
  const themeIconMobile   = document.getElementById('themeIconMobile');

  function applyTheme(isDark) {
    document.body.classList.toggle('dark-mode', isDark);
    const icon = isDark ? '☀️' : '🌙';
    if (themeIcon) themeIcon.textContent = icon;
    if (themeIconMobile) themeIconMobile.textContent = icon;
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }

  // Load saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') applyTheme(true);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }
  if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => {
      applyTheme(!document.body.classList.contains('dark-mode'));
    });
  }

  /* ──────────────────────────────────────
     9. CURRENT YEAR IN FOOTER
  ────────────────────────────────────── */
  const yearEl = document.getElementById('currentYear');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ──────────────────────────────────────
     10. SMOOTH SCROLL untuk browser lama
  ────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const top = target.offsetTop - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ──────────────────────────────────────
     11. PHOTO: auto-show placeholder
         jika gambar gagal load
  ────────────────────────────────────── */
  document.querySelectorAll('.project-card__visual img').forEach(img => {
    img.addEventListener('error', function () {
      this.parentElement.classList.add('no-img');
    });
    // Trigger for already-broken cached images
    if (img.complete && img.naturalWidth === 0) {
      img.parentElement.classList.add('no-img');
    }
  });

});
