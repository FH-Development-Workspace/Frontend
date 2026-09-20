'use strict';

(function (FHD) {
  var STORAGE_KEY = 'fhd-preview-auth';
  var cfg = function () { return window.FHD_MAINTENANCE || {}; };

  function pathPrefix() {
    var path = (location.pathname || '/').replace(/\\/g, '/');
    return (path.indexOf('/pages/') !== -1 || path.indexOf('/auth/') !== -1) ? '../' : './';
  }

  function expectedToken() {
    var c = cfg();
    if (c.PREVIEW_TOKEN) return c.PREVIEW_TOKEN;
    if (!c.PREVIEW_PASSWORD) return '';
    var s = String(c.PREVIEW_PASSWORD);
    var h = 0;
    for (var i = 0; i < s.length; i++) {
      h = ((h << 5) - h) + s.charCodeAt(i);
      h |= 0;
    }
    return 'fhd-' + (h >>> 0).toString(16);
  }

  function isAuthorized() {
    if (!cfg().ALLOW_PREVIEW) return false;
    try {
      return sessionStorage.getItem(STORAGE_KEY) === expectedToken();
    } catch (_) {
      return false;
    }
  }

  function unlock(password) {
    if (String(password) === String(cfg().PREVIEW_PASSWORD || '')) {
      try { sessionStorage.setItem(STORAGE_KEY, expectedToken()); } catch (_) {}
      return true;
    }
    return false;
  }

  function lock() {
    try { sessionStorage.removeItem(STORAGE_KEY); } catch (_) {}
    location.replace(pathPrefix() + 'pages/maintenance.html');
  }

  function cleanPreviewParam() {
    try {
      var u = new URL(location.href);
      if (!u.searchParams.has('preview')) return;
      u.searchParams.delete('preview');
      history.replaceState({}, '', u.pathname + u.search + u.hash);
    } catch (_) {}
  }

  function injectPreviewBanner() {
    if (!isAuthorized() || document.getElementById('fhd-preview-banner')) return;

    var bar = document.createElement('div');
    bar.id = 'fhd-preview-banner';
    bar.setAttribute('role', 'status');
    bar.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#0F172A;color:#fff;font:600 13px Inter,sans-serif;padding:10px 16px;display:flex;align-items:center;justify-content:center;gap:12px;flex-wrap:wrap;box-shadow:0 4px 12px rgba(0,0,0,.15);';
    bar.innerHTML = '<span>Preview mode — site visible to team only</span>'
      + '<button type="button" id="fhd-preview-exit" style="background:#2563EB;color:#fff;border:none;border-radius:8px;padding:6px 12px;font:inherit;cursor:pointer;font-weight:600;">Exit preview</button>';
    document.body.prepend(bar);
    document.body.style.paddingTop = (bar.offsetHeight + 4) + 'px';
    document.getElementById('fhd-preview-exit').addEventListener('click', lock);

    var cookie = document.getElementById('cookie-banner');
    if (cookie) cookie.remove();

    var searchModal = document.getElementById('search-modal');
    if (searchModal) searchModal.classList.add('hidden');
  }

  function ensurePreviewModalStyles() {
    if (document.getElementById('fhd-preview-modal-styles')) return;
    var s = document.createElement('style');
    s.id = 'fhd-preview-modal-styles';
    s.textContent = '#fhd-preview-modal.hidden{display:none!important}#fhd-preview-modal{position:fixed;inset:0;z-index:10000;background:rgba(15,23,42,.65);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;padding:24px}#fhd-preview-modal .panel{background:#fff;border-radius:16px;border:1px solid #E2E8F0;box-shadow:0 25px 50px -12px rgba(0,0,0,.25);width:100%;max-width:400px;padding:28px;text-align:left}#fhd-preview-modal .panel h2{font-family:Sora,sans-serif;font-size:1.25rem;font-weight:700;color:#0F172A;margin:0 0 6px}#fhd-preview-modal .panel p{font-size:.875rem;color:#64748B;margin:0 0 20px;line-height:1.5}#fhd-preview-modal input{width:100%;height:44px;border:1px solid #E2E8F0;border-radius:12px;padding:0 14px;font-size:.9375rem;margin-bottom:12px}#fhd-preview-modal input:focus{outline:none;border-color:#2563EB}#fhd-preview-modal .err{color:#DC2626;font-size:.8125rem;margin:-6px 0 10px;display:none}#fhd-preview-modal .actions{display:flex;gap:10px;margin-top:4px}#fhd-preview-modal button{flex:1;height:44px;border-radius:12px;font-weight:600;font-size:.875rem;cursor:pointer;border:none}#fhd-preview-modal .primary{background:#2563EB;color:#fff}#fhd-preview-modal .ghost{background:#F8FAFC;color:#475569;border:1px solid #E2E8F0}#fhd-preview-modal .cleardev{margin-top:16px;padding-top:16px;border-top:1px solid #E2E8F0;font-size:.8125rem;text-align:center;color:#64748B}#fhd-preview-modal .cleardev a{color:#2563EB;font-weight:600;text-decoration:none}';
    document.head.appendChild(s);
  }

  function buildPreviewModal() {
    if (document.getElementById('fhd-preview-modal')) return document.getElementById('fhd-preview-modal');
    ensurePreviewModalStyles();
    var c = cfg();
    var cleardev = c.CLEARDEV_PORTAL_URL
      ? '<div class="cleardev">Hosting by <a href="' + c.CLEARDEV_PORTAL_URL + '" target="_blank" rel="noopener">' + (c.CLEARDEV_LABEL || 'ClearDev') + '</a></div>'
      : '';

    var wrap = document.createElement('div');
    wrap.id = 'fhd-preview-modal';
    wrap.className = 'hidden';
    wrap.innerHTML = '<div class="panel" role="dialog" aria-modal="true" aria-labelledby="fhd-preview-title">'
      + '<h2 id="fhd-preview-title">Team preview access</h2>'
      + '<p>Enter the preview password to view the site while maintenance mode is active.</p>'
      + '<form id="fhd-preview-form">'
      + '<input type="password" id="fhd-preview-password" placeholder="Preview password" autocomplete="current-password" required />'
      + '<p class="err" id="fhd-preview-error">Incorrect password. Try again.</p>'
      + '<div class="actions">'
      + '<button type="button" class="ghost" id="fhd-preview-cancel">Cancel</button>'
      + '<button type="submit" class="primary">Unlock preview</button>'
      + '</div></form>' + cleardev + '</div>';
    document.body.appendChild(wrap);
    return wrap;
  }

  function openPreviewModal() {
    var modal = buildPreviewModal();
    var err = document.getElementById('fhd-preview-error');
    var input = document.getElementById('fhd-preview-password');
    modal.classList.remove('hidden');
    if (err) err.style.display = 'none';
    if (input) { input.value = ''; setTimeout(function () { input.focus(); }, 50); }

    document.getElementById('fhd-preview-cancel').onclick = function () {
      modal.classList.add('hidden');
    };
    modal.onclick = function (e) {
      if (e.target === modal) modal.classList.add('hidden');
    };

    var form = document.getElementById('fhd-preview-form');
    form.onsubmit = function (e) {
      e.preventDefault();
      if (unlock(input.value)) {
        modal.classList.add('hidden');
        location.href = pathPrefix() + 'index.html';
        return;
      }
      if (err) err.style.display = 'block';
    };
  }

  FHD.preview = {
    isAuthorized: isAuthorized,
    unlock: unlock,
    lock: lock,
    openModal: openPreviewModal,
    injectBanner: injectPreviewBanner,
    cleanPreviewParam: cleanPreviewParam,
  };

  function initMaintenancePage() {
    var btn = document.getElementById('fhd-team-preview-btn');
    if (btn) btn.addEventListener('click', openPreviewModal);
    if (new URLSearchParams(location.search).get('preview') === 'login') {
      openPreviewModal();
    }
  }

  function init() {
    if (isAuthorized()) {
      cleanPreviewParam();
      if (document.body) injectPreviewBanner();
      else document.addEventListener('DOMContentLoaded', injectPreviewBanner);
    }
    if (location.pathname.toLowerCase().indexOf('maintenance.html') !== -1) {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMaintenancePage);
      } else {
        initMaintenancePage();
      }
    }
  }

  init();
})(window.FHD = window.FHD || {});
