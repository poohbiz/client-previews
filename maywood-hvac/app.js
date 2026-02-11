// brewing-hvac/app.js
// Self-contained tracking + UX for the concept demo.
// If you later add GA4, swap the console logger with gtag().

(() => {
  const safeTrack = (name, params = {}) => {
    // Keep it simple + consistent for "proof-of-life"
    console.log("[track]", name, params);
    // Hook for future GA4:
    // if (window.gtag) window.gtag('event', name, params);
  };

  // Track clicks for any element with data-track
  document.addEventListener("click", (e) => {
    const el = e.target.closest("[data-track]");
    if (!el) return;
    const name = el.getAttribute("data-track");
    safeTrack(name, {
      tag: el.tagName.toLowerCase(),
      href: el.getAttribute("href") || undefined,
      text: (el.textContent || "").trim().slice(0, 60) || undefined,
    });
  });

  const form = document.getElementById("serviceForm");
  const statusOk = document.getElementById("statusOk");
  const serviceNeeded = document.getElementById("serviceNeeded");
  const serviceArea = document.getElementById("serviceArea");
  const areaWarn = document.getElementById("areaWarn");

  // Optional tracking: service selection
  if (serviceNeeded) {
    serviceNeeded.addEventListener("change", (e) => {
      safeTrack("service_needed_select", { value: e.target.value });
    });
  }

  // Capacity guardrail behavior
  if (serviceArea) {
    serviceArea.addEventListener("change", (e) => {
      const v = e.target.value;
      if (v === "no") areaWarn.hidden = false;
      else areaWarn.hidden = true;
    });
  }

  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const requiredIds = ["name", "phone", "city", "serviceNeeded", "timing", "serviceArea"];
    const missing = requiredIds.some((id) => {
      const el = document.getElementById(id);
      return !el || !String(el.value || "").trim();
    });

    if (missing) {
      safeTrack("form_submit", { status: "missing_fields" });
      alert("Please fill out the required fields.");
      return;
    }

    const payload = {
      name: document.getElementById("name").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      city: document.getElementById("city").value.trim(),
      serviceNeeded: document.getElementById("serviceNeeded").value,
      timing: document.getElementById("timing").value,
      serviceArea: document.getElementById("serviceArea").value,
    };

    safeTrack("form_submit", payload);

    // Demo behavior: show success message and reset
    statusOk.hidden = false;
    form.reset();
    areaWarn.hidden = true;

    setTimeout(() => {
      statusOk.hidden = true;
    }, 6500);
  });
})();
