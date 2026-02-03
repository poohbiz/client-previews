(function () {
  const SITE = window.SITE || {};
  const GALLERY = window.GALLERY || [];
  const FEATURED_COUNT = window.FEATURED_COUNT || 8;

  // Helpers
  const qs = (sel, root = document) => root.querySelector(sel);
  const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===== BEGIN TRACKING HELPERS =====
  // Minimal GA4 + attribution (UTM) capture. Safe if ga4Id is blank.
  const ATTR_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_term",
    "src",
    "gclid",
    "fbclid",
  ];

  function readAttributionFromUrl() {
    const params = new URLSearchParams(window.location.search || "");
    const out = {};
    ATTR_KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) out[k] = v;
    });
    return out;
  }

  function getAttribution() {
    try {
      const raw = sessionStorage.getItem("ht_attrib");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  function storeAttribution() {
    const fresh = readAttributionFromUrl();
    if (!Object.keys(fresh).length) return;
    const prev = getAttribution();
    const merged = { ...prev, ...fresh };
    try {
      sessionStorage.setItem("ht_attrib", JSON.stringify(merged));
    } catch {}
  }

  function buildOutboundUrl(url) {
    try {
      if (!url || url === "#") return url;

      // Only append params to absolute http(s) URLs (Square booking, Maps share URLs, etc.)
      const isAbsolute = /^https?:\/\//i.test(url);
      if (!isAbsolute) return url;

      const u = new URL(url);
      const attrib = getAttribution();
      Object.entries(attrib).forEach(([k, v]) => {
        if (!u.searchParams.get(k)) u.searchParams.set(k, String(v));
      });
      return u.toString();
    } catch {
      return url;
    }
  }

  // GA4 init (only if ID provided)
  function initGa4() {
    const tid = (SITE.tracking && SITE.tracking.ga4Id) || "";
    if (!tid) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    // Load gtag script async
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
      tid,
    )}`;
    document.head.appendChild(s);

    window.gtag("js", new Date());
    // Disable auto page_view so we can control it (works with static multi-page sites)
    window.gtag("config", tid, { send_page_view: false });
  }

  function track(eventName, props = {}) {
    const debug = !!(SITE.tracking && SITE.tracking.debug);
    const tid = (SITE.tracking && SITE.tracking.ga4Id) || "";
    const attrib = getAttribution();
    const payload = { ...attrib, ...props };

    if (tid && typeof window.gtag === "function") {
      window.gtag("event", eventName, payload);
    } else if (debug) {
      // eslint-disable-next-line no-console
      console.log("[track]", eventName, payload);
    }
  }

  function trackPageView() {
    const tid = (SITE.tracking && SITE.tracking.ga4Id) || "";
    if (tid && typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_location: window.location.href,
        page_path:
          window.location.pathname +
          window.location.search +
          window.location.hash,
      });
    } else if (SITE.tracking && SITE.tracking.debug) {
      // eslint-disable-next-line no-console
      console.log("[track] page_view", window.location.pathname);
    }
  }

  // Must run AFTER helpers are defined
  storeAttribution();
  initGa4();
  trackPageView();
  // ===== END TRACKING HELPERS =====

  const phoneRaw = (SITE.phone || "").replace(/\s/g, "");
  const phonePretty = formatPhonePretty(phoneRaw);

  // Bind common links/text
  qsa('[data-bind="bookingHref"]').forEach(
    (a) => (a.href = buildOutboundUrl(SITE.bookingUrl) || "#"),
  );
  qsa('[data-bind="igHref"]').forEach(
    (a) => (a.href = SITE.instagramUrl || "#"),
  );
  qsa('[data-bind="textHref"]').forEach(
    (a) => (a.href = phoneRaw ? `sms:${phoneRaw}` : "#"),
  );
  qsa('[data-bind="phonePretty"]').forEach(
    (el) => (el.textContent = phonePretty || "(555) 555-5555"),
  );
  qsa('[data-bind="locationShort"]').forEach(
    (el) => (el.textContent = SITE.locationShort || ""),
  );
  qsa('[data-bind="locationLong"]').forEach(
    (el) => (el.textContent = SITE.locationLong || ""),
  );
  qsa('[data-bind="responseTime"]').forEach(
    (el) => (el.textContent = SITE.responseTime || "Within 24 hours"),
  );
  qsa('[data-bind="mapsHref"]').forEach(
    (a) => (a.href = buildOutboundUrl(SITE.mapsUrl) || "#"),
  );
  qsa('[data-bind="mapsEmbedSrc"]').forEach((iframe) => {
    iframe.src = SITE.mapsEmbedUrl || "#";
  });

  // Track key conversion clicks
  qsa('[data-bind="bookingHref"]').forEach((el) => {
    el.addEventListener("click", () =>
      track("book_click", { href: el.getAttribute("href") || "" }),
    );
  });
  qsa('[data-bind="textHref"]').forEach((el) => {
    el.addEventListener("click", () =>
      track("text_click", { href: el.getAttribute("href") || "" }),
    );
  });
  qsa('[data-bind="igHref"]').forEach((el) => {
    el.addEventListener("click", () =>
      track("instagram_click", { href: el.getAttribute("href") || "" }),
    );
  });
  qsa('[data-bind="mapsHref"]').forEach((el) => {
    el.addEventListener("click", () =>
      track("directions_click", { href: el.getAttribute("href") || "" }),
    );
  });
  qsa('[data-bind="stylistPhoto"]').forEach((img) => {
    if (SITE.stylistPhoto) img.src = SITE.stylistPhoto;
    if (SITE.stylistName) img.alt = SITE.stylistName;
  });
  // Footer year
  const y = qs("#year");
  if (y) y.textContent = String(new Date().getFullYear());

  // Mobile nav
  const btn = qs("#navbtn");
  const nav = qs("#nav");
  if (btn && nav) {
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
    });
    qsa("a", nav).forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Reveal animations
  initReveal();
  applyStickySpacer();
  window.addEventListener("resize", applyStickySpacer);

  // Hero collage images
  const heroImgs = qsa("[data-hero]");
  if (heroImgs.length && Array.isArray(SITE.heroImages)) {
    heroImgs.forEach((imgEl) => {
      const idx = Number(imgEl.getAttribute("data-hero"));
      if (SITE.heroImages[idx]) imgEl.src = SITE.heroImages[idx];
    });
  }

  // Featured filmstrip (home)
  const strip = qs("[data-featured-strip]");
  if (strip) {
    const featured = GALLERY.slice(0, FEATURED_COUNT);
    strip.innerHTML = featured.map((item, i) => filmCard(item, i)).join("");
    // attach click -> lightbox
    wireLightboxFromContainer(strip, featured);
  }

  // Gallery page
  const grid = qs("#galleryGrid");
  const filtersEl = qs("#filters");
  if (grid && filtersEl) {
    const tags = collectTags(GALLERY);
    renderFilters(filtersEl, tags);
    let active = getHashTag() || "all";
    setActiveFilter(filtersEl, active);
    renderGallery(grid, GALLERY, active);

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-filter]");
      if (!btn) return;
      active = btn.getAttribute("data-filter");
      track("gallery_filter", { filter: active });
      setActiveFilter(filtersEl, active);
      renderGallery(grid, GALLERY, active);
      setHashTag(active);
    });

    // If user navigates with browser hash changes
    window.addEventListener("hashchange", () => {
      const next = getHashTag() || "all";
      active = next;
      setActiveFilter(filtersEl, active);
      renderGallery(grid, GALLERY, active);
    });
  }

  // Lightbox global
  const lb = initLightbox();

  function renderGallery(container, items, filter) {
    const filtered =
      filter === "all"
        ? items
        : items.filter((x) => (x.tag || "").toLowerCase() === filter);
    container.innerHTML = filtered.map((item, i) => tileCard(item, i)).join("");
    wireLightboxFromContainer(container, filtered);
  }

  function wireLightboxFromContainer(container, items) {
    qsa("[data-lb-idx]", container).forEach((tile) => {
      tile.addEventListener("click", () => {
        const idx = Number(tile.getAttribute("data-lb-idx"));
        track("lightbox_open", {
          index: idx,
          caption: (items[idx] || {}).caption || "",
        });
        lb.open(items, idx);
      });
    });
  }

  function filmCard(item, idx) {
    const cap = escapeHtml(item.caption || item.tag || "");
    const alt = escapeHtml(item.alt || "Hair photo");
    return `
      <div class="film" data-lb-idx="${idx}">
        <img src="${item.src}" alt="${alt}" loading="lazy" />
        <div class="film__cap">${cap}</div>
      </div>
    `;
  }

  function tileCard(item, idx) {
    const cap = escapeHtml(item.caption || item.tag || "");
    const alt = escapeHtml(item.alt || "Hair photo");
    return `
      <div class="tile" data-lb-idx="${idx}">
        <img src="${item.src}" alt="${alt}" loading="lazy" />
        <div class="tile__cap">
          <span>${cap}</span>
          <span>Tap to expand</span>
        </div>
      </div>
    `;
  }

  function collectTags(items) {
    const set = new Set(
      items.map((x) => String(x.tag || "").toLowerCase()).filter(Boolean),
    );
    const list = Array.from(set).sort();
    return ["all", ...list];
  }

  function renderFilters(container, tags) {
    container.innerHTML = tags
      .map((t) => {
        const label = t === "all" ? "All" : t;
        return `<button class="filterbtn" type="button" data-filter="${t}">${label}</button>`;
      })
      .join("");
  }

  function setActiveFilter(container, value) {
    qsa(".filterbtn", container).forEach((b) =>
      b.classList.toggle("is-active", b.getAttribute("data-filter") === value),
    );
  }

  function getHashTag() {
    const h = (window.location.hash || "")
      .replace("#", "")
      .trim()
      .toLowerCase();
    return h || "";
  }

  function setHashTag(tag) {
    if (!tag) return;
    if (tag === "all") {
      history.replaceState(null, "", window.location.pathname);
      return;
    }
    history.replaceState(null, "", `#${tag}`);
  }

  function initLightbox() {
    const lightbox = qs("#lightbox");
    const img = qs("#lbImg");
    const cap = qs("#lbCap");
    const close = qs("#lbClose");
    const prev = qs("#lbPrev");
    const next = qs("#lbNext");

    if (!lightbox || !img || !cap || !close || !prev || !next) {
      return { open: () => {} };
    }

    let items = [];
    let index = 0;

    const open = (arr, idx) => {
      items = arr || [];
      index = clamp(idx, 0, items.length - 1);
      render();
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    };

    const hide = () => {
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    const render = () => {
      const item = items[index];
      if (!item) return;
      img.src = item.src;
      img.alt = item.alt || "Expanded photo";
      cap.textContent = (item.caption || item.tag || "").toUpperCase();
    };

    const go = (dir) => {
      if (!items.length) return;
      index = (index + dir + items.length) % items.length;
      render();
    };

    close.addEventListener("click", hide);
    prev.addEventListener("click", () => go(-1));
    next.addEventListener("click", () => go(1));

    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) hide();
    });

    window.addEventListener("keydown", (e) => {
      if (!lightbox.classList.contains("is-open")) return;
      if (e.key === "Escape") hide();
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    });

    return { open };
  }

  function initReveal() {
    const els = qsa(".reveal");
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      { threshold: 0.12 },
    );

    els.forEach((el) => io.observe(el));
  }

  function formatPhonePretty(phone) {
    // naive US formatting: +1XXXXXXXXXX
    const digits = (phone || "").replace(/[^\d]/g, "");
    if (digits.length === 11 && digits.startsWith("1")) {
      const a = digits.slice(1, 4);
      const b = digits.slice(4, 7);
      const c = digits.slice(7);
      return `(${a}) ${b}-${c}`;
    }
    if (digits.length === 10) {
      const a = digits.slice(0, 3);
      const b = digits.slice(3, 6);
      const c = digits.slice(6);
      return `(${a}) ${b}-${c}`;
    }
    return phone || "";
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // Reserve space so the sticky CTA doesn't cover the footer
  function applyStickySpacer() {
    const sticky = qs("#stickybook");
    if (!sticky) return;

    // If it's not displayed (desktop), remove spacing
    const isVisible = window.getComputedStyle(sticky).display !== "none";
    if (!isVisible) {
      document.documentElement.style.setProperty("--sticky-space", "0px");
      return;
    }

    const h = sticky.offsetHeight || 0;
    // 12px bottom offset + a little extra cushion
    const space = h + 24;
    document.documentElement.style.setProperty("--sticky-space", `${space}px`);
  }
})();
