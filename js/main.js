'use strict';

// ── Utility ────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ── Announcement Bar ───────────────────────────────────────
(function initAnnouncementBar() {
  const bar = $('#announcement-bar');
  const btn = $('#announcement-close');
  if (!bar || !btn) return;
  if (sessionStorage.getItem('fhd-ann-dismissed')) {
    bar.classList.add('hidden-bar');
    return;
  }
  btn.addEventListener('click', () => {
    bar.classList.add('hidden-bar');
    sessionStorage.setItem('fhd-ann-dismissed', '1');
  });
})();

// ── Sticky Nav + Scroll Shadow ────────────────────────────
(function initNav() {
  const nav = $('#main-nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// ── Dropdown Menus ─────────────────────────────────────────
function initDropdowns() {
  const dropdowns = document.querySelectorAll('.nav-dropdown');
  let activeDropdown = null;

  function closeAll() {
    dropdowns.forEach(d => {
      const menu = d.querySelector('.dropdown-menu');
      if (menu) menu.classList.remove('open');
    });
    activeDropdown = null;
  }

  dropdowns.forEach(dropdown => {
    const trigger = dropdown.querySelector('.nav-link, button.nav-link');
    const menu = dropdown.querySelector('.dropdown-menu');
    if (!trigger || !menu) return;

    trigger.addEventListener('mouseenter', () => {
      closeAll();
      menu.classList.add('open');
      activeDropdown = dropdown;
    });

    dropdown.addEventListener('mouseleave', () => {
      menu.classList.remove('open');
      if (activeDropdown === dropdown) activeDropdown = null;
    });

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('open');
      closeAll();
      if (!isOpen) { menu.classList.add('open'); activeDropdown = dropdown; }
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) closeAll();
  });
}

if (window.FHD) window.FHD.initDropdowns = initDropdowns;

// ── Mobile Menu ────────────────────────────────────────────
function initMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const menu = document.getElementById('mobile-menu');
  const body = document.body;

  if (!menu) return;

  const open = () => {
    menu.style.display = 'block';
    setTimeout(() => menu.classList.add('open'), 10);
    body.style.overflow = 'hidden';
  };
  const close = () => {
    menu.classList.remove('open');
    setTimeout(() => { menu.style.display = 'none'; }, 350);
    body.style.overflow = '';
  };

  openBtn && openBtn.addEventListener('click', open);
  closeBtn && closeBtn.addEventListener('click', close);

  // Close on outside click
  menu.addEventListener('click', (e) => {
    if (e.target === menu) close();
  });

  // Mobile accordion for sub-menus
  menu.querySelectorAll('.mobile-nav-group').forEach(group => {
    const toggle = group.querySelector('.mobile-nav-toggle');
    const submenu = group.querySelector('.mobile-nav-submenu');
    if (!toggle || !submenu) return;

    toggle.addEventListener('click', () => {
      const isOpen = submenu.style.maxHeight;
      menu.querySelectorAll('.mobile-nav-submenu').forEach(m => {
        m.style.maxHeight = null;
        m.style.opacity = 0;
      });
      if (!isOpen) {
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        submenu.style.opacity = 1;
      }
    });

    submenu.style.maxHeight = null;
    submenu.style.overflow = 'hidden';
    submenu.style.transition = 'max-height 0.3s ease, opacity 0.3s ease';
    submenu.style.opacity = 0;
  });
}

if (window.FHD) window.FHD.initMobileMenu = initMobileMenu;

// ── Scroll Reveal (IntersectionObserver) ──────────────────
(function initScrollReveal() {
  const elements = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  elements.forEach(el => observer.observe(el));
})();

// ── Accordion / FAQ ────────────────────────────────────────
window.FHD = window.FHD || {};
FHD.initAccordion = function initAccordion() {
  $$('.accordion-header').forEach(header => {
    if (header.dataset.bound) return;
    header.dataset.bound = '1';
    header.addEventListener('click', () => {
      const body = header.nextElementSibling;
      const isOpen = header.classList.contains('active');
      const container = header.closest('.accordion-container') || document;
      $$('.accordion-header', container).forEach(h => {
        h.classList.remove('active');
        const b = h.nextElementSibling;
        if (b) b.classList.remove('open');
      });
      if (!isOpen) {
        header.classList.add('active');
        if (body) body.classList.add('open');
      }
    });
  });
};
FHD.initAccordion();

// ── Tabs ───────────────────────────────────────────────────
(function initTabs() {
  $$('.tabs-container').forEach(container => {
    const tabs = $$('.tab-btn', container);
    const panels = $$('.tab-panel', container);

    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        panels[i] && panels[i].classList.add('active');
      });
    });

    // Activate first by default
    if (tabs[0]) tabs[0].click();
  });
})();

