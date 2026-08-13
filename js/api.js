'use strict';

window.FHD = window.FHD || {};

(function (FHD) {
  const BASE = window.FHD_CONFIG.API_BASE;

  async function request(path, options) {
    const url = path.startsWith('http') ? path : BASE + path;
    const headers = { Accept: 'application/json', ...(options?.headers || {}) };
    if (options?.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
      options.body = JSON.stringify(options.body);
    }
    const token = localStorage.getItem('fhd-token');
    if (token) headers.Authorization = 'Bearer ' + token;

    const res = await fetch(url, { ...options, headers });
    let json;
    try { json = await res.json(); } catch { json = null; }

    if (!res.ok) {
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
    getPress: () => FHD.api.tryGet('/press', 'press'),
    getMedia: () => FHD.api.tryGet('/media', 'media'),
    getSponsorships: () => FHD.api.tryGet('/sponsorships', 'sponsorships'),
    getCommunity: () => FHD.api.tryGet('/community', 'community'),
    getEvents: () => FHD.api.tryGet('/events', 'events'),
    getDownloads: () => FHD.api.tryGet('/downloads', 'downloads'),
    getFeatures: () => FHD.api.tryGet('/features', 'features'),

    submitContact: (body) => request('/contact', { method: 'POST', body }),
    createSupportTicket: (body) => request('/support', { method: 'POST', body }),
    login: (body) => request('/auth/login', { method: 'POST', body }),
    register: (body) => request('/auth/register', { method: 'POST', body }),
    forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body }),
    resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body }),
    verifyEmail: (token) => request('/auth/verify-email', { method: 'POST', body: { token } }),
    getMe: () => request('/auth/me'),
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
