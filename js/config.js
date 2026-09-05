'use strict';

window.FHD = window.FHD || {};

// Sync maintenance toggle from js/maintenance.js.
(function syncMaintenanceConfig() {
  window.FHD_CONFIG = window.FHD_CONFIG || {};
  var m = window.FHD_MAINTENANCE || {};
  if (typeof m.ENABLED === 'boolean') {
    FHD_CONFIG.MAINTENANCE_MODE = m.ENABLED;
  }
  if (m.MESSAGE) FHD_CONFIG.MAINTENANCE_MESSAGE = m.MESSAGE;
  if (typeof m.ALLOW_PREVIEW === 'boolean') {
    FHD_CONFIG.MAINTENANCE_ALLOW_PREVIEW = m.ALLOW_PREVIEW;
  }
})();

const localHosts = ['localhost', '127.0.0.1'];
const isLocalDevelopment = localHosts.includes(window.location.hostname);

window.FHD_CONFIG = Object.assign({
  API_BASE: isLocalDevelopment ? 'http://localhost:5000/api/v1' : 'https://api.fh-development.xyz/api/v1',
  API_FALLBACK_BASE: 'https://backend-mczn.onrender.com/api/v1',
  SITE_NAME: 'FH Developments',
  SITE_URL: 'https://fh-development.xyz',
  LEGAL_URL: 'https://legal.fh-development.xyz',
  STATUS_URL: 'https://status.fh-development.xyz',
  DOCS_URL: 'https://docs.fh-development.xyz',
  HOSTING_CONTACT_EMAIL: 'hosting@fh-development.xyz',
  LOGO_URL: 'https://cdn.fh-development.xyz/departmental/logos/Real_White_Logo.png',
  FAVICON_URL: 'https://cdn.fh-development.xyz/departmental/logos/Real_White_Logo.png',
  MAINTENANCE_MODE: false,
  MAINTENANCE_MESSAGE: 'We are currently performing scheduled maintenance. Please check back shortly.',
  MAINTENANCE_ALLOW_PREVIEW: true,
  OPTIONAL_APIS: {
    features: false,
    press: false,
    community: false,
    events: false,
    sponsorships: false,
    downloads: false,
  },
}, window.FHD_CONFIG);

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
  return `<span class="fhd-logo-wrap"><img src="${FHD_CONFIG.LOGO_URL}" alt="${FHD.escapeHtml(FHD_CONFIG.SITE_NAME)}" class="${cls}" onerror="this.hidden=true;this.nextElementSibling.hidden=false" /><span class="fhd-logo-fallback" hidden>FH <strong>DEVELOPMENTS</strong></span></span>`;
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