// ── Testimonial Carousel ───────────────────────────────────
(function initTestimonialCarousel() {
  const carousel = $('#testimonial-carousel');
  if (!carousel) return;

  const track = carousel.querySelector('.carousel-track');
  const items = $$('.carousel-item', carousel);
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');
  const dots = $$('.carousel-dot', carousel);
  if (!track || !items.length) return;

  let current = 0;
  const total = items.length;

  function goTo(idx) {
    current = (idx + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => {
      d.classList.toggle('active', i === current);
    });
  }

  prevBtn && prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn && nextBtn.addEventListener('click', () => goTo(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  // Auto-play
  let interval = setInterval(() => goTo(current + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(interval));
  carousel.addEventListener('mouseleave', () => {
    clearInterval(interval);
    interval = setInterval(() => goTo(current + 1), 5000);
  });

  // Touch swipe
  let startX = 0;
  track.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) goTo(diff > 0 ? current + 1 : current - 1);
  });

  goTo(0);
})();

// ── Search (Static Filter) ─────────────────────────────────
(function initSearch() {
  // Generic search/filter for any list
  $$('[data-search-input]').forEach(input => {
    const targetId = input.dataset.searchInput;
    const target = document.getElementById(targetId);
    if (!target) return;

    const items = $$('[data-search-item]', target);

    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      items.forEach(item => {
        const text = item.textContent.toLowerCase();
        const match = !query || text.includes(query);
        item.style.display = match ? '' : 'none';
        item.closest('[data-search-card]') &&
          (item.closest('[data-search-card]').style.display = match ? '' : 'none');
      });
      updateEmptyState(target, query);
    });
  });

  function updateEmptyState(container, query) {
    let empty = container.querySelector('.search-empty');
    const hasVisible = $$('[data-search-item]', container).some(i => i.style.display !== 'none');
    if (!hasVisible && query) {
      if (!empty) {
        empty = document.createElement('div');
        empty.className = 'search-empty col-span-full text-center py-16';
        empty.innerHTML = `
          <div class="text-5xl mb-4">🔍</div>
          <p class="text-slate-500 font-medium">No results for "<span class="text-blue-600">${query}</span>"</p>
          <p class="text-slate-400 text-sm mt-1">Try a different keyword</p>
        `;
        container.appendChild(empty);
      }
    } else {
      empty && empty.remove();
    }
  }
})();

// ── Category Filter ────────────────────────────────────────
(function initCategoryFilter() {
  $$('[data-filter-group]').forEach(group => {
    const groupId = group.dataset.filterGroup;
    const buttons = $$(`[data-filter="${groupId}"]`);
    const items = $$(`[data-category]`);

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const cat = btn.dataset.filterValue;

        items.forEach(item => {
          const match = cat === 'all' || item.dataset.category === cat;
          item.style.display = match ? '' : 'none';
          item.style.opacity = match ? '1' : '0';
        });
      });
    });
  });
})();

// ── Counter Animation ──────────────────────────────────────
(function initCounters() {
  const counters = $$('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const suffix = el.dataset.counterSuffix || '';
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(update);
      }

      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

// ── Smooth Scroll for Anchor Links ────────────────────────
(function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href').slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const navHeight = $('#main-nav')?.offsetHeight || 72;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

// ── Cookie Banner ──────────────────────────────────────────
(function initCookieBanner() {
  const banner = $('#cookie-banner');
  if (!banner) return;
  if (localStorage.getItem('fhd-cookies-accepted')) return;

  setTimeout(() => banner.classList.add('show'), 1500);

  const acceptBtn = $('#cookie-accept');
  const declineBtn = $('#cookie-decline');

  function dismiss() {
    banner.classList.remove('show');
    setTimeout(() => banner.remove(), 400);
  }

  acceptBtn && acceptBtn.addEventListener('click', () => {
    localStorage.setItem('fhd-cookies-accepted', '1');
    dismiss();
  });
  declineBtn && declineBtn.addEventListener('click', dismiss);
})();

// ── Hero Typewriter (optional) ─────────────────────────────
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;

  const words = el.dataset.words ? el.dataset.words.split('|') : [];
  if (!words.length) return;

  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi % words.length];
    if (deleting) {
      el.textContent = word.substring(0, ci--);
      if (ci < 0) { deleting = false; wi++; setTimeout(type, 500); return; }
    } else {
      el.textContent = word.substring(0, ci++);
      if (ci > word.length) { deleting = true; setTimeout(type, 2000); return; }
    }
    setTimeout(type, deleting ? 60 : 100);
  }
  type();
})();

