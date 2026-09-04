'use strict';

(function (FHD) {
  const p = () => FHD.getPathPrefix();
  const chev = '<svg class="w-3.5 h-3.5 opacity-60" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg>';

  const NAV = {
    products: {
      label: 'Products',
      items: [
        { href: 'pages/products.html', title: 'All Products', desc: 'Browse the full catalog' },
        { href: 'pages/features.html', title: 'Features', desc: 'Platform capabilities' },
        { href: 'pages/changelog.html', title: 'Changelog', desc: 'Version history' },
        { href: 'pages/downloads.html', title: 'Downloads', desc: 'Files & assets' },
        { href: 'pages/roadmap.html', title: 'Roadmap', desc: 'What we are building next' },
      ],
    },
    services: {
      label: 'Services',
      items: [], // filled from API
      fallback: [
        { href: 'pages/services.html', title: 'All Services', desc: 'View service offerings' },
      ],
    },
    company: {
      label: 'Company',
      items: [
        { href: 'pages/company.html', title: 'About Us', desc: 'Mission, vision & values' },
        { href: 'pages/team.html', title: 'Team', desc: 'Meet the people behind FH' },
        { href: 'pages/careers.html', title: 'Careers', desc: 'Open roles & applications' },
        { href: 'pages/network.html', title: 'Network', desc: 'Partners & subsidiaries' },
        { href: 'pages/partnerships.html', title: 'Partnerships', desc: 'Partner directory' },
        { href: 'pages/subsidiaries.html', title: 'Subsidiaries', desc: 'Company structure' },
        { href: 'pages/reviews.html', title: 'Reviews', desc: 'Customer testimonials' },
        { href: 'pages/press.html', title: 'Press & Media', desc: 'News & media kit' },
        { href: 'pages/contact.html', title: 'Contact', desc: 'Get in touch' },
      ],
    },
    resources: {
      label: 'Resources',
      items: [
        { href: 'pages/resources.html', title: 'Resource Hub', desc: 'All learning resources' },
        { href: 'pages/blog.html', title: 'Blog', desc: 'Posts & announcements' },
        { href: FHD_CONFIG.DOCS_URL, title: 'Documentation', desc: 'Guides & references', external: true },
        { href: 'pages/faq.html', title: 'FAQ', desc: 'Common questions' },
        { href: 'pages/community.html', title: 'Community', desc: 'Creator community hub' },
        { href: 'pages/hosting.html', title: 'Code Hosting', desc: 'Backend hosting plans' },
        { href: 'pages/events.html', title: 'Events', desc: 'Upcoming events' },
        { href: 'pages/sponsorships.html', title: 'Sponsorships', desc: 'Sponsors & opportunities' },
      ],
    },
    support: {
      label: 'Support',
      items: [
        { href: 'pages/support.html', title: 'Support Hub', desc: 'Help & ticket creation' },
        { href: 'pages/faq.html', title: 'FAQ', desc: 'Quick answers' },
        { href: FHD_CONFIG.DOCS_URL, title: 'Documentation', desc: 'Setup guides', external: true },
        { href: 'pages/contact.html', title: 'Contact Us', desc: 'Email our team' },
        { href: FHD_CONFIG.STATUS_URL, title: 'System Status', desc: 'Live service health', external: true },
      ],
    },
  };

  function dropdownItem(item) {
    const href = item.external ? item.href : p() + item.href;
    const ext = item.external ? ' target="_blank" rel="noopener"' : '';
    return `<a href="${href}"${ext} class="dropdown-item">
      <div class="dropdown-icon"><span class="font-display font-bold text-primary text-xs">${FHD.escapeHtml(item.title.charAt(0))}</span></div>
      <div><div class="dropdown-item-title">${FHD.escapeHtml(item.title)}</div><div class="dropdown-item-desc">${FHD.escapeHtml(item.desc)}</div></div>
    </a>`;
  }

  function dropdown(key, extra) {
    const section = NAV[key];
    const items = section.items.length ? section.items : (section.fallback || []);
    const grid = key === 'products'
      ? `<div id="nav-products-menu" class="grid grid-cols-2 gap-1">${items.map(dropdownItem).join('')}</div>`
      : key === 'services'
        ? `<div id="nav-services-menu" class="grid grid-cols-2 gap-1"><div class="col-span-2 px-3 py-2 text-xs text-[#64748B]">Loading services...</div></div>`
        : `<div class="grid grid-cols-1 gap-1">${items.map(dropdownItem).join('')}</div>`;
    const active = extra === key ? ' text-primary font-semibold' : '';
    return `<div class="nav-dropdown">
      <button class="nav-link px-3 py-2 rounded-lg${active}" type="button">${section.label} ${chev}</button>
      <div class="dropdown-menu" style="min-width:${key === 'products' || key === 'services' ? '520px' : '320px'};">
        <p class="sidebar-category mb-2">${section.label}</p>
        ${grid}
        ${key === 'products' ? `<div class="mt-3 pt-3 border-t border-[#E2E8F0]"><a href="${p()}pages/products.html" class="btn-ghost text-xs">View all products →</a></div>` : ''}
        ${key === 'services' ? `<div class="mt-3 pt-3 border-t border-[#E2E8F0]"><a href="${p()}pages/services.html" class="btn-ghost text-xs">View all services →</a></div>` : ''}
      </div>
    </div>`;
  }

  function mobileGroup(key) {
    const section = NAV[key];
    const items = section.items.length ? section.items : (section.fallback || []);
    return `<div class="mobile-nav-group">
      <button class="mobile-nav-toggle w-full flex items-center justify-between px-4 py-3 rounded-xl text-[#0F172A] font-semibold text-sm hover:bg-[#F8FAFC]" type="button">
        ${section.label} ${chev}
      </button>
      <div class="mobile-nav-submenu pl-4 space-y-1">
        ${items.map(i => {
          const href = i.external ? i.href : p() + i.href;
          return `<a href="${href}" class="block px-4 py-2 text-sm text-[#475569] hover:text-primary rounded-lg">${FHD.escapeHtml(i.title)}</a>`;
        }).join('')}
        ${key === 'products' ? `<div id="mobile-products-links"></div>` : ''}
        ${key === 'services' ? `<div id="mobile-services-links"></div>` : ''}
      </div>
    </div>`;
  }

  FHD.renderNav = function (active) {
    const mount = document.getElementById('fhd-nav');
    if (!mount) return;
    const homeActive = active === 'home' ? ' text-primary font-semibold' : '';
    mount.innerHTML = `
<nav id="main-nav" class="sticky top-0 z-50 bg-white border-b border-[#E2E8F0]">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">
    <a href="${p()}index.html" class="flex items-center flex-shrink-0">
      ${FHD.logoImg('h-10 w-auto object-contain')}
    </a>
    <div class="hidden lg:flex items-center gap-1">
      <a href="${p()}index.html" class="nav-link px-3 py-2 rounded-lg${homeActive}">Home</a>
      ${dropdown('products', active)}
      ${dropdown('services', active)}
      ${dropdown('company', active)}
      ${dropdown('resources', active)}
      ${dropdown('support', active)}
    </div>
    <div class="hidden lg:flex items-center gap-3 flex-shrink-0">
      <a href="${p()}pages/search.html" class="w-9 h-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#64748B] hover:text-primary hover:border-primary hover:bg-[#EFF6FF] transition-all" aria-label="Search">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35"/></svg>
      </a>
      <a href="${p()}auth/login.html" class="btn-secondary text-sm py-2 px-4">Sign In</a>
      <a href="${p()}pages/contact.html" class="btn-primary text-sm py-2 px-4">Get Started</a>
    </div>
    <button id="mobile-menu-open" class="lg:hidden w-9 h-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center text-[#475569]" aria-label="Open menu" type="button">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/></svg>
    </button>
  </div>
</nav>
<div id="mobile-menu" aria-label="Mobile navigation">
  <div class="flex items-center justify-between mb-8">
    <a href="${p()}index.html" class="flex items-center">
      ${FHD.logoImg('h-10 w-auto object-contain')}
    </a>
    <button id="mobile-menu-close" class="w-9 h-9 rounded-lg border border-[#E2E8F0] flex items-center justify-center" type="button" aria-label="Close menu">
      <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
    </button>
  </div>
  <nav class="space-y-1">
    <a href="${p()}index.html" class="block px-4 py-3 rounded-xl text-sm font-semibold ${active === 'home' ? 'text-primary bg-[#EFF6FF]' : 'text-[#0F172A] hover:bg-[#F8FAFC]'}">Home</a>
    ${mobileGroup('products')}
    ${mobileGroup('services')}
    ${mobileGroup('company')}
    ${mobileGroup('resources')}
    ${mobileGroup('support')}
  </nav>
  <div class="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col gap-3">
    <a href="${p()}auth/login.html" class="btn-secondary text-center justify-center">Sign In</a>
    <a href="${p()}pages/contact.html" class="btn-primary text-center justify-center">Get Started →</a>
  </div>
</div>`;
  };

  FHD.loadNavServices = async function () {
    const menu = document.getElementById('nav-services-menu');
    const mobile = document.getElementById('mobile-services-links');
    if (!menu && !mobile) return;
    try {
      const data = await FHD.api.getServices();
      const list = FHD.api.unwrapList(data).slice(0, 6);
      const html = list.length
        ? list.map(s => dropdownItem({ href: `pages/service.html?slug=${encodeURIComponent(s.slug)}`, title: s.name, desc: s.tagline || s.description || '' })).join('')
        : NAV.services.fallback.map(dropdownItem).join('');
      if (menu) menu.innerHTML = html;
      if (mobile) mobile.innerHTML = list.map(s =>
        `<a href="${p()}pages/service.html?slug=${encodeURIComponent(s.slug)}" class="block px-4 py-2 text-sm text-[#475569] hover:text-primary rounded-lg">${FHD.escapeHtml(s.name)}</a>`
      ).join('');
    } catch {
      if (menu) menu.innerHTML = NAV.services.fallback.map(dropdownItem).join('');
    }
  };

  FHD.initNav = function () {
    const mount = document.getElementById('fhd-nav');
    if (!mount) return;
    FHD.renderNav(mount.dataset.active || '');
    // Init nav interactive behavior AFTER the HTML has been injected
    if (FHD.initDropdowns) FHD.initDropdowns();
    if (FHD.initMobileMenu) FHD.initMobileMenu();
    FHD.loadNavProducts?.();
    FHD.loadNavServices?.();
  };
})(window.FHD);
