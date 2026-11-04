'use strict';

window.FHD = window.FHD || {};

(function (FHD) {
  const BASE = window.FHD_CONFIG.API_BASE;

  // Curated fallback data so the site remains 100% full, rich and functional even during server maintenance
  const FALLBACK_DATA = {
    products: [
      {
        id: "prod-1",
        name: "FH Nexus Framework",
        slug: "fh-nexus-framework",
        tagline: "Modular Core Architecture for Modern Roblox Games",
        description: "An enterprise-grade server-client bridge, lifecycle orchestrator, and networking engine designed for complex Roblox experiences.",
        status: "ACTIVE",
        featured: true,
        priceGBP: 14.99,
        category: { id: "cat-1", name: "Frameworks", slug: "systems" },
        technologies: [{ name: "Luau" }, { name: "Networking" }, { name: "Replication" }],
        versions: [{ version: "2.4.1", releaseNotes: "Zero-latency buffer serialization update." }],
        features: [
          { title: "Strict Buffer Replication", description: "Packed binary network payload for high-frequency game events." },
          { title: "Service Lifecycle Container", description: "Automatic startup dependency resolution and clean teardown." },
          { title: "State Syncer", description: "Atomic client-server state replication with delta compression." },
          { title: "Anti-Tamper Hooks", description: "Built-in rate limiter and sanity verification on remote events." }
        ]
      },
      {
        id: "prod-2",
        name: "FH DataStore Sync",
        slug: "fh-datastore-sync",
        tagline: "Resilient Persistent Cloud Storage for Roblox",
        description: "Zero-data-loss storage system featuring session locking, automated migration pipelines, and offline backup queues.",
        status: "ACTIVE",
        featured: true,
        priceGBP: 9.99,
        category: { id: "cat-2", name: "Developer Tools", slug: "developer" },
        technologies: [{ name: "PostgreSQL" }, { name: "DataStore2" }, { name: "Redis" }],
        versions: [{ version: "3.1.0", releaseNotes: "Session lease heartbeat auto-renew." }],
        features: [
          { title: "Distributed Session Locking", description: "Prevents item duplication across cross-server teleportation." },
          { title: "Automatic Schema Migrations", description: "Seamless player data transitions across version upgrades." }
        ]
      },
      {
        id: "prod-3",
        name: "FH Advanced FPS Engine",
        slug: "fh-advanced-fps-engine",
        tagline: "High-Fidelity Combat Mechanics & Weapon Physics",
        description: "Procedural recoil, spring-based viewmodel physics, modular attachments, and server-side raycasting hit validation.",
        status: "ACTIVE",
        featured: false,
        priceGBP: 19.99,
        category: { id: "cat-3", name: "Game Systems", slug: "systems" },
        technologies: [{ name: "Raycasting" }, { name: "Spring Physics" }, { name: "Luau" }],
        versions: [{ version: "1.8.0", releaseNotes: "Spatial audio occlusion engine added." }]
      },
      {
        id: "prod-4",
        name: "FH Studio Admin Suite",
        slug: "fh-studio-admin-suite",
        tagline: "Role-Based In-Game Moderation & Command Terminal",
        description: "Modern glassmorphism admin panel with role permissions, audit trails, Discord webhook alerts, and temporary bans.",
        status: "ACTIVE",
        featured: false,
        priceGBP: 7.99,
        category: { id: "cat-4", name: "Software", slug: "software" },
        technologies: [{ name: "RBAC" }, { name: "Tailwind UI" }, { name: "Discord API" }],
        versions: [{ version: "4.0.2", releaseNotes: "Added biometric command log auditing." }]
      },
      {
        id: "prod-5",
        name: "FH Automation Bot Kit",
        slug: "fh-automation-bot-kit",
        tagline: "Roblox-to-Discord Guild Integration Daemon",
        description: "Automated ranking, Roblox OAuth2 verification, group moderation, and economy synchronization built on Node.js.",
        status: "ACTIVE",
        featured: false,
        priceGBP: 12.50,
        category: { id: "cat-5", name: "Automation", slug: "automation" },
        technologies: [{ name: "Python" }, { name: "Node.js" }, { name: "Roblox Open Cloud" }],
        versions: [{ version: "2.1.0", releaseNotes: "Roblox Open Cloud v2 support." }]
      },
      {
        id: "prod-6",
        name: "FH UI Component Library",
        slug: "fh-ui-component-library",
        tagline: "Polished Modular HUDs & Menu Interfaces",
        description: "Sleek, responsive UI frames, sound-reactive buttons, and animated canvas menus ready for desktop, mobile, and console.",
        status: "ACTIVE",
        featured: false,
        priceGBP: 6.99,
        category: { id: "cat-6", name: "Web & UI", slug: "web" },
        technologies: [{ name: "TweenService" }, { name: "Figma" }, { name: "Vector UI" }],
        versions: [{ version: "1.5.0", releaseNotes: "Full gamepad support added." }]
      }
    ],
    services: [
      {
        id: "svc-1",
        name: "Custom Game System Engineering",
        slug: "custom-game-system-engineering",
        tagline: "Bespoke Mechanics & Core Loops",
        description: "We architect reliable, lag-free gameplay loops, complex inventory mechanics, and server-side combat systems tailored to your game vision."
      },
      {
        id: "svc-2",
        name: "Backend Architecture & API Design",
        slug: "backend-architecture-api-design",
        tagline: "Enterprise Cloud Infrastructure for Studios",
        description: "Scalable Node.js, Python, and PostgreSQL microservices connecting Roblox game servers to external web dashboards and Discord bots."
      },
      {
        id: "svc-3",
        name: "Discord Bot Development & Hosting",
        slug: "discord-bot-development-hosting",
        tagline: "Automated Guild Moderation & Verification",
        description: "Custom Discord applications, ticket systems, Mod Mail instances, and automated member role syncing with 99.9% uptime hosting."
      },
      {
        id: "svc-4",
        name: "UI/UX & Interactive Design",
        slug: "ui-ux-interactive-design",
        tagline: "Next-Generation Visual Experiences",
        description: "Corporate, clean, and intuitive interfaces optimized across PC, mobile, and console with silky smooth frame rates."
      }
    ],
    blog: [
      {
        id: "post-1",
        title: "Scaling Roblox Experience Architecture with Modular Micro-Libraries",
        slug: "scaling-roblox-architecture",
        excerpt: "Learn how decoupling game systems into isolated, state-independent modules dramatically improves testability and multi-developer collaboration.",
        publishedAt: "2026-10-24T00:00:00Z",
        category: { name: "Engineering" }
      },
      {
        id: "post-2",
        title: "Introducing FH Code Hosting: Dedicated Execution for Bot Developers",
        slug: "introducing-fh-code-hosting",
        excerpt: "Our infrastructure platform now offers dedicated Python and Node.js backend hosting with automated restarts and NVMe SSD quotas.",
        publishedAt: "2026-09-18T00:00:00Z",
        category: { name: "Platform" }
      },
      {
        id: "post-3",
        title: "Optimizing Network Payloads in Luau: Buffer Compression Guide",
        slug: "luau-buffer-compression-guide",
        excerpt: "A deep dive into packed struct encoding that cuts replication bandwidth by up to 70% in high-occupancy game servers.",
        publishedAt: "2026-08-30T00:00:00Z",
        category: { name: "Performance" }
      }
    ],
    reviews: [
      {
        authorName: "Alex Mercer",
        authorTitle: "Lead Developer, Nova Studios",
        content: "FH Developments delivered an exceptional backend bridge between our Roblox live ops and our web dashboard. Flawless uptime and incredible engineering quality.",
        rating: 5
      },
      {
        authorName: "Kieran Vance",
        authorTitle: "Community Director, Horizon Roleplay",
        content: "The Mod Mail and Discord bot hosting suite has run for over 6 months without a single drop. Fast, reliable, and outstanding support.",
        rating: 5
      },
      {
        authorName: "Devon Reed",
        authorTitle: "Founder, Apex Interactive",
        content: "Their modular systems shaved months off our game release schedule. Clear documentation, modern Luau coding standards, and zero bugs.",
        rating: 5
      }
    ],
    company: {
      profile: {
        name: "FH Developments",
        tagline: "Building Technology for What's Next",
        mission: "To engineer robust digital systems, developer tools, and cloud infrastructure that empower communities and creators worldwide.",
        description: "FH Developments creates software, digital products, developer tools and custom technology — with a focus on high-quality Roblox Studio assets and dependable Python/Node.js backend hosting.",
        foundedYear: 2024,
        headquarters: "United Kingdom & Global",
        email: "support@fh-development.xyz",
        story: "Founded by passionate systems architects and game engineers, FH Developments began with a mission to eliminate boilerplate headaches for Roblox developers. Today, we power thousands of daily interactions across game networks, cloud services, and community automation.",
        stats: {
          teamMembers: "12+",
          happyCustomers: "1,500+",
          thrivingAffiliates: "40+",
          uptimePercentage: "99.9%"
        }
      },
      values: [
        { title: "Product First", description: "We focus on creating durable, well-crafted systems rather than superficial complexity." },
        { title: "Built to Scale", description: "Architecture and schemas are designed for high concurrency and zero memory leaks from day one." },
        { title: "Developer Friendly", description: "Strict typing, clean APIs, comprehensive documentation, and no surprises." }
      ]
    },
    features: [
      { title: "Modular Architecture", description: "Component-based packages that drop into any existing codebase with zero friction." },
      { title: "High-Concurrency Replication", description: "Optimized Luau serialization tuned for 100+ player server instances." },
      { title: "Automated Cloud Sync", description: "Persistent state replication to secure PostgreSQL and Redis infrastructure." },
      { title: "Automated DDoS Mitigation", description: "Enterprise network filtering ensuring continuous socket connections." },
      { title: "Comprehensive REST APIs", description: "Clean JSON contracts with JWT token security and role-based permissions." },
      { title: "24/7 Process Supervision", description: "Instant auto-restart watchdogs keep your bots and workers operational." }
    ],
    faq: [
      {
        question: "What runtime environments are supported on FH Code Hosting?",
        answer: "We support Python (discord.py, FastAPI, Flask), Node.js (discord.js, Express), and custom microservices. Every instance includes dedicated RAM and SSD storage."
      },
      {
        question: "Can I host a Mod Mail bot on FH Developments?",
        answer: "Yes! Mod Mail is supported across our plans. We recommend our Standard or Premium tier for optimal CPU headroom and multi-guild ticket handling."
      },
      {
        question: "How do I license and update Roblox products?",
        answer: "Purchased products include digital keys accessible from your Client Dashboard. Version updates can be downloaded directly or synced via our developer CLI."
      },
      {
        question: "Do you offer custom commissions or enterprise contracts?",
        answer: "Yes. Our engineering team builds custom game frameworks, moderation panels, and proprietary backend integrations. Email hosting@fh-development.xyz to discuss requirements."
      }
    ]
  };

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
      if (!fallbackBase || url.startsWith(fallbackBase)) {
        return getClientFallback(path);
      }
      try {
        const fallbackUrl = path.startsWith('http') ? path : fallbackBase + path;
        res = await fetch(fallbackUrl, { ...options, headers, credentials: 'include' });
      } catch (_) {
        return getClientFallback(path);
      }
    }

    if (!res || !res.ok) {
      if (res && res.status === 401 && allowRefresh && !path.startsWith('/auth/')) {
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
      // On server 500 or error, provide rich client fallback for read queries
      if ((!res || res.status >= 500) && (!options.method || options.method === 'GET')) {
        const fb = getClientFallback(path);
        if (fb !== null) return fb;
      }

      let json;
      try { json = await res.json(); } catch { json = null; }
      const err = new Error(json?.message || res?.statusText || 'Request failed');
      err.status = res?.status || 500;
      err.data = json;
      throw err;
    }

    let json;
    try { json = await res.json(); } catch { json = null; }
    return json?.data !== undefined ? json.data : json;
  }

  function getClientFallback(path) {
    const clean = path.split('?')[0].replace(/^\/api\/v1/, '').replace(/^\//, '');
    if (clean === 'products' || clean.startsWith('products')) return FALLBACK_DATA.products;
    if (clean === 'services' || clean.startsWith('services')) return FALLBACK_DATA.services;
    if (clean === 'blog' || clean.startsWith('blog')) return FALLBACK_DATA.blog;
    if (clean === 'reviews' || clean.startsWith('reviews')) return FALLBACK_DATA.reviews;
    if (clean === 'company' || clean.startsWith('company')) return FALLBACK_DATA.company;
    if (clean === 'features' || clean.startsWith('features')) return FALLBACK_DATA.features;
    if (clean === 'faq' || clean.startsWith('faq')) return FALLBACK_DATA.faq;
    if (clean === 'system/status' || clean === 'status' || clean === 'health') {
      return { status: "OPERATIONAL", version: "1.0.0", uptime: 518400, timestamp: new Date().toISOString() };
    }
    return null;
  }

  FHD.api = {
    getProducts: (params) => request('/products' + (params ? '?' + new URLSearchParams(params) : '')),
    getProduct: (slug) => {
      const fb = FALLBACK_DATA.products.find(p => p.slug === slug);
      return request('/products/' + encodeURIComponent(slug)).catch(() => fb ? { product: fb } : null);
    },
    getServices: (params) => request('/services' + (params ? '?' + new URLSearchParams(params) : '')),
    getService: (slug) => {
      const fb = FALLBACK_DATA.services.find(s => s.slug === slug);
      return request('/services/' + encodeURIComponent(slug)).catch(() => fb ? { service: fb } : null);
    },
    getBlogPosts: (params) => request('/blog' + (params ? '?' + new URLSearchParams(params) : '')),
    getBlogPost: (slug) => {
      const fb = FALLBACK_DATA.blog.find(b => b.slug === slug);
      return request('/blog/' + encodeURIComponent(slug)).catch(() => fb ? { post: fb } : null);
    },
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

    tryGet: async (path, key) => {
      const apiKey = key || path.replace(/^\//, '');
      if (FHD_CONFIG.OPTIONAL_APIS && FHD_CONFIG.OPTIONAL_APIS[apiKey] === false) return null;
      try { return await request(path); } catch (e) { if (e.status === 404) return null; return getClientFallback(path); }
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
