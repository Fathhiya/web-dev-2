const PAGE = document.body.dataset.page;

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initTheme();
  initHeader();
  initMobileNav();
  initScrollReveal();
  initPageTransition();
  generateParticles();

  if (PAGE === 'home')         initHome();
  if (PAGE === 'packages')    initPackages();
  if (PAGE === 'login')       initLogin();
  if (PAGE === 'booking')     initBooking();
  if (PAGE === 'register')    initRegister();
  if (PAGE === 'confirmation') initConfirmation();

  updateNavAuth();
});

function updateNavAuth() {
  const user = localStorage.getItem('holidae-user');
  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    const text = a.textContent.trim().toLowerCase();
    if (href === 'login.html' || text === 'sign in') {
      if (user) {
        a.textContent = 'Sign Out';
        a.href = '#';
        a.addEventListener('click', e => { e.preventDefault(); logout(); });
      }
    }
  });
}

function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });
  setTimeout(() => loader && loader.classList.add('hidden'), 3000);
}

function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot = document.createElement('div');
  dot.className = 'cursor';
  const ring = document.createElement('div');
  ring.className = 'cursor-follower';
  document.body.append(dot, ring);

  let mx = -100, my = -100;
  let rx = -100, ry = -100;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });


  function followCursor() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(followCursor);
  }
  followCursor();

  document.querySelectorAll('a, button, .pkg-card, .dest-card, .filter-btn, .pkg-option').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });
}

function initTheme() {
  const saved = localStorage.getItem('holidae-theme') || 'dark';
  if (saved === 'light') document.body.classList.add('light');

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      document.body.classList.toggle('light');
      localStorage.setItem('holidae-theme', document.body.classList.contains('light') ? 'light' : 'dark');
    });
  });
}

function initHeader() {
  const header = document.querySelector('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  document.querySelectorAll('nav a, .mobile-nav a').forEach(a => {
    if (a.href === location.href || a.href === location.pathname) {
      a.classList.add('active');
    }
  });
}

function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (!hamburger || !mobileNav) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open');
    document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '';
  });

  mobileNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

function initPageTransition() {
  document.body.style.opacity = '0';
  requestAnimationFrame(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  });

  document.addEventListener('click', e => {
    const link = e.target.closest('a');
    if (!link) return;
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;
    if (link.target === '_blank') return;

    e.preventDefault();
    document.body.style.opacity = '0';
    setTimeout(() => window.location.href = href, 450);
  });
}

function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function generateParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;

  for (let i = 0; i < 28; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.cssText = `
      left: ${Math.random() * 100}%;
      width: ${Math.random() * 3 + 1}px;
      height: ${Math.random() * 3 + 1}px;
      animation-duration: ${Math.random() * 12 + 8}s;
      animation-delay: ${Math.random() * 10}s;
      opacity: ${Math.random() * 0.7};
    `;
    container.appendChild(p);
  }
}

function init3DTilt(selector) {
  document.querySelectorAll(selector).forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const rotX = -dy * 6; // degrees
      const rotY =  dx * 6;
      card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

function initHome() {
  init3DTilt('.dest-card');

  window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero-content');
    if (!hero) return;
    const offset = window.scrollY * 0.3;
    hero.style.transform = `translateY(${offset}px)`;
  }, { passive: true });

  document.querySelectorAll('.hero-stat-num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count, 10);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      el.textContent = current.toLocaleString() + (el.dataset.suffix || '');
      if (current >= target) clearInterval(timer);
    }, 30);
  });
}

function initPackages() {
  init3DTilt('.pkg-card');

  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards      = document.querySelectorAll('.pkg-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const matches = filter === 'all' || card.dataset.category === filter;
        if (matches) {
          card.classList.remove('hidden');
          const idx = [...cards].filter(c => c.dataset.category === filter || filter === 'all').indexOf(card);
          card.style.transitionDelay = `${idx * 0.07}s`;
        } else {
          card.classList.add('hidden');
          card.style.transitionDelay = '0s';
        }
      });
    });
  });
  document.querySelectorAll('.pkg-book-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const pkg = btn.closest('.pkg-card').dataset.category;
      const name = btn.closest('.pkg-card').querySelector('.pkg-name').textContent;
      const price = btn.closest('.pkg-card').querySelector('.pkg-price').textContent;
      sessionStorage.setItem('selected-pkg', JSON.stringify({ category: pkg, name, price }));
      navigateTo('booking.html');
    });
  });
}

