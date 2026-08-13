'use strict';

window.FHD_CONFIG = {
  API_BASE: 'https://backend-mczn.onrender.com/api/v1',
  SITE_NAME: 'FH Development',
  SITE_URL: 'https://fh-development.xyz',
  LEGAL_URL: 'https://legal.fh-development.xyz',
  STATUS_URL: 'https://status.fh-development.xyz',
  DOCS_URL: 'https://docs.fh-development.xyz',
  LOGO_URL: 'https://cdn.fh-development.xyz/departmental/logos/Real_White_Logo.png',
  FAVICON_URL: 'https://cdn.fh-development.xyz/departmental/logos/Real_White_Logo.png',

  /** Set to true to send all visitors to the maintenance page. */
  MAINTENANCE_MODE: true,
  MAINTENANCE_MESSAGE: 'We are currently performing scheduled maintenance to upgrade our infrastructure. We expect to be back online shortly.',
  /** Append ?preview=1 to any URL to bypass maintenance (saved for the session). */
  MAINTENANCE_ALLOW_PREVIEW: true,

  /**
   * Optional CMS routes on the backend. Set to true when the endpoint exists.
   * While false, the frontend skips the request (no console 404 on GitHub Pages).
   */
  OPTIONAL_APIS: {
    features: false,
    press: false,
    community: false,
    events: false,
    sponsorships: false,
    downloads: false,
  },
};

window.FHD = window.FHD || {};

FHD.getPathPrefix = function () {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/') || path.includes('/auth/')) return '../';
  return './';
};

FHD.pageUrl = function (relative) {
  return FHD.getPathPrefix() + relative;
};

FHD.legalUrl = function (page) {
  const base = FHD_CONFIG.LEGAL_URL.replace(/\/$/, '');
  return base + '/' + page;
};

FHD.docsUrl = function (path) {
  const base = FHD_CONFIG.DOCS_URL.replace(/\/$/, '');
  return path ? base + '/' + String(path).replace(/^\//, '') : base + '/';
};

FHD.logoImg = function (className) {
  const cls = className || 'h-10 w-auto object-contain';
  return `<img src="${FHD_CONFIG.LOGO_URL}" alt="${FHD.escapeHtml(FHD_CONFIG.SITE_NAME)}" class="${cls}" />`;
};

FHD.getQueryParam = function (key) {
  return new URLSearchParams(window.location.search).get(key);
};

FHD.escapeHtml = function (str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
};

FHD.formatDate = function (dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
};

FHD.loadingHtml = function (msg) {
  return `<div class="col-span-full flex flex-col items-center justify-center py-16 text-[#64748B]">
    <div class="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent mb-4"></div>
    <p class="text-sm font-medium">${FHD.escapeHtml(msg || 'Loading...')}</p>
  </div>`;
};

FHD.errorHtml = function (msg) {
  return `<div class="col-span-full text-center py-16">
    <p class="text-red-500 font-medium mb-2">Unable to load content</p>
    <p class="text-[#64748B] text-sm">${FHD.escapeHtml(msg || 'Please try again later.')}</p>
  </div>`;
};

FHD.emptyHtml = function (msg) {
  return `<div class="col-span-full text-center py-16">
    <p class="text-[#64748B] font-medium">${FHD.escapeHtml(msg || 'No items found.')}</p>
  </div>`;
};

FHD.maintenanceUrl = function () {
  const path = window.location.pathname.replace(/\\/g, '/');
  if (path.includes('/pages/') || path.includes('/auth/')) return 'maintenance.html';
  return 'pages/maintenance.html';
};

FHD.checkMaintenance = function () {
  if (!FHD_CONFIG.MAINTENANCE_MODE) return;

  const path = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  if (path.includes('maintenance.html')) return;

  if (FHD_CONFIG.MAINTENANCE_ALLOW_PREVIEW) {
    if (new URLSearchParams(window.location.search).get('preview') === '1') {
      try { sessionStorage.setItem('fhd-maintenance-bypass', '1'); } catch (_) {}
    }
    try {
      if (sessionStorage.getItem('fhd-maintenance-bypass') === '1') return;
    } catch (_) {}
  }

  const target = FHD.maintenanceUrl();
  if (!path.endsWith('/maintenance.html') && !path.endsWith('maintenance.html')) {
    window.location.replace(target);
  }
};

FHD.checkMaintenance();
