'use strict';

(function () {
  var cfg = window.FHD_MAINTENANCE || {};
  if (!cfg.ENABLED) return;

  try { sessionStorage.removeItem('fhd-maintenance-bypass'); } catch (_) {}

  var path = (location.pathname || '/').replace(/\\/g, '/').toLowerCase();

  // Allow maintenance UI and non-main-site paths
  if (path.indexOf('maintenance.html') !== -1) return;
  if (path.indexOf('/status/') !== -1 || path === '/status' || path.indexOf('/status') === 0) return;
  if (path.indexOf('/tiktok/') !== -1) return;

  if (cfg.ALLOW_PREVIEW && new URLSearchParams(location.search).get('preview') === '1') {
    return;
  }

  var inSubfolder = path.indexOf('/pages/') !== -1 || path.indexOf('/auth/') !== -1;
  var target = inSubfolder ? 'maintenance.html' : 'pages/maintenance.html';

  if (location.href.indexOf(target) === -1) {
    location.replace(target);
  }
})();