function initLogin() {
  const form   = document.getElementById('login-form');
  const alertEl = document.getElementById('auth-alert');
  const btn    = document.getElementById('login-btn');
  if (!form) return;
  const DEMO_USERS = [
    { email: 'guest@holidae.com', password: 'holiday123', name: 'Guest Traveller' },
    { email: 'admin@holidae.com', password: 'admin2024',  name: 'Admin User'      },
  ];

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const email    = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    let   valid    = true;

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showFieldError('email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!password || password.length < 6) {
      showFieldError('password', 'Password must be at least 6 characters.');
      valid = false;
    }
    if (!valid) return;

    setButtonLoading(btn, true);

    setTimeout(() => {
      const registered = JSON.parse(localStorage.getItem('holidae-registered-users') || '[]');
      const allUsers   = [...DEMO_USERS, ...registered];
      const user = allUsers.find(u => u.email.toLowerCase() === email && u.password === password);

      if (user) {
        localStorage.setItem('holidae-user', JSON.stringify({ email: user.email, name: user.name }));
        showAlert('Login successful! Redirecting…', 'success');
        setTimeout(() => {
          const redirect = sessionStorage.getItem('booking-redirect');
          sessionStorage.removeItem('booking-redirect');
          window.location.href = redirect ? 'booking.html' : 'index.html';
        }, 900);
      } else {
        showAlert('Incorrect email or password. Try the demo credentials below.', 'error');
        setButtonLoading(btn, false);
      }
    }, 1200);
  });

  function showAlert(msg, type) {
    alertEl.textContent = msg;
    alertEl.className = `auth-alert ${type}`;
  }
  function clearErrors() {
    document.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));
    alertEl.className = 'auth-alert';
    alertEl.textContent = '';
  }
  function showFieldError(id, msg) {
    const field = document.getElementById(id)?.closest('.form-field');
    if (!field) return;
    field.classList.add('has-error');
    const errEl = field.querySelector('.field-error');
    if (errEl) errEl.textContent = msg;
  }
}

function initRegister() {
  const form    = document.getElementById('register-form');
  const alertEl = document.getElementById('auth-alert');
  const btn     = document.getElementById('register-btn');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    const name     = document.getElementById('reg-name').value.trim();
    const email    = document.getElementById('reg-email').value.trim().toLowerCase();
    const password = document.getElementById('reg-password').value;
    const confirm  = document.getElementById('reg-confirm').value;
    let   valid    = true;

    if (!name || name.length < 2) {
      showFieldError('reg-name', 'Please enter your full name (at least 2 characters).');
      valid = false;
    }
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      showFieldError('reg-email', 'Please enter a valid email address.');
      valid = false;
    }
    if (!password || password.length < 6) {
      showFieldError('reg-password', 'Password must be at least 6 characters.');
      valid = false;
    }
    if (password !== confirm) {
      showFieldError('reg-confirm', 'Passwords do not match.');
      valid = false;
    }
    if (!valid) return;

    const existing = JSON.parse(localStorage.getItem('holidae-registered-users') || '[]');
    const DEMO = [
      { email: 'guest@holidae.com' },
      { email: 'admin@holidae.com' },
    ];
    const allEmails = [...DEMO, ...existing].map(u => u.email.toLowerCase());
    if (allEmails.includes(email)) {
      showAlert('An account with this email already exists. Please sign in.', 'error');
      return;
    }

    setButtonLoading(btn, true);

    setTimeout(() => {

      const newUser = { name, email, password };
      existing.push(newUser);
      localStorage.setItem('holidae-registered-users', JSON.stringify(existing));

      localStorage.setItem('holidae-user', JSON.stringify({ email, name }));

      showAlert('Account created! Redirecting you now…', 'success');
      setTimeout(() => { window.location.href = 'index.html'; }, 1000);
    }, 1000);
  });

  function showAlert(msg, type) {
    alertEl.textContent = msg;
    alertEl.className = `auth-alert ${type}`;
  }
  function clearErrors() {
    document.querySelectorAll('.form-field').forEach(f => f.classList.remove('has-error'));
    alertEl.className = 'auth-alert';
    alertEl.textContent = '';
  }
  function showFieldError(id, msg) {
    const field = document.getElementById(id)?.closest('.form-field');
    if (!field) return;
    field.classList.add('has-error');
    const errEl = field.querySelector('.field-error');
    if (errEl) errEl.textContent = msg;
    else {
      const p = document.createElement('p');
      p.className = 'field-error';
      p.style.display = 'block';
      p.textContent = msg;
      field.appendChild(p);
    }
  }
}

