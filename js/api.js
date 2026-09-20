'use strict';

window.FHD = window.FHD || {};

(function (FHD) {
  const BASE = window.FHD_CONFIG.API_BASE;

  async function request(path, options = {}, allowRefresh = true) {
    const url = path.startsWith('http') ? path : BASE + path;
    const originalOptions = { ...options };
    const headers = { Accept: 'application/json', ...(options.headers || {}) };
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    const token = localStorage.getItem('fhd-token');
    if (token) headers.Authorization = 'Bearer ' + token;

    let res;
    try {
      res = await fetch(url, { ...options, headers, credentials: 'include' });
    } catch (networkError) {
      const fallbackBase = FHD_CONFIG.API_FALLBACK_BASE;
      if (!fallbackBase || url.startsWith(fallbackBase)) throw networkError;
      const fallbackUrl = path.startsWith('http') ? path : fallbackBase + path;
      res = await fetch(fallbackUrl, { ...options, headers, credentials: 'include' });
    }
    let json;
    try { json = await res.json(); } catch { json = null; }

    if (!res.ok) {
      if (res.status === 401 && allowRefresh && !path.startsWith('/auth/')) {
        const refreshToken = localStorage.getItem('fhd-refresh-token');
        if (refreshToken) {
          try {
            const refreshed = await request('/auth/refresh', { method: 'POST', body: { refreshToken } }, false);
            if (refreshed.accessToken) localStorage.setItem('fhd-token', refreshed.accessToken);
            if (refreshed.refreshToken) localStorage.setItem('fhd-refresh-token', refreshed.refreshToken);
            return request(path, originalOptions, false);
          } catch {
            localStorage.removeItem('fhd-token');
            localStorage.removeItem('fhd-refresh-token');
          }
        }
      }
      const err = new Error(json?.message || res.statusText || 'Request failed');
      err.status = res.status;
      err.data = json;
      throw err;
    }
    return json?.data !== undefined ? json.data : json;
  }

  FHD.api = {
    getProducts: (params) => request('/products' + (params ? '?' + new URLSearchParams(params) : '')),
    getProduct: (slug) => request('/products/' + encodeURIComponent(slug)),
    getServices: (params) => request('/services' + (params ? '?' + new URLSearchParams(params) : '')),
    getService: (slug) => request('/services/' + encodeURIComponent(slug)),
    getBlogPosts: (params) => request('/blog' + (params ? '?' + new URLSearchParams(params) : '')),
    getBlogPost: (slug) => request('/blog/' + encodeURIComponent(slug)),
    getFaq: () => request('/faq'),
    getDocumentation: (params) => request('/documentation' + (params ? '?' + new URLSearchParams(params) : '')),
    getDocs: (params) => request('/docs' + (params ? '?' + new URLSearchParams(params) : '')),
    getDoc: (slug) => request('/documentation/' + encodeURIComponent(slug)),
    getChangelog: () => request('/changelog'),
    getCareers: (params) => request('/careers' + (params ? '?' + new URLSearchParams(params) : '')),
    getCareer: (slug) => request('/careers/' + encodeURIComponent(slug)),
    getTeam: () => request('/team'),
    getReviews: (params) => request('/reviews' + (params ? '?' + new URLSearchParams(params) : '')),
    getPartners: () => request('/partners'),
    getSubsidiaries: () => request('/subsidiaries'),
    getRoadmap: () => request('/roadmap'),
    getCompany: () => request('/company'),
    getCompanyTimeline: () => request('/company/timeline'),
    getProjects: (params) => request('/projects' + (params ? '?' + new URLSearchParams(params) : '')),
    search: (q) => request('/search?q=' + encodeURIComponent(q)),
    getSystemStatus: () => request('/system/status'),
    getHealth: () => request('/health'),

    // Optional CMS endpoints — skipped when disabled in config or 404 on backend
    tryGet: async (path, key) => {
      const apiKey = key || path.replace(/^\//, '');
      if (FHD_CONFIG.OPTIONAL_APIS && FHD_CONFIG.OPTIONAL_APIS[apiKey] === false) return null;
      try { return await request(path); } catch (e) { if (e.status === 404) return null; throw e; }
    },
    getPress: () => request('/press'),
    getMedia: () => request('/press'),
    getSponsorships: () => request('/sponsorships'),
    getCommunity: () => request('/community'),
    getEvents: () => request('/events'),
    getDownloads: () => request('/downloads'),
    getFeatures: () => request('/features'),

    submitContact: (body) => request('/contact', { method: 'POST', body }),
    createSupportTicket: (body) => request('/support', { method: 'POST', body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),
    register: (body) => request('/auth/register', { method: 'POST', body }),
    forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body }),
    resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body }),
    verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token } }),
    getMe: () => request('/auth/me'),
    getCurrentUser: () => request('/users/me'),
    refresh: (refreshToken) => request('/auth/refresh', { method: 'POST', body: { refreshToken } }),
    logout: (refreshToken) => request('/auth/logout', { method: 'POST', body: { refreshToken } }),

    getCart: () => request('/cart'),
    addToCart: (body) => request('/cart/items', { method: 'POST', body }),
    updateCartItem: (itemId, body) => request('/cart/items/' + encodeURIComponent(itemId), { method: 'PATCH', body }),
    removeCartItem: (itemId) => request('/cart/items/' + encodeURIComponent(itemId), { method: 'DELETE' }),
    clearCart: () => request('/cart', { method: 'DELETE' }),
    createPurchase: () => request('/purchases', { method: 'POST' }),
    getPurchases: () => request('/purchases'),
    getPurchase: (id) => request('/purchases/' + encodeURIComponent(id)),
    checkBlacklist: (params) => request('/blacklist/check?' + new URLSearchParams(params)),
    getBlacklist: () => request('/blacklist'),
    addBlacklistEntry: (body) => request('/blacklist', { method: 'POST', body }),
    removeBlacklistEntry: (id) => request('/blacklist/' + encodeURIComponent(id), { method: 'DELETE' }),

    getHostingPlans: () => request('/hosting/plans'),
    getHostingPlan: (slug) => request('/hosting/plans/' + encodeURIComponent(slug)),
    requestHosting: (body) => request('/hosting/request', { method: 'POST', body }),
    getMyHosting: () => request('/hosting/me'),
    getMyHostingService: (id) => request('/hosting/me/' + encodeURIComponent(id)),
  };

  FHD.api.unwrapList = function (data) {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (data.releases) return data.releases;
    if (data.faqs) return data.faqs;
    if (data.items) return data.items;
    if (data.members) return data.members;
    if (data.partners) return data.partners;
    if (data.subsidiaries) return data.subsidiaries;
    if (data.post) return [data.post];
    if (data.product) return [data.product];
    if (data.service) return [data.service];
    return [];
  };
})(window.FHD);
