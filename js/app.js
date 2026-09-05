'use strict';

window.FHD = window.FHD || {};

(function (FHD) {
  const api = () => FHD.api;
  const p = () => FHD.getPathPrefix();

  const GRADIENTS = [
    'from-[#EFF6FF] to-[#DBEAFE]',
    'from-[#F0FDF4] to-[#DCFCE7]',
    'from-[#FAF5FF] to-[#EDE9FE]',
    'from-[#FFF7ED] to-[#FFEDD5]',
    'from-[#ECFEFF] to-[#CFFAFE]',
    'from-[#FEF2F2] to-[#FECACA]',
  ];

  function gradient(i) { return GRADIENTS[i % GRADIENTS.length]; }

  function productCard(product, i) {
    const slug = product.slug;
    const cat = product.category?.name || 'Product';
    const version = product.versions?.[0]?.version || '';
    const tags = (product.technologies || []).slice(0, 3).map(t =>
      `<span class="tag">${FHD.escapeHtml(t.name)}</span>`).join('');
    return `<a href="${p()}pages/product.html?slug=${encodeURIComponent(slug)}" class="product-card" data-category="${FHD.escapeHtml(product.category?.slug || 'all')}" data-search-item>
      <div class="h-40 bg-gradient-to-br ${gradient(i)} flex items-center justify-center">
        ${product.coverImage
          ? `<img src="${FHD.escapeHtml(product.coverImage)}" alt="" class="h-full w-full object-cover" />`
          : `<div class="w-14 h-14 rounded-2xl bg-white shadow border border-[#E2E8F0] flex items-center justify-center font-display font-bold text-primary text-lg">${FHD.escapeHtml(product.name.charAt(0))}</div>`}
      </div>
      <div class="p-5">
        <div class="flex items-center gap-2 mb-2">
          <span class="badge badge-blue">${FHD.escapeHtml(cat)}</span>
          <span class="badge badge-green ml-auto flex-shrink-0"><span class="pulse-dot w-1.5 h-1.5"></span>${FHD.escapeHtml(product.status || 'Active')}</span>
        </div>
        <h3 class="font-display font-bold text-[#0F172A] mb-1">${FHD.escapeHtml(product.name)}</h3>
        <p class="text-sm text-[#64748B] mb-3 line-clamp-2">${FHD.escapeHtml(product.description || product.tagline || '')}</p>
        <div class="flex flex-wrap gap-1 mb-3">${tags}</div>
        <div class="flex items-center justify-between">
          <span class="text-xs text-[#94A3B8] font-mono">${FHD.escapeHtml(version)}</span>
          <span class="btn-ghost text-xs">Learn More →</span>
        </div>
      </div>
    </a>`;
  }

  function blogCard(post, i) {
    const delay = i % 3 ? ` reveal-delay-${i % 3}` : '';
    const cat = post.category?.name || 'Update';
    return `<a href="${p()}pages/blog-article.html?slug=${encodeURIComponent(post.slug)}" class="update-card reveal${delay}">
      <div class="h-44 bg-gradient-to-br ${gradient(i)} flex items-end p-6">
        ${post.featuredImage ? `<img src="${FHD.escapeHtml(post.featuredImage)}" class="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />` : ''}
        <span class="badge badge-blue relative">${FHD.escapeHtml(cat)}</span>
      </div>
      <div class="p-6">
        <p class="text-xs text-[#94A3B8] mb-2 font-mono">${FHD.formatDate(post.publishedAt || post.createdAt)}</p>
        <h3 class="font-display font-bold text-lg text-[#0F172A] mb-2 leading-snug">${FHD.escapeHtml(post.title)}</h3>
        <p class="text-[#64748B] text-sm leading-relaxed mb-4 line-clamp-3">${FHD.escapeHtml(post.excerpt || '')}</p>
        <span class="btn-ghost text-sm">Read More →</span>
      </div>
    </a>`;
  }

  function reviewCard(review) {
    return `<div class="testimonial-card reveal">
      <div class="flex mb-5">${'★'.repeat(review.rating || 5).split('').map(() =>
        '<svg class="w-5 h-5 text-[#F59E0B]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>'
      ).join('')}</div>
      <blockquote class="text-[#0F172A] text-base leading-relaxed font-medium mb-6">"${FHD.escapeHtml(review.content || review.text || '')}"</blockquote>
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-sky flex items-center justify-center text-white font-display font-bold text-sm">${FHD.escapeHtml((review.authorName || review.name || 'C').charAt(0))}</div>
        <div>
          <p class="font-display font-semibold text-sm text-[#0F172A]">${FHD.escapeHtml(review.authorName || review.name || 'Customer')}</p>
          <p class="text-xs text-[#64748B]">${FHD.escapeHtml(review.authorTitle || review.role || '')}</p>
        </div>
      </div>
    </div>`;
  }

  function teamCard(member) {
    return `<div class="reveal p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-all text-center">
      <div class="w-20 h-20 rounded-full mx-auto mb-4 bg-gradient-to-br from-primary to-sky flex items-center justify-center overflow-hidden">
        ${member.profileImage
          ? `<img src="${FHD.escapeHtml(member.profileImage)}" alt="" class="w-full h-full object-cover" />`
          : `<span class="text-white font-display font-bold text-2xl">${FHD.escapeHtml(member.name.charAt(0))}</span>`}
      </div>
      <h3 class="font-display font-bold text-lg text-[#0F172A]">${FHD.escapeHtml(member.name)}</h3>
      <p class="text-primary text-sm font-medium mb-3">${FHD.escapeHtml(member.position || '')}</p>
      <p class="text-[#64748B] text-sm leading-relaxed">${FHD.escapeHtml(member.bio || '')}</p>
    </div>`;
  }

  function jobRow(job) {
    return `<a href="${p()}pages/career.html?slug=${encodeURIComponent(job.slug)}" class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-[#E2E8F0] hover:border-primary/30 hover:shadow-md transition-all group">
      <div>
        <h3 class="font-display font-bold text-lg text-[#0F172A] group-hover:text-primary transition-colors">${FHD.escapeHtml(job.title)}</h3>
        <p class="text-sm text-[#64748B] mt-1 line-clamp-2">${FHD.escapeHtml(job.description || job.summary || '')}</p>
      </div>
      <div class="flex items-center gap-2 flex-shrink-0">
        ${job.department ? `<span class="badge badge-blue">${FHD.escapeHtml(job.department)}</span>` : ''}
        ${job.location ? `<span class="badge badge-slate">${FHD.escapeHtml(job.location)}</span>` : ''}
        ${job.type ? `<span class="badge badge-green">${FHD.escapeHtml(job.type)}</span>` : ''}
      </div>
    </a>`;
  }

  function statusBadge(status) {
    const s = (status || '').toUpperCase();
    const ok = ['OPERATIONAL', 'ACTIVE', 'RELEASED', 'PUBLISHED', 'CONFIGURED'].includes(s);
    const warn = ['DEGRADED', 'IN_PROGRESS', 'PLANNED', 'BETA'].includes(s);
    const cls = ok ? 'badge-green' : warn ? 'badge-amber' : 'badge-slate';
    return `<span class="badge ${cls}">${FHD.escapeHtml(status)}</span>`;
  }

  // ── Page handlers ──────────────────────────────────────────

  const pages = {
    async home() {
      const [products, blog, reviews, company] = await Promise.all([
        api().getProducts().catch(() => []),
        api().getBlogPosts({ featured: 'true', limit: '3' }).catch(() => []),
        api().getReviews().catch(() => []),
        api().getCompany().catch(() => null),
      ]);

      const productList = FHD.api.unwrapList(products);
      const blogList = FHD.api.unwrapList(blog).slice(0, 3);
      const reviewList = FHD.api.unwrapList(reviews).slice(0, 3);

      const grid = document.getElementById('product-grid');
      if (grid) {
        grid.innerHTML = productList.length
          ? productList.slice(0, 6).map((x, i) => productCard(x, i)).join('')
          : FHD.emptyHtml('No products published yet.');
      }

      const featured = document.getElementById('featured-product');
      const featuredProduct = productList.find(x => x.featured) || productList[0];
      if (featured && featuredProduct) {
        const feats = (featuredProduct.features || []).slice(0, 4);
        featured.innerHTML = `
          <div class="reveal-left">
            <span class="badge badge-blue mb-4">Featured Product</span>
            <h2 class="section-title text-4xl lg:text-5xl mb-5">${FHD.escapeHtml(featuredProduct.name)}<br/><span class="bg-gradient-to-r from-primary to-sky bg-clip-text text-transparent">${FHD.escapeHtml(featuredProduct.tagline || '')}</span></h2>
            <p class="text-[#475569] text-lg leading-relaxed mb-8">${FHD.escapeHtml(featuredProduct.description || '')}</p>
            <ul class="space-y-4 mb-10">${feats.map(f => `
              <li class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-[#EFF6FF] flex items-center justify-center flex-shrink-0 mt-0.5"><svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg></div>
                <div><p class="font-semibold text-[#0F172A] text-sm font-display">${FHD.escapeHtml(f.title)}</p><p class="text-[#64748B] text-sm mt-0.5">${FHD.escapeHtml(f.description || '')}</p></div>
              </li>`).join('')}</ul>
            <div class="flex flex-wrap gap-4">
              <a href="${p()}pages/product.html?slug=${encodeURIComponent(featuredProduct.slug)}" class="btn-primary px-7 py-3">Explore ${FHD.escapeHtml(featuredProduct.name)} →</a>
              <a href="${FHD.docsUrl()}" target="_blank" rel="noopener" class="btn-secondary px-7 py-3">View Documentation</a>
            </div>
          </div>
          <div class="reveal-right">
            <div class="bg-gradient-to-br ${gradient(0)} rounded-2xl border border-[#E2E8F0] aspect-video flex items-center justify-center shadow-xl">
              ${featuredProduct.coverImage
                ? `<img src="${FHD.escapeHtml(featuredProduct.coverImage)}" alt="" class="rounded-2xl w-full h-full object-cover" />`
                : `<div class="text-center p-8"><div class="text-4xl font-display font-black text-primary mb-2">${FHD.escapeHtml(featuredProduct.name)}</div><p class="text-[#64748B]">Product Preview</p></div>`}
            </div>
          </div>`;
      }

      const updates = document.getElementById('home-updates');
      if (updates) {
        updates.innerHTML = blogList.length
          ? blogList.map((x, i) => blogCard(x, i)).join('')
          : FHD.emptyHtml('No updates published yet.');
      }

      const testimonials = document.getElementById('home-testimonials');
      if (testimonials) {
        testimonials.innerHTML = reviewList.length
          ? reviewList.map(reviewCard).join('')
          : `<div class="col-span-full text-center py-8 text-[#64748B] text-sm">Testimonials will appear here when published via the CMS.</div>`;
      }

      const featuresEl = document.getElementById('home-features');
      if (featuresEl) {
        try {
          const featData = await api().getFeatures();
          const featList = FHD.api.unwrapList(featData).slice(0, 6);
          featuresEl.innerHTML = featList.length
            ? featList.map((f, i) => `
              <div class="p-8 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-all reveal">
                <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${gradient(i)} flex items-center justify-center mb-5 font-bold text-primary">${FHD.escapeHtml((f.title||'F').charAt(0))}</div>
                <h3 class="font-display font-bold text-xl mb-2">${FHD.escapeHtml(f.title || f.name)}</h3>
                <p class="text-[#64748B] text-sm">${FHD.escapeHtml(f.description || '')}</p>
              </div>`).join('')
            : `<div class="col-span-full text-center py-8 text-[#64748B] text-sm">Features will appear when published in the CMS.</div>`;
        } catch {
          featuresEl.innerHTML = `<div class="col-span-full text-center py-8 text-[#64748B] text-sm">Features will appear when published in the CMS.</div>`;
        }
      }

      const ann = document.getElementById('announcement-text');
      if (ann && blogList[0]) {
        ann.innerHTML = `Introducing <strong>${FHD.escapeHtml(blogList[0].title)}</strong>`;
        const annLink = document.getElementById('announcement-link');
        if (annLink) annLink.href = p() + 'pages/blog-article.html?slug=' + encodeURIComponent(blogList[0].slug);
      } else if (ann) {
        ann.textContent = 'FH Developments platform updates';
      }

      if (company?.profile) {
        const meta = document.querySelector('meta[name="description"]');
        if (meta && company.profile.description) meta.content = company.profile.description;
      }

      const servicesEl = document.getElementById('home-services');
      if (servicesEl) {
        try {
          const svcData = await api().getServices();
          const svcList = FHD.api.unwrapList(svcData).slice(0, 7);
          servicesEl.innerHTML = svcList.length
            ? svcList.map((s, i) => `
              <a href="${p()}pages/service.html?slug=${encodeURIComponent(s.slug)}" class="group p-6 rounded-2xl border border-[#E2E8F0] hover:border-primary/20 hover:bg-[#F8FAFC] transition-all reveal${i ? ` reveal-delay-${Math.min(i, 5)}` : ''}">
                <div class="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-primary mb-5 font-display font-bold">${FHD.escapeHtml(s.name.charAt(0))}</div>
                <h3 class="font-display font-bold text-[#0F172A] mb-2">${FHD.escapeHtml(s.name)}</h3>
                <p class="text-[#64748B] text-sm leading-relaxed mb-4 line-clamp-2">${FHD.escapeHtml(s.tagline || s.description || '')}</p>
                <span class="btn-ghost text-xs">Learn More →</span>
              </a>`).join('') + `<a href="${p()}pages/contact.html" class="group p-6 rounded-2xl border border-[#E2E8F0] hover:border-primary/20 hover:bg-[#F8FAFC] transition-all reveal"><div class="w-11 h-11 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-primary mb-5">+</div><h3 class="font-display font-bold text-[#0F172A] mb-2">Custom Solutions</h3><p class="text-[#64748B] text-sm mb-4">Bespoke development for unique requirements.</p><span class="btn-ghost text-xs">Start a Conversation →</span></a>`
            : FHD.emptyHtml('Services will appear when published.');
        } catch { servicesEl.innerHTML = FHD.emptyHtml('Services unavailable.'); }
      }

      const statsEl = document.getElementById('home-stats');
      const statsCards = document.getElementById('home-stats-cards');
      if (statsEl) {
        try {
          const [status, prods, teamData, companyData] = await Promise.all([
            api().getSystemStatus().catch(() => null),
            api().getProducts().catch(() => []),
            api().getTeam().catch(() => ({ members: [] })),
            api().getCompany().catch(() => null),
          ]);
          const pc = FHD.api.unwrapList(prods).length;
          const tc = FHD.api.unwrapList(teamData).length;
          const founded = companyData?.profile?.foundedYear;
          const years = founded ? new Date().getFullYear() - Number(founded) : '—';
          statsEl.innerHTML = `
            <div class="stat-item reveal"><div class="stat-number">${pc || '—'}</div><div class="stat-label">Products</div></div>
            <div class="stat-item reveal reveal-delay-1"><div class="stat-number">${tc || '—'}</div><div class="stat-label">Team Members</div></div>
            <div class="stat-item reveal reveal-delay-2"><div class="stat-number">${years}${typeof years === 'number' ? '+' : ''}</div><div class="stat-label">Years Building</div></div>
            <div class="stat-item reveal reveal-delay-3"><div class="stat-number">${status?.status === 'OPERATIONAL' ? 'Live' : '—'}</div><div class="stat-label">System Status</div></div>`;
          if (statsCards && status) {
            statsCards.innerHTML = `
              <div class="bg-white/5 border border-white/10 rounded-2xl p-6"><span class="text-white font-display font-bold">${FHD.escapeHtml(status.status)}</span><p class="text-[#94A3B8] text-sm mt-2"><a href="${FHD_CONFIG.STATUS_URL}" class="text-primary hover:underline" target="_blank" rel="noopener">View live status →</a></p></div>
              <div class="bg-white/5 border border-white/10 rounded-2xl p-6"><span class="text-white font-display font-bold">API v${FHD.escapeHtml(status.version || '')}</span><p class="text-[#94A3B8] text-sm mt-2">Backend connected at ${FHD.escapeHtml(FHD_CONFIG.API_BASE)}</p></div>
              <div class="bg-white/5 border border-white/10 rounded-2xl p-6"><span class="text-white font-display font-bold">${Math.floor((status.uptime || 0) / 3600)}h uptime</span><p class="text-[#94A3B8] text-sm mt-2">Current deployment session</p></div>`;
          }
        } catch { statsEl.innerHTML = '<div class="col-span-full text-center text-[#94A3B8]">Stats unavailable</div>'; }
      }
    },

    async products() {
      const el = document.getElementById('product-grid');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml('Loading products...');
      try {
        const data = await api().getProducts();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map((x, i) => productCard(x, i)).join('') : FHD.emptyHtml('No products available.');
        const cat = FHD.getQueryParam('cat');
        if (cat) {
          document.querySelectorAll('#product-grid [data-category]').forEach(card => {
            card.style.display = card.dataset.category === cat ? '' : 'none';
          });
        }
      } catch (e) {
        el.innerHTML = FHD.errorHtml(e.message);
      }
    },

    async productDetail() {
      const slug = FHD.getQueryParam('slug');
      const el = document.getElementById('product-detail');
      if (!el || !slug) { if (el) el.innerHTML = FHD.errorHtml('Product not specified.'); return; }
      el.innerHTML = FHD.loadingHtml('Loading product...');
      try {
        const data = await api().getProduct(slug);
        const product = data.product || data;
        const version = product.versions?.[0];
        el.innerHTML = `
          <section class="py-12 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div class="max-w-7xl mx-auto px-6">
              <nav class="flex items-center gap-2 text-sm text-[#64748B] mb-8">
                <a href="${p()}index.html" class="hover:text-primary">Home</a><span>/</span>
                <a href="${p()}pages/products.html" class="hover:text-primary">Products</a><span>/</span>
                <span class="text-[#0F172A] font-medium">${FHD.escapeHtml(product.name)}</span>
              </nav>
              <div class="grid lg:grid-cols-2 gap-12 items-start">
                <div>
                  <div class="flex items-center gap-3 mb-6">${statusBadge(product.status)}<span class="badge badge-blue">${FHD.escapeHtml(product.category?.name || '')}</span></div>
                  <h1 class="section-title text-4xl lg:text-5xl mb-4">${FHD.escapeHtml(product.name)}</h1>
                  <p class="text-lg text-[#475569] mb-2">${FHD.escapeHtml(product.tagline || '')}</p>
                  <p class="text-[#64748B] leading-relaxed mb-6">${FHD.escapeHtml(product.description || '')}</p>
                  ${product.longDescription ? `<div class="prose text-[#475569] mb-6">${product.longDescription}</div>` : ''}
                  <p class="text-sm font-mono text-[#94A3B8] mb-8">${version ? 'v' + FHD.escapeHtml(version.version) : ''}</p>
                  <div class="flex flex-wrap gap-4">
                    <a href="${p()}pages/contact.html" class="btn-primary px-7 py-3">Get ${FHD.escapeHtml(product.name)}</a>
                    <a href="${FHD.docsUrl()}" target="_blank" rel="noopener" class="btn-secondary px-7 py-3">Documentation</a>
                  </div>
                </div>
                <div class="bg-gradient-to-br ${gradient(0)} rounded-2xl border border-[#E2E8F0] aspect-video flex items-center justify-center">
                  ${product.coverImage ? `<img src="${FHD.escapeHtml(product.coverImage)}" class="rounded-2xl w-full h-full object-cover" alt="" />` : `<span class="font-display font-black text-3xl text-primary">${FHD.escapeHtml(product.name)}</span>`}
                </div>
              </div>
            </div>
          </section>
          <section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-3 gap-12">
            <div class="lg:col-span-2">
              <h2 class="font-display font-bold text-2xl mb-6">Features</h2>
              <ul class="space-y-4 mb-12">${(product.features || []).map(f => `
                <li class="flex items-start gap-3"><svg class="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7"/></svg>
                <div><p class="font-semibold text-[#0F172A]">${FHD.escapeHtml(f.title)}</p><p class="text-sm text-[#64748B]">${FHD.escapeHtml(f.description || '')}</p></div></li>`).join('') || '<li class="text-[#64748B]">No features listed.</li>'}
              </ul>
              ${(product.screenshots || []).length ? `<h2 class="font-display font-bold text-2xl mb-6">Screenshots</h2><div class="grid sm:grid-cols-2 gap-4 mb-12">${product.screenshots.map(s => `<img src="${FHD.escapeHtml(s.url || s)}" alt="" class="rounded-xl border border-[#E2E8F0]" />`).join('')}</div>` : ''}
            </div>
            <div class="space-y-6">
              <div class="p-6 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC]">
                <h3 class="font-display font-bold text-lg mb-4">Technologies</h3>
                <div class="flex flex-wrap gap-2">${(product.technologies || []).map(t => `<span class="tag">${FHD.escapeHtml(t.name)}</span>`).join('') || '<span class="text-sm text-[#64748B]">—</span>'}</div>
              </div>
              ${version ? `<div class="p-6 rounded-2xl border border-[#E2E8F0]"><h3 class="font-display font-bold text-lg mb-4">Latest Version</h3><p class="font-mono text-primary font-bold">${FHD.escapeHtml(version.version)}</p><p class="text-sm text-[#64748B] mt-2">${FHD.escapeHtml(version.releaseNotes || '')}</p></div>` : ''}
            </div>
          </div></section>`;
        document.title = product.name + ' - FH Development';
      } catch (e) {
        el.innerHTML = FHD.errorHtml(e.message);
      }
    },

    async services() {
      const el = document.getElementById('services-grid');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml('Loading services...');
      try {
        const data = await api().getServices();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map((s, i) => `
          <div class="reveal p-8 rounded-2xl border border-[#E2E8F0] hover:border-primary/20 hover:shadow-lg transition-all group visible">
            <div class="flex items-start gap-5 mb-6">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient(i)} flex items-center justify-center flex-shrink-0 font-display font-bold text-primary text-xl">${FHD.escapeHtml(s.name.charAt(0))}</div>
              <div><h2 class="font-display font-bold text-2xl text-[#0F172A] mb-1">${FHD.escapeHtml(s.name)}</h2><p class="text-[#64748B] text-sm">${FHD.escapeHtml(s.tagline || '')}</p></div>
            </div>
            <p class="text-[#475569] leading-relaxed mb-6">${FHD.escapeHtml(s.description || '')}</p>
            <a href="${p()}pages/service.html?slug=${encodeURIComponent(s.slug)}" class="btn-ghost text-sm">Learn More →</a>
          </div>`).join('') : FHD.emptyHtml('No services published yet.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async serviceDetail() {
      const slug = FHD.getQueryParam('slug');
      const el = document.getElementById('service-detail');
      if (!el || !slug) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getService(slug);
        const s = data.service || data;
        el.innerHTML = `
          <section class="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]"><div class="max-w-7xl mx-auto px-6">
            <h1 class="section-title text-5xl mb-4">${FHD.escapeHtml(s.name)}</h1>
            <p class="text-xl text-[#475569] max-w-3xl mb-8">${FHD.escapeHtml(s.description || s.tagline || '')}</p>
            <a href="${p()}pages/contact.html" class="btn-primary px-8 py-3">Start a Project →</a>
          </div></section>`;
        document.title = s.name + ' - FH Development';
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async blog() {
      const el = document.getElementById('blog-grid');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml('Loading blog posts...');
      try {
        const data = await api().getBlogPosts();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map((x, i) => blogCard(x, i)).join('') : FHD.emptyHtml('No blog posts yet.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async blogArticle() {
      const slug = FHD.getQueryParam('slug');
      const el = document.getElementById('blog-article');
      if (!el || !slug) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getBlogPost(slug);
        const post = data.post || data;
        el.innerHTML = `
          <article class="max-w-3xl mx-auto px-6 py-16">
            <span class="badge badge-blue mb-4">${FHD.escapeHtml(post.category?.name || 'Blog')}</span>
            <h1 class="section-title text-4xl lg:text-5xl mb-4">${FHD.escapeHtml(post.title)}</h1>
            <p class="text-[#94A3B8] font-mono text-sm mb-10">${FHD.formatDate(post.publishedAt || post.createdAt)}</p>
            <div class="prose text-[#475569] leading-relaxed space-y-6 article-body">${post.content || ''}</div>
            <div class="mt-12 pt-8 border-t border-[#E2E8F0]"><a href="${p()}pages/blog.html" class="btn-ghost">← Back to Blog</a></div>
          </article>`;
        document.title = post.title + ' - FH Development';
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async faq() {
      const el = document.getElementById('faq-list');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getFaq();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? `<div class="accordion-container space-y-3">${list.map(f => `
          <div class="border border-[#E2E8F0] rounded-xl overflow-hidden">
            <button class="accordion-header w-full flex items-center justify-between px-6 py-4 text-left font-display font-semibold text-[#0F172A] hover:bg-[#F8FAFC]">${FHD.escapeHtml(f.question)}<svg class="w-5 h-5 text-[#94A3B8]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/></svg></button>
            <div class="accordion-body px-6 pb-4 text-[#475569] leading-relaxed">${FHD.escapeHtml(f.answer)}</div>
          </div>`).join('')}</div>` : FHD.emptyHtml('No FAQs published yet.');
        if (list.length && FHD.initAccordion) FHD.initAccordion();
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async docs() {
      window.location.replace(FHD.docsUrl());
    },

    async docArticle() {
      const slug = FHD.getQueryParam('slug');
      window.location.replace(slug ? FHD.docsUrl(slug) : FHD.docsUrl());
    },

    async changelog() {
      const el = document.getElementById('changelog-timeline');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getChangelog();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map(r => `
          <div class="relative pl-8 pb-12 border-l-2 border-[#E2E8F0] last:pb-0">
            <div class="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-primary border-4 border-white"></div>
            <div class="flex flex-wrap items-center gap-3 mb-3">
              <span class="font-mono font-bold text-primary">${FHD.escapeHtml(r.version)}</span>
              <span class="text-sm text-[#94A3B8]">${FHD.formatDate(r.releaseDate || r.publishedAt)}</span>
            </div>
            <h3 class="font-display font-bold text-xl text-[#0F172A] mb-4">${FHD.escapeHtml(r.title || '')}</h3>
            <div class="space-y-4">${['NEW', 'IMPROVED', 'FIXED'].map(type => {
              const items = (r.items || []).filter(i => i.type === type);
              if (!items.length) return '';
              return `<div><p class="text-xs font-bold uppercase tracking-wider text-[#64748B] mb-2">${type}</p><ul class="space-y-1">${items.map(i => `<li class="text-sm text-[#475569] flex gap-2"><span class="text-primary">•</span>${FHD.escapeHtml(i.title)}</li>`).join('')}</ul></div>`;
            }).join('')}</div>
          </div>`).join('') : FHD.emptyHtml('No releases published yet.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async careers() {
      const el = document.getElementById('jobs-list');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getCareers();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map(jobRow).join('') : FHD.emptyHtml('No open positions at the moment. Check back soon.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async careerDetail() {
      const slug = FHD.getQueryParam('slug');
      const el = document.getElementById('career-detail');
      if (!el || !slug) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getCareer(slug);
        const job = data.job || data;
        el.innerHTML = `
          <section class="py-16 max-w-3xl mx-auto px-6">
            <h1 class="section-title text-4xl mb-4">${FHD.escapeHtml(job.title)}</h1>
            <div class="flex flex-wrap gap-2 mb-8">${job.department ? statusBadge(job.department) : ''}${job.location ? statusBadge(job.location) : ''}${job.type ? statusBadge(job.type) : ''}</div>
            <div class="prose text-[#475569] leading-relaxed mb-10">${job.description || job.content || ''}</div>
            <a href="${p()}pages/contact.html" class="btn-primary px-8 py-3">Apply Now →</a>
          </section>`;
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async team() {
      const el = document.getElementById('team-grid');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getTeam();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map(teamCard).join('') : FHD.emptyHtml('Team profiles will appear here when added.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async company() {
      const el = document.getElementById('company-content');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml('Loading company profile...');
      try {
        const [companyData, timelineData, products, team, services] = await Promise.all([
          api().getCompany(),
          api().getCompanyTimeline?.().catch(() => ({ timeline: [] })) || Promise.resolve({ timeline: [] }),
          api().getProducts().catch(() => []),
          api().getTeam().catch(() => ({ members: [] })),
          api().getServices().catch(() => []),
        ]);
        const profile = companyData.profile || companyData;
        const values = companyData.values || [];
        const timeline = timelineData.timeline || FHD.api.unwrapList(timelineData);
        const stats = profile.stats || {};
        const productCount = FHD.api.unwrapList(products).length;
        const teamCount = FHD.api.unwrapList(team).length;
        const serviceCount = FHD.api.unwrapList(services).length;

        document.title = (profile.name || 'About') + ' — FH Development';
        const meta = document.querySelector('meta[name="description"]');
        if (meta && profile.description) meta.content = profile.description;

        const valueCards = values.length ? values.map((v, i) => `
          <div class="reveal${i ? ` reveal-delay-${Math.min(i, 3)}` : ''} p-8 rounded-2xl border border-[#E2E8F0] bg-white hover:shadow-md transition-all">
            <div class="w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient(i)} flex items-center justify-center mb-6 font-display font-bold text-primary text-xl">${FHD.escapeHtml((v.title || v.name || 'V').charAt(0))}</div>
            <h3 class="font-display font-bold text-2xl text-[#0F172A] mb-4">${FHD.escapeHtml(v.title || v.name)}</h3>
            <p class="text-[#64748B] leading-relaxed">${FHD.escapeHtml(v.description || '')}</p>
          </div>`).join('') : '';

        el.innerHTML = `
          <section class="py-24 bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <div class="max-w-4xl mx-auto px-6 text-center">
              <div class="section-eyebrow mx-auto mb-6 reveal">Our Mission</div>
              <h1 class="section-title text-5xl lg:text-7xl mb-8 reveal reveal-delay-1">${FHD.escapeHtml(profile.mission ? profile.name : profile.name || 'FH Development')}</h1>
              <p class="text-xl text-[#475569] leading-relaxed reveal reveal-delay-2">${FHD.escapeHtml(profile.mission || profile.description || profile.tagline || '')}</p>
            </div>
          </section>
          ${profile.story ? `<section class="py-24 bg-white"><div class="max-w-4xl mx-auto px-6"><div class="section-eyebrow mb-4">Our Story</div><h2 class="section-title text-4xl lg:text-5xl mb-6">Driven by innovation, powered by people.</h2><p class="text-lg text-[#475569] leading-relaxed">${FHD.escapeHtml(profile.story)}</p></div></section>` : ''}
          <section class="py-16 bg-white"><div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <div class="section-eyebrow mb-4">About Us</div>
              <h2 class="section-title text-4xl mb-6">${FHD.escapeHtml(profile.name || 'FH Development')}</h2>
              <p class="text-xl text-primary font-medium mb-4">${FHD.escapeHtml(profile.tagline || '')}</p>
              <p class="text-[#475569] text-lg leading-relaxed mb-8">${FHD.escapeHtml(profile.description || '')}</p>
              <div class="flex flex-wrap gap-3">
                ${profile.email ? `<a href="mailto:${FHD.escapeHtml(profile.email)}" class="btn-secondary text-sm">${FHD.escapeHtml(profile.email)}</a>` : ''}
                <a href="${p()}pages/contact.html" class="btn-primary text-sm">Contact Us →</a>
              </div>
            </div>
            <div class="grid sm:grid-cols-2 gap-4">
              ${profile.mission ? `<div class="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"><h3 class="font-display font-bold mb-2">Mission</h3><p class="text-sm text-[#64748B]">${FHD.escapeHtml(profile.mission)}</p></div>` : ''}
              ${profile.vision ? `<div class="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"><h3 class="font-display font-bold mb-2">Vision</h3><p class="text-sm text-[#64748B]">${FHD.escapeHtml(profile.vision)}</p></div>` : ''}
              ${profile.foundedYear ? `<div class="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"><h3 class="font-display font-bold mb-2">Founded</h3><p class="text-sm text-[#64748B]">${FHD.escapeHtml(String(profile.foundedYear))}</p></div>` : ''}
              ${profile.headquarters ? `<div class="p-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0]"><h3 class="font-display font-bold mb-2">Headquarters</h3><p class="text-sm text-[#64748B]">${FHD.escapeHtml(profile.headquarters)}</p></div>` : ''}
            </div>
          </div></section>
          ${valueCards ? `<section class="py-24 bg-white"><div class="max-w-7xl mx-auto px-6"><div class="text-center mb-14"><h2 class="section-title text-4xl mb-4">Our Values</h2></div><div class="grid md:grid-cols-3 gap-8">${valueCards}</div></div></section>` : ''}
          <section class="py-24 bg-[#0F172A] text-white">
            <div class="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8 text-center">
              <div class="reveal"><div class="text-5xl font-display font-black text-primary mb-2">${FHD.escapeHtml(stats.teamMembers || '—')}</div><div class="text-[#94A3B8] font-medium uppercase tracking-wider text-sm">Team Members</div></div>
              <div class="reveal reveal-delay-1"><div class="text-5xl font-display font-black text-primary mb-2">${FHD.escapeHtml(stats.happyCustomers || '—')}</div><div class="text-[#94A3B8] font-medium uppercase tracking-wider text-sm">Happy Customers</div></div>
              <div class="reveal reveal-delay-2"><div class="text-5xl font-display font-black text-primary mb-2">${FHD.escapeHtml(stats.thrivingAffiliates || '—')}</div><div class="text-[#94A3B8] font-medium uppercase tracking-wider text-sm">Thriving Affiliates</div></div>
              <div class="reveal reveal-delay-3"><div class="text-5xl font-display font-black text-primary mb-2">${productCount || '—'}</div><div class="text-[#94A3B8] font-medium uppercase tracking-wider text-sm">Products</div></div>
            </div>
          </section>
          ${timeline.length ? `<section class="py-16 bg-[#F8FAFC]"><div class="max-w-3xl mx-auto px-6"><h2 class="section-title text-3xl mb-10 text-center">Timeline</h2><div class="space-y-6">${timeline.map(t => `
            <div class="p-6 bg-white rounded-2xl border border-[#E2E8F0]">
              <p class="text-xs font-mono text-primary mb-1">${FHD.formatDate(t.date || t.year)}</p>
              <h3 class="font-display font-bold text-lg">${FHD.escapeHtml(t.title || t.event)}</h3>
              <p class="text-sm text-[#64748B] mt-2">${FHD.escapeHtml(t.description || '')}</p>
            </div>`).join('')}</div></div></section>` : ''}`;
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async reviews() {
      const el = document.getElementById('reviews-grid');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getReviews();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? `<div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">${list.map(reviewCard).join('')}</div>` : FHD.emptyHtml('No reviews published yet.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async roadmap() {
      const el = document.getElementById('roadmap-list');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      try {
        const data = await api().getRoadmap();
        const list = FHD.api.unwrapList(data);
        el.innerHTML = list.length ? list.map(item => `
          <div class="p-6 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-all">
            <div class="flex items-center justify-between gap-4 mb-3">
              <h3 class="font-display font-bold text-lg text-[#0F172A]">${FHD.escapeHtml(item.title)}</h3>
              ${statusBadge(item.status)}
            </div>
            <p class="text-sm text-[#64748B] mb-3">${FHD.escapeHtml(item.description || '')}</p>
            <div class="flex gap-2"><span class="tag">${FHD.escapeHtml(item.category || '')}</span><span class="tag">${FHD.escapeHtml(item.targetPeriod || '')}</span></div>
          </div>`).join('') : FHD.emptyHtml('Roadmap items will appear when published.');
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async network() {
      const partnersEl = document.getElementById('partners-grid');
      const subsEl = document.getElementById('subsidiaries-grid');
      try {
        const [partners, subs] = await Promise.all([api().getPartners(), api().getSubsidiaries()]);
        const pList = FHD.api.unwrapList(partners);
        const sList = FHD.api.unwrapList(subs);
        if (partnersEl) partnersEl.innerHTML = pList.length ? pList.map(x => `
          <div class="p-6 rounded-2xl border border-[#E2E8F0] text-center">
            ${x.logo ? `<img src="${FHD.escapeHtml(x.logo)}" alt="" class="h-12 mx-auto mb-4 object-contain" />` : `<div class="w-12 h-12 rounded-xl bg-[#EFF6FF] mx-auto mb-4 flex items-center justify-center font-bold text-primary">${FHD.escapeHtml((x.name||'P').charAt(0))}</div>`}
            <h3 class="font-display font-bold">${FHD.escapeHtml(x.name)}</h3>
            <p class="text-sm text-[#64748B] mt-2">${FHD.escapeHtml(x.description || '')}</p>
          </div>`).join('') : FHD.emptyHtml('Partners will appear here when added.');
        if (subsEl) subsEl.innerHTML = sList.length ? sList.map(x => `
          <div class="p-6 rounded-2xl border border-[#E2E8F0]">
            <h3 class="font-display font-bold text-lg mb-2">${FHD.escapeHtml(x.name)}</h3>
            <p class="text-sm text-[#64748B]">${FHD.escapeHtml(x.description || '')}</p>
          </div>`).join('') : FHD.emptyHtml('Subsidiaries will appear here when added.');
      } catch (e) {
        if (partnersEl) partnersEl.innerHTML = FHD.errorHtml(e.message);
      }
    },

    async status() {
      const el = document.getElementById('status-content');
      if (!el) return;
      el.innerHTML = FHD.loadingHtml('Checking system status...');
      try {
        const data = await api().getSystemStatus();
        const services = data.services || {};
        el.innerHTML = `
          <div class="text-center mb-12">
            ${statusBadge(data.status)}
            <h1 class="section-title text-4xl mt-4 mb-2">System Status</h1>
            <p class="text-[#64748B]">Last updated: ${FHD.formatDate(data.timestamp)}</p>
          </div>
          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            ${Object.entries(services).map(([name, status]) => `
              <div class="p-5 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                <span class="font-medium text-[#0F172A] capitalize">${FHD.escapeHtml(name.replace(/_/g, ' '))}</span>
                ${statusBadge(status)}
              </div>`).join('')}
          </div>
          <p class="text-center text-xs text-[#94A3B8] mt-8 font-mono">API v${FHD.escapeHtml(data.version || '')} · Uptime ${Math.floor((data.uptime || 0) / 60)}m</p>`;
      } catch (e) { el.innerHTML = FHD.errorHtml(e.message); }
    },

    async cmsFallback(containerId, fetchFn, renderFn, emptyMsg) {
      const el = document.getElementById(containerId);
      if (!el) return;
      el.innerHTML = FHD.loadingHtml();
      const data = await fetchFn();
      const list = FHD.api.unwrapList(data);
      el.innerHTML = list?.length ? renderFn(list) : FHD.emptyHtml(emptyMsg || 'Content coming soon.');
    },

    async press() {
      await pages.cmsFallback('press-list', () => api().getPress(), list => list.map(p => blogCard(p, 0)).join(''), 'Press releases will appear when published.');
    },

    async community() {
      await pages.cmsFallback('community-content', () => api().getCommunity(), list => list.map(x => `<div class="p-6 border border-[#E2E8F0] rounded-xl">${FHD.escapeHtml(x.title || x.name)}</div>`).join(''), 'Community hub content coming soon.');
    },

    async events() {
      await pages.cmsFallback('events-list', () => api().getEvents(), list => list.map(e => `
        <div class="p-6 rounded-2xl border border-[#E2E8F0]">
          <h3 class="font-display font-bold text-lg">${FHD.escapeHtml(e.title || e.name)}</h3>
          <p class="text-sm text-[#94A3B8] mt-1">${FHD.formatDate(e.startDate || e.date)}</p>
          <p class="text-[#64748B] mt-3">${FHD.escapeHtml(e.description || '')}</p>
        </div>`).join(''), 'No upcoming events.');
    },

    async sponsorships() {
      await pages.cmsFallback('sponsors-grid', () => api().getSponsorships(), list => list.map(s => `
        <div class="p-6 rounded-2xl border border-[#E2E8F0] text-center">
          <h3 class="font-display font-bold">${FHD.escapeHtml(s.name || s.title)}</h3>
          <p class="text-sm text-[#64748B] mt-2">${FHD.escapeHtml(s.description || s.tier || '')}</p>
        </div>`).join(''), 'Sponsor information coming soon.');
    },

    async downloads() {
      await pages.cmsFallback('downloads-list', () => api().getDownloads(), list => list.map(d => `
        <div class="flex items-center justify-between p-5 rounded-xl border border-[#E2E8F0]">
          <div><h3 class="font-display font-bold">${FHD.escapeHtml(d.name || d.title)}</h3><p class="text-sm text-[#64748B]">${FHD.escapeHtml(d.description || '')}</p></div>
          <a href="${FHD.escapeHtml(d.url || '#')}" class="btn-primary text-sm py-2 px-4">Download</a>
        </div>`).join(''), 'No downloads available yet.');
    },

    async features() {
      await pages.cmsFallback('features-grid', () => api().getFeatures(), list => list.map((f, i) => `
        <div class="p-8 rounded-2xl border border-[#E2E8F0] hover:shadow-md transition-all">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br ${gradient(i)} flex items-center justify-center mb-5 font-bold text-primary">${FHD.escapeHtml((f.title||'F').charAt(0))}</div>
          <h3 class="font-display font-bold text-xl mb-2">${FHD.escapeHtml(f.title || f.name)}</h3>
          <p class="text-[#64748B] text-sm">${FHD.escapeHtml(f.description || '')}</p>
        </div>`).join(''), 'Features will be loaded from CMS.');
    },

    async search() {
      const input = document.getElementById('main-search');
      const results = document.getElementById('search-results');
      const empty = document.getElementById('search-empty');
      const prompt = document.getElementById('search-prompt');
      if (!input || !results) return;

      async function run(q) {
        if (!q.trim()) {
          results.innerHTML = '';
          empty?.classList.add('hidden');
          prompt?.classList.remove('hidden');
          return;
        }
        prompt?.classList.add('hidden');
        results.innerHTML = FHD.loadingHtml('Searching...');
        try {
          const data = await api().search(q);
          const r = data.results || data;
          const items = [];
          const types = ['products', 'services', 'blog', 'docs', 'faq', 'careers', 'changelog', 'projects'];
          types.forEach(type => {
            (r[type] || []).forEach(item => {
              const slug = item.slug;
              let url = '#';
              if (type === 'products') url = p() + 'pages/product.html?slug=' + slug;
              else if (type === 'services') url = p() + 'pages/service.html?slug=' + slug;
              else if (type === 'blog') url = p() + 'pages/blog-article.html?slug=' + slug;
              else if (type === 'docs') url = FHD.docsUrl(slug);
              else if (type === 'faq') url = p() + 'pages/faq.html';
              else if (type === 'careers') url = p() + 'pages/career.html?slug=' + slug;
              items.push({ type, title: item.name || item.title || item.question, desc: item.excerpt || item.description || item.answer || '', url });
            });
          });
          if (!items.length) {
            results.innerHTML = '';
            empty?.classList.remove('hidden');
            return;
          }
          empty?.classList.add('hidden');
          results.innerHTML = items.map(i => `
            <a href="${i.url}" class="block p-4 rounded-xl border border-[#E2E8F0] hover:border-primary/30 hover:bg-[#EFF6FF] transition-all">
              <span class="text-xs font-semibold text-primary uppercase">${FHD.escapeHtml(i.type)}</span>
              <h3 class="font-display font-bold text-[#0F172A] mt-1">${FHD.escapeHtml(i.title)}</h3>
              <p class="text-sm text-[#64748B] mt-1 line-clamp-2">${FHD.escapeHtml(i.desc)}</p>
            </a>`).join('');
        } catch (e) {
          results.innerHTML = FHD.errorHtml(e.message);
        }
      }

      input.addEventListener('input', () => run(input.value));
      const q = FHD.getQueryParam('q');
      if (q) { input.value = q; run(q); }
    },

    async contactForm() {
      const form = document.querySelector('[data-form="contact"]');
      if (!form) return;
      try {
        const company = await api().getCompany();
        const profile = company?.profile;
        const info = document.getElementById('contact-info');
        if (info && profile) {
          info.innerHTML = `
            ${profile.email ? `<p><strong>Email:</strong> <a href="mailto:${FHD.escapeHtml(profile.email)}" class="text-primary">${FHD.escapeHtml(profile.email)}</a></p>` : ''}
            ${profile.phone ? `<p class="mt-2"><strong>Phone:</strong> ${FHD.escapeHtml(profile.phone)}</p>` : ''}
            ${profile.headquarters ? `<p class="mt-2"><strong>Location:</strong> ${FHD.escapeHtml(profile.headquarters)}</p>` : ''}`;
        }
      } catch { /* optional */ }

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
        try {
          const fd = new FormData(form);
          await api().submitContact(Object.fromEntries(fd.entries()));
          FHD.toast('Message sent successfully!', 'success');
          form.reset();
        } catch (err) {
          FHD.toast(err.message || 'Failed to send message', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async supportForm() {
      const form = document.querySelector('[data-form="support"]');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Submitting...'; }
        try {
          const fd = new FormData(form);
          await api().createSupportTicket(Object.fromEntries(fd.entries()));
          FHD.toast('Support ticket created!', 'success');
          form.reset();
        } catch (err) {
          if (err.status === 401) FHD.toast('Please sign in to create a support ticket', 'warning');
          else FHD.toast(err.message || 'Failed to create ticket', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async authLogin() {
      const form = document.querySelector('[data-form="login"]');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Signing in...'; }
        try {
          const fd = new FormData(form);
          const data = await api().login({ email: fd.get('email'), password: fd.get('password') });
          const token = data.token || data.accessToken;
          if (token) localStorage.setItem('fhd-token', token);
          if (data.refreshToken) localStorage.setItem('fhd-refresh-token', data.refreshToken);
          FHD.toast('Signed in successfully!', 'success');
          setTimeout(() => { window.location.href = FHD.pageUrl('index.html'); }, 1000);
        } catch (err) {
          FHD.toast(err.message || 'Invalid credentials', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async authRegister() {
      const form = document.querySelector('[data-form="register"]');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const errEl = document.getElementById('reg-error');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Creating...'; }
        if (errEl) errEl.classList.add('hidden');
        try {
          const fd = new FormData(form);
          const payload = {
            username: fd.get('username'),
            email: fd.get('email'),
            password: fd.get('password'),
          };
          const displayName = fd.get('displayName');
          if (displayName) payload.displayName = displayName;
          await api().register(payload);
          FHD.toast('Account created! Please verify your email.', 'success');
          setTimeout(() => { window.location.href = 'verify-email.html'; }, 1500);
        } catch (err) {
          const msg = err.message || 'Registration failed';
          FHD.toast(msg, 'error');
          if (errEl) { errEl.textContent = msg; errEl.classList.remove('hidden'); }
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async authForgot() {
      const form = document.querySelector('[data-form="forgot"]');
      if (!form) return;
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = form.querySelector('[type="submit"]');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Sending...'; }
        try {
          const fd = new FormData(form);
          await api().forgotPassword({ email: fd.get('email') });
          FHD.toast('Reset link sent! Check your inbox.', 'success');
          form.reset();
        } catch (err) {
          FHD.toast(err.message || 'Could not send reset link', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async authReset() {
      const form = document.querySelector('[data-form="reset"]');
      if (!form) return;
      const token = FHD.getQueryParam('token');
      if (!token) {
        FHD.toast('Invalid or missing reset token.', 'error');
        return;
      }
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const password = fd.get('password');
        const confirm = fd.get('confirmPassword');
        if (password !== confirm) {
          FHD.toast('Passwords do not match.', 'error');
          return;
        }
        const btn = form.querySelector('[type="submit"]');
        const orig = btn?.textContent;
        if (btn) { btn.disabled = true; btn.textContent = 'Updating...'; }
        try {
          await api().resetPassword({ token, password });
          FHD.toast('Password updated! You can now sign in.', 'success');
          setTimeout(() => { window.location.href = 'login.html'; }, 1500);
        } catch (err) {
          FHD.toast(err.message || 'Could not reset password', 'error');
        } finally {
          if (btn) { btn.disabled = false; btn.textContent = orig; }
        }
      });
    },

    async authVerify() {
      const msg = document.getElementById('verify-message');
      const token = FHD.getQueryParam('token');
      if (!token) {
        if (msg) msg.textContent = 'Check your inbox for a verification link, then return here to sign in.';
        return;
      }
      if (msg) msg.textContent = 'Verifying your email...';
      try {
        await api().verifyEmail(token);
        if (msg) msg.textContent = 'Email verified successfully! You can now sign in.';
        FHD.toast('Email verified!', 'success');
      } catch (err) {
        if (msg) msg.textContent = err.message || 'Verification failed. The link may have expired.';
        FHD.toast(err.message || 'Verification failed', 'error');
      }
    },
  };

  FHD.pages = pages;

  FHD.loadNavProducts = async function () {
    const menu = document.getElementById('nav-products-menu');
    const count = document.getElementById('nav-products-count');
    if (!menu) return;
    try {
      const data = await api().getProducts();
      const list = FHD.api.unwrapList(data).slice(0, 6);
      menu.innerHTML = list.length
        ? list.map(x => `
          <a href="${p()}pages/product.html?slug=${encodeURIComponent(x.slug)}" class="dropdown-item">
            <div class="dropdown-icon"><span class="font-display font-bold text-primary text-xs">${FHD.escapeHtml(x.name.charAt(0))}</span></div>
            <div><div class="dropdown-item-title">${FHD.escapeHtml(x.name)}</div><div class="dropdown-item-desc">${FHD.escapeHtml(x.tagline || x.description || '')}</div></div>
          </a>`).join('')
        : `<a href="${p()}pages/products.html" class="dropdown-item col-span-2"><div><div class="dropdown-item-title">Browse Products</div><div class="dropdown-item-desc">View the product catalog</div></div></a>`;
      if (count) count.textContent = list.length ? `${list.length} product${list.length === 1 ? '' : 's'} available` : 'Browse products';
    } catch {
      menu.innerHTML = `<a href="${p()}pages/products.html" class="dropdown-item col-span-2">Browse All Products →</a>`;
    }
  };

  FHD.initPage = async function () {
    if (FHD.initNav) FHD.initNav();
    FHD.initFooter?.();
    const body = document.body;
    const page = body.dataset.page;
    FHD.loadNavProducts?.().catch(() => {});
    FHD.loadNavServices?.().catch(() => {});
    if (!page || !pages[page]) return;
    try {
      await pages[page]();
      document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => el.classList.add('visible'));
    } catch (e) {
      console.error('[FHD]', page, e);
    }
  };

  FHD.initFooter = function () {
    const prefix = FHD.getPathPrefix();
    const footer = document.querySelector('footer');
    if (footer?.dataset.commonFooter !== 'true') footer?.remove();
    if (document.querySelector('footer[data-common-footer="true"]')) return;

    document.body.insertAdjacentHTML('beforeend', `
      <footer data-common-footer="true" class="fhd-generated-footer bg-[#0F172A] text-white mt-20 pt-14 pb-8">
        <div class="max-w-7xl mx-auto px-6">
          <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div class="lg:col-span-2">
              <a href="${prefix}index.html" class="inline-flex mb-5">${FHD.logoImg('h-10 w-auto object-contain')}</a>
              <p class="text-[#94A3B8] text-sm leading-relaxed max-w-md">FH Developments builds dependable software, developer tools, Roblox systems, and backend hosting for communities and creators.</p>
              <div class="flex gap-2 mt-6"><a class="footer-icon-link" href="${prefix}pages/community.html" aria-label="Community"><i data-lucide="message-circle"></i></a><a class="footer-icon-link" href="https://github.com/FH-Development-Workspace" target="_blank" rel="noopener" aria-label="GitHub"><i data-lucide="github"></i></a><a class="footer-icon-link" href="mailto:hosting@fh-development.xyz" aria-label="Email"><i data-lucide="mail"></i></a></div>
            </div>
            <div>
              <h2 class="font-display font-bold text-sm mb-4"><i data-lucide="compass" class="inline-icon"></i> Explore</h2>
              <div class="grid gap-2 text-sm">
                <a class="footer-link" href="${prefix}pages/products.html">Products</a>
                <a class="footer-link" href="${prefix}pages/services.html">Services</a>
                <a class="footer-link" href="${prefix}pages/hosting.html">Code Hosting</a>
                <a class="footer-link" href="${prefix}pages/support.html">Support</a>
              </div>
            </div>
            <div>
              <h2 class="font-display font-bold text-sm mb-4"><i data-lucide="headphones" class="inline-icon"></i> Contact</h2>
              <div class="grid gap-2 text-sm">
                <a class="footer-link" href="${prefix}pages/contact.html">Contact FH Developments</a>
                <a class="footer-link" href="mailto:support@fh-development.xyz>">support@fh-development.xyz</a>
                <a class="footer-link" href="${FHD_CONFIG.STATUS_URL}" target="_blank" rel="noopener">System status</a>
              </div>
            </div>
          </div>
          <div class="gradient-hr my-8"></div>
          <p class="text-[#64748B] text-xs">© ${new Date().getFullYear()} FH Developments. All rights reserved.</p>
        </div>
      </footer>`);
    const hydrateIcons = () => window.lucide?.createIcons?.();
    if (window.lucide) hydrateIcons();
    else {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lucide@latest';
      script.onload = hydrateIcons;
      document.head.appendChild(script);
    }
  };
})(window.FHD);