// ── Copy Code Blocks ───────────────────────────────────────
(function initCodeCopy() {
  $$('.code-block').forEach(block => {
    const copyBtn = document.createElement('button');
    copyBtn.className = 'absolute top-3 right-3 px-3 py-1.5 text-xs font-mono bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-md transition-colors';
    copyBtn.textContent = 'Copy';
    block.style.position = 'relative';
    block.appendChild(copyBtn);

    copyBtn.addEventListener('click', async () => {
      const code = block.querySelector('pre')?.textContent || '';
      try {
        await navigator.clipboard.writeText(code);
        copyBtn.textContent = 'Copied!';
        copyBtn.classList.add('text-green-400');
        setTimeout(() => {
          copyBtn.textContent = 'Copy';
          copyBtn.classList.remove('text-green-400');
        }, 2000);
      } catch { }
    });
  });
})();

// ── Progress Bar on Scroll ─────────────────────────────────
(function initReadingProgress() {
  const bar = document.getElementById('reading-progress');
  if (!bar) return;

  const fill = bar.querySelector('.progress-fill');
  window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
    fill.style.width = pct + '%';
  }, { passive: true });
})();

// ── Form Handling (skip API-wired forms) ───────────────────
(function initForms() {
  const API_FORMS = new Set(['login', 'register', 'contact', 'support', 'forgot', 'reset']);
  $$('form[data-form]').forEach(form => {
    if (API_FORMS.has(form.dataset.form)) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const type = form.dataset.form;
      const btn = form.querySelector('[type="submit"]');
      const original = btn ? btn.textContent : '';

      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending…';
      }

      // Simulate async submission
      setTimeout(() => {
        if (btn) {
          btn.textContent = '✓ Sent!';
          btn.classList.add('bg-green-600');
          setTimeout(() => {
            btn.disabled = false;
            btn.textContent = original;
            btn.classList.remove('bg-green-600');
            form.reset();
          }, 3000);
        }
        // Show success message
        const success = form.querySelector('[data-success]');
        if (success) {
          success.style.display = 'block';
          setTimeout(() => success.style.display = 'none', 4000);
        }
      }, 1200);
    });
  });
})();

// ── Active Nav Link Detection ──────────────────────────────
(function initActiveNavLink() {
  const path = window.location.pathname;
  $$('.nav-link, .sidebar-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && path.endsWith(href)) {
      link.classList.add('active');
    }
  });
})();

// ── Back to Top ────────────────────────────────────────────
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.style.opacity = window.scrollY > 400 ? '1' : '0';
    btn.style.pointerEvents = window.scrollY > 400 ? 'auto' : 'none';
  }, { passive: true });

  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

// ── Table of Contents (Docs) ───────────────────────────────
(function initTOC() {
  const toc = document.getElementById('toc');
  if (!toc) return;

  const headings = $$('h2[id], h3[id]', document.querySelector('.article-body') || document);
  if (!headings.length) return;

  const list = document.createElement('ul');
  list.className = 'space-y-1';

  headings.forEach(h => {
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent;
    a.className = h.tagName === 'H3'
      ? 'sidebar-link pl-6 text-xs'
      : 'sidebar-link text-sm font-semibold';
    li.appendChild(a);
    list.appendChild(li);
  });

  toc.appendChild(list);

  // Active heading highlight
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = toc.querySelector(`a[href="#${id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  }, { rootMargin: '-20% 0% -70% 0%' });

  headings.forEach(h => observer.observe(h));
})();

// ── Notification / Toast ───────────────────────────────────
window.FHD = window.FHD || {};
window.FHD.toast = function (message, type = 'info', duration = 3000) {
  const colors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500'
  };

  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 z-50 px-5 py-3 text-white text-sm font-medium rounded-xl shadow-lg flex items-center gap-3 ${colors[type] || colors.info}`;
  toast.innerHTML = `<span>${message}</span>`;
  toast.style.transform = 'translateY(20px)';
  toast.style.opacity = '0';
  toast.style.transition = 'all 0.3s ease';
  document.body.appendChild(toast);

  setTimeout(() => { toast.style.transform = 'translateY(0)'; toast.style.opacity = '1'; }, 10);
  setTimeout(() => {
    toast.style.transform = 'translateY(20px)';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, duration);
};

// ── API-driven page initialization ─────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  if (window.FHD?.initPage) FHD.initPage();
});

console.log('%c FH Development ', 'background:#2563EB;color:white;font-weight:bold;border-radius:4px;padding:2px 8px;', '| Static site on GitHub Pages · API: ' + (window.FHD_CONFIG?.API_BASE || ''));
