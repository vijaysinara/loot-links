(function () {
  const { Profile, Social, Products, Settings, Analytics } = window.DB;

  function renderSEO(profile, settings) {
    document.title = settings.seoTitle || profile.name;
    document.getElementById("seo-desc").setAttribute("content", settings.seoDescription || profile.bio);
    document.getElementById("og-title").setAttribute("content", profile.name);
    document.getElementById("og-desc").setAttribute("content", settings.seoDescription || profile.bio);
    if (settings.ogImage) document.getElementById("og-image").setAttribute("content", settings.ogImage);
  }

  function renderProfile(p) {
    document.getElementById("brand-name").textContent = p.name;
    document.getElementById("brand-bio").textContent = p.bio;
    const photoEl = document.getElementById("profile-photo");
    photoEl.innerHTML = p.logo
      ? `<img src="${p.logo}" alt="${escapeHtml(p.name)} logo" loading="eager" />`
      : `<span class="placeholder">${(p.name || "?").trim().charAt(0).toUpperCase()}</span>`;
  }

  function renderSocial(list) {
    const row = document.getElementById("social-row");
    row.innerHTML = list
      .map(
        (s) => `
      <a class="social-btn" href="${s.url}" target="_blank" rel="noopener noreferrer" aria-label="${
          PLATFORM_LABEL[s.platform] || s.platform
        }">
        ${getIcon(s.platform)}
      </a>`
      )
      .join("");
  }

  function renderProducts(products) {
    const grid = document.getElementById("product-grid");

    if (!products.length) {
      grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">No products yet — check back soon ✨</div>`;
      return;
    }

    grid.innerHTML = products
      .map(
        (p, i) => `
      <article class="product-card" data-id="${p.id}" style="animation-delay:${Math.min(i * 0.05, 0.4)}s">
        <a class="product-media" href="${p.url}" target="_blank" rel="noopener noreferrer sponsored">
          ${p.store ? `<span class="badge">${escapeHtml(p.store)}</span>` : ""}
          ${p.featured ? `<span class="badge-featured">FEATURED</span>` : ""}
          <img src="${p.image}" alt="${escapeHtml(p.title)}" loading="lazy" />
        </a>
        <div class="product-body">
          <a class="product-title" href="${p.url}" target="_blank" rel="noopener noreferrer sponsored">
            ${escapeHtml(p.title)}
          </a>
          ${p.description ? `<p class="product-desc">${escapeHtml(p.description)}</p>` : ""}
          <span class="product-cta">
            View deal
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M7 7h10v10"/></svg>
          </span>
        </div>
      </article>`
      )
      .join("");

    // click tracking — image, title, or anywhere on the card all count once
    grid.querySelectorAll(".product-card").forEach((card) => {
      const id = card.dataset.id;
      card.addEventListener("click", () => Products.recordClick(id));
    });
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str || "";
    return div.innerHTML;
  }

  async function init() {
    try {
      const [profile, settings, social, products] = await Promise.all([
        Profile.get(),
        Settings.get(),
        Social.getEnabled(),
        Products.getPublic(),
      ]);
      renderSEO(profile, settings);
      renderProfile(profile);
      renderSocial(social);
      renderProducts(products);
      Analytics.logVisit();
    } catch (e) {
      console.error("Failed to load site data:", e);
      document.getElementById("product-grid").innerHTML =
        `<div class="empty-state" style="grid-column:1/-1">Couldn't load products right now. Please refresh.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();