function initBooking() {
  const userData = localStorage.getItem('holidae-user');
  if (!userData) {
    sessionStorage.setItem('booking-redirect', '1');
    window.location.href = 'login.html';
    return;
  }

  const user = JSON.parse(userData);
  const nameInput = document.getElementById('full-name');
  if (nameInput) nameInput.value = user.name;
  const savedPkg = sessionStorage.getItem('selected-pkg');
  if (savedPkg) {
    const pkg = JSON.parse(savedPkg);
    const option = document.querySelector(`.pkg-option[data-cat="${pkg.category}"]`);
    if (option) option.click();
  }

  const pkgOptions = document.querySelectorAll('.pkg-option');
  let selectedPkg = { name: 'Summer Escape', price: 1299, category: 'summer' };

  pkgOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      pkgOptions.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      selectedPkg = {
        name:     opt.dataset.name,
        price:    parseInt(opt.dataset.price, 10),
        category: opt.dataset.cat,
      };
      updateSummary();
    });
  });

  let guests = 2;
  const countEl = document.getElementById('guests-count');
  document.getElementById('guests-minus').addEventListener('click', () => {
    if (guests > 1) { guests--; countEl.textContent = guests; updateSummary(); }
  });
  document.getElementById('guests-plus').addEventListener('click', () => {
    if (guests < 10) { guests++; countEl.textContent = guests; updateSummary(); }
  });

  function updateSummary() {
    const total = selectedPkg.price * guests;
    const destEl = document.getElementById('summary-dest');
    const dateEl = document.getElementById('summary-date');
    const pkgEl  = document.getElementById('summary-pkg');
    const gEl    = document.getElementById('summary-guests');
    const tEl    = document.getElementById('summary-total');

    if (destEl) destEl.textContent = document.getElementById('destination').value || '—';
    if (dateEl) {
      const d = document.getElementById('travel-date').value;
      dateEl.textContent = d ? new Date(d).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '—';
    }
    if (pkgEl)  pkgEl.textContent  = selectedPkg.name;
    if (gEl)    gEl.textContent    = guests + (guests === 1 ? ' Traveller' : ' Travellers');
    if (tEl)    tEl.textContent    = '$' + total.toLocaleString();
  }

  document.getElementById('destination')?.addEventListener('input', updateSummary);
  document.getElementById('travel-date')?.addEventListener('change', updateSummary);

  pkgOptions[0]?.classList.add('selected');
  updateSummary();

  const form = document.getElementById('booking-form');
  const btn  = document.getElementById('booking-btn');

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearBookingErrors();
    let valid = true;

    const name  = document.getElementById('full-name').value.trim();
    const dest  = document.getElementById('destination').value.trim();
    const date  = document.getElementById('travel-date').value;

    if (!name)  { showBError('full-name', 'Please enter your full name.');     valid = false; }
    if (!dest)  { showBError('destination', 'Please select a destination.');   valid = false; }
    if (!date)  { showBError('travel-date', 'Please choose a travel date.');   valid = false; }
    if (date && new Date(date) <= new Date()) {
      showBError('travel-date', 'Travel date must be in the future.');
      valid = false;
    }

    if (!valid) return;

    setButtonLoading(btn, true);

    const ref = 'HLD-' + Math.random().toString(36).substr(2,6).toUpperCase();

    const booking = {
      ref,
      name,
      destination: dest,
      date,
      package: selectedPkg.name,
      category: selectedPkg.category,
      guests,
      total: selectedPkg.price * guests,
      bookedAt: new Date().toISOString(),
    };
    localStorage.setItem('holidae-booking', JSON.stringify(booking));

    setTimeout(() => { window.location.href = 'confirmation.html'; }, 1200);
  });

  function showBError(id, msg) {
    const el    = document.getElementById(id);
    const field = el.closest('.form-field');
    field.classList.add('has-error');
    let err = field.querySelector('.field-error');
    if (!err) {
      err = document.createElement('p');
      err.className = 'field-error';
      field.appendChild(err);
    }
    err.textContent = msg;
    err.style.display = 'block';
  }
  function clearBookingErrors() {
    document.querySelectorAll('.form-field.has-error').forEach(f => {
      f.classList.remove('has-error');
      const e = f.querySelector('.field-error');
      if (e) e.style.display = 'none';
    });
  }
}

