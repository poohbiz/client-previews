const form = document.getElementById("quoteForm");
const toast = document.getElementById("toast");

function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

/* --- Sticky-header scroll offset support --- */
function setScrollOffset() {
  const header = document.querySelector(".sticky");
  const extraPadding = 12;
  const offset = (header?.offsetHeight || 0) + extraPadding;
  document.documentElement.style.setProperty("--scroll-offset", `${offset}px`);
}

setScrollOffset();
window.addEventListener("resize", setScrollOffset);

document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;

  const hash = link.getAttribute("href");
  if (!hash || hash === "#") return;

  const target = document.querySelector(hash);
  if (!target) return;

  e.preventDefault();
  setScrollOffset();
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  history.pushState(null, "", hash);
});

/* --- Fill the page from config.js --- */
function el(id) {
  return document.getElementById(id);
}

function stripHtml(html) {
  return String(html || "")
    .replace(/<[^>]*>/g, "")
    .trim();
}

function renderList(containerId, items, renderer) {
  const container = el(containerId);
  if (!container) return;
  const safeItems = Array.isArray(items) ? items : [];
  container.innerHTML = safeItems.map(renderer).join("");
}

function initFromConfig() {
  const c = window.SITE;
  if (!c) return;

  // Title + meta (strip HTML from meta description)
  document.title = `${c.businessName} | ${c.city}, ${c.state}`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute(
      "content",
      `${c.trade} in ${c.city}, ${c.state}. ${stripHtml(c.subhead)}`,
    );
  }

  // Brand + footer
  if (el("bizName")) el("bizName").textContent = c.businessName;
  if (el("bizNameFooter")) el("bizNameFooter").textContent = c.businessName;
  if (el("cityState")) el("cityState").textContent = `${c.city}, ${c.state}`;

  // Logo + taline
  if (el("tagline"))
    el("tagline").textContent = `${c.trade} • ${c.city}, ${c.state}`;

  const logo = el("logoImg");
  if (logo) {
    if (c.logoSrc) {
      logo.src = c.logoSrc;
      logo.alt = `${c.businessName} logo`;
      logo.style.display = "block";
    } else {
      logo.style.display = "none";
    }
  }

  // Phone links
  const telHref = `tel:${c.phoneE164}`;
  const smsHref = `sms:${c.phoneE164}`;

  const callBtn = el("callBtn");
  const textBtn = el("textBtn");
  const footerPhone = el("footerPhone");

  if (callBtn) callBtn.href = telHref;
  if (textBtn) textBtn.href = smsHref;

  if (footerPhone) {
    footerPhone.href = telHref;
    footerPhone.textContent = c.phoneDisplay;
  }

  // CTA labels
  if (el("ctaBtn") && c.ctaLabel) el("ctaBtn").textContent = c.ctaLabel;
  if (el("formTitle") && c.ctaLabel)
    el("formTitle").textContent = `Get a ${c.ctaLabel}`;
  if (el("formSubmit") && c.ctaLabel)
    el("formSubmit").textContent = `Request ${c.ctaLabel}`;

  // Hero
  if (el("headline")) el("headline").textContent = c.headline;

  // Keep bold keywords by using innerHTML (since config is your own content)
  if (el("subhead")) el("subhead").innerHTML = c.subhead;

  // Checks + pills
  renderList("checks", c.checks, (t) => `<span>${t}</span>`);
  renderList("pills", c.pills, (t) => `<div class="pill">${t}</div>`);

  // Services
  renderList(
    "services",
    c.services,
    (s) =>
      `<div class="item"><b>${s.title}</b><span class="sub">${s.desc}</span></div>`,
  );

  // Testimonials
  renderList(
    "testimonials",
    c.testimonials,
    (t) =>
      `<div class="item"><b>“${t.quote}”</b><span class="sub">— ${t.name}</span></div>`,
  );

  const tWrap = el("testimonials")?.closest(".section");
  if (
    tWrap &&
    (!Array.isArray(c.testimonials) || c.testimonials.length === 0)
  ) {
    tWrap.style.display = "none";
  }

  // FAQs
  renderList(
    "faqs",
    c.faqs,
    (f) =>
      `<div class="item"><b>${f.q}</b><span class="sub">${f.a}</span></div>`,
  );

  // Service area
  if (el("serviceAreaTitle"))
    el("serviceAreaTitle").textContent = c.serviceAreaTitle;
  if (el("serviceAreaText"))
    el("serviceAreaText").textContent = c.serviceAreaText;

  if (c.colors) {
    const root = document.documentElement.style;
    if (c.colors.accent) root.setProperty("--accent", c.colors.accent);
    if (c.colors.accent2) root.setProperty("--accent2", c.colors.accent2);
    if (c.colors.bg) root.setProperty("--bg", c.colors.bg);
    if (c.colors.text) root.setProperty("--text", c.colors.text);
    if (c.colors.muted) root.setProperty("--muted", c.colors.muted);
  }

  // Is it a mockup or demo?
  if (el("mockupNote")) {
    if (c.isProofDemo) {
      el("mockupNote").style.display = "block";
      el("mockupNote").textContent =
        "Preview mockup for Junk Solutions. Final version can include real form delivery (email/SMS) and optional call tracking.";
    } else {
      el("mockupNote").style.display = "none";
    }
  }
}

initFromConfig();

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg =
    window.SITE?.formSuccessMessage || "Thanks! We’ll get back to you shortly.";
  showToast(msg);
  form.reset();
});
