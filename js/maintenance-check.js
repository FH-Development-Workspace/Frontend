'use strict';

(function () {
  var cfg = window.FHD_MAINTENANCE || {};
  if (!cfg.ENABLED) return;

  var path = (location.pathname || '/').replace(/\\/g, '/').toLowerCase();

  if (path.indexOf('maintenance.html') !== -1) return;
  if (path.indexOf('/status/') !== -1 || path === '/status' || path.indexOf('/status') === 0) return;
  if (path.indexOf('/tiktok/') !== -1) return;

  function authorized() {
    if (window.FHD && FHD.preview && FHD.preview.isAuthorized()) return true;
    try {
      var c = window.FHD_MAINTENANCE || {};
      if (!c.ALLOW_PREVIEW || !c.PREVIEW_PASSWORD) return false;
      var s = String(c.PREVIEW_PASSWORD);
      var h = 0;
      for (var i = 0; i < s.length; i++) {
        h = ((h << 5) - h) + s.charCodeAt(i);
        h |= 0;
      }
      return sessionStorage.getItem('fhd-preview-auth') === ('fhd-' + (h >>> 0).toString(16));
    } catch (_) {
      return false;
    }
  }

  if (cfg.ALLOW_PREVIEW && authorized()) return;

  var params = new URLSearchParams(location.search);
  if (params.get('preview') === '1' || params.get('preview') === 'login') {
    var inSub = path.indexOf('/pages/') !== -1 || path.indexOf('/auth/') !== -1;
    var maint = inSub ? 'maintenance.html?preview=login' : 'pages/maintenance.html?preview=login';
    location.replace(maint);
    return;
  }

  var inSubfolder = path.indexOf('/pages/') !== -1 || path.indexOf('/auth/') !== -1;
  var target = inSubfolder ? 'maintenance.html' : 'pages/maintenance.html';

  if (location.href.indexOf(target) === -1) {
    location.replace(target);
  }
})();