function initConfirmation() {
  const booking = JSON.parse(localStorage.getItem('holidae-booking') || '{}');
  const user    = JSON.parse(localStorage.getItem('holidae-user') || '{}');

  const set = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val || '—';
  };

  set('conf-ref',   booking.ref);
  set('conf-name',  booking.name || user.name);
  set('conf-dest',  booking.destination);
  set('conf-date',  booking.date ? new Date(booking.date).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : '—');
  set('conf-pkg',   booking.package);
  set('conf-guests', booking.guests ? booking.guests + (booking.guests === 1 ? ' Traveller' : ' Travellers') : '—');
  set('conf-total', booking.total ? '$' + Number(booking.total).toLocaleString() : '—');

  launchConfetti();

  document.getElementById('back-home-btn')?.addEventListener('click', () => {
    localStorage.removeItem('holidae-booking');
    sessionStorage.removeItem('selected-pkg');
  });
}

function launchConfetti() {
  const colors = ['#c9a96e', '#e8c98a', '#6ec9a9', '#f5f0e8', '#7ec8f5'];
  const container = document.querySelector('.confirmation-card') || document.body;

  for (let i = 0; i < 60; i++) {
    const piece = document.createElement('div');
    piece.className = 'confetti-piece';
    piece.style.cssText = `
      left: ${Math.random() * 100}%;
      top: -10px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      width: ${Math.random() * 10 + 4}px;
      height: ${Math.random() * 10 + 4}px;
      animation-duration: ${Math.random() * 2 + 2}s;
      animation-delay: ${Math.random() * 1.5}s;
    `;
    container.appendChild(piece);

    piece.addEventListener('animationend', () => piece.remove());
  }
}

function setButtonLoading(btn, loading) {
  if (!btn) return;
  btn.classList.toggle('loading', loading);
  btn.disabled = loading;
}

function navigateTo(href) {
  document.body.style.opacity = '0';
  setTimeout(() => window.location.href = href, 400);
}

function logout() {
  localStorage.removeItem('holidae-user');
  localStorage.removeItem('holidae-booking');
  navigateTo('index.html');
}

const filterButtons = document.querySelectorAll(".filter-btn");
const cards = document.querySelectorAll(".pkg-card");

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {

    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const filter = btn.getAttribute("data-filter");

    cards.forEach((card) => {
      const category = card.getAttribute("data-category");

      if (filter === "all") {
        card.classList.remove("hidden");
      } 
      else if (category === filter) {
        card.classList.remove("hidden");
      } 
      else {
        card.classList.add("hidden");
      }
    });
  });
});

window.logout = logout;