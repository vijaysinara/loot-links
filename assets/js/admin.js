// Shared chrome + helpers for every admin page (except login.html)
(function () {
  const NAV = [
    { href: "index.html", label: "Dashboard", icon: "grid" },
    { href: "profile.html", label: "Profile Settings", icon: "user" },
    { href: "social.html", label: "Social Links", icon: "link" },
    { href: "products.html", label: "Products", icon: "box" },
    { href: "add-product.html", label: "Add Product", icon: "plus" },
    { href: "analytics.html", label: "Analytics", icon: "chart" },
    { href: "settings.html", label: "Settings", icon: "gear" },
  ];
  const NAV_ICONS = {
    grid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="8" height="8" rx="2"/><rect x="13" y="3" width="8" height="8" rx="2"/><rect x="3" y="13" width="8" height="8" rx="2"/><rect x="13" y="13" width="8" height="8" rx="2"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 15l6-6M8 13l-2 2a4 4 0 105.5 5.5l2-2M16 11l2-2a4 4 0 10-5.5-5.5l-2 2"/></svg>',
    box: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8M12 13v8"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 5v14M5 12h14"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
    gear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.55V21a2 2 0 11-4 0v-.09A1.7 1.7 0 008.5 19.6a1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06A1.7 1.7 0 004.15 15a1.7 1.7 0 00-1.55-1H2.5a2 2 0 110-4h.09A1.7 1.7 0 004.15 9a1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06A1.7 1.7 0 008.5 4.4a1.7 1.7 0 001-1.55V2.5a2 2 0 114 0v.09a1.7 1.7 0 001 1.55 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06A1.7 1.7 0 0019.6 8.5a1.7 1.7 0 001.55 1H21.5a2 2 0 110 4h-.09a1.7 1.7 0 00-1.55 1z"/></svg>',
    logout: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/></svg>',
    menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  };

  function currentPage() {
    return location.pathname.split("/").pop() || "index.html";
  }

  function buildSidebar() {
    const active = currentPage();
    const links = NAV.map(
      (n) => `<a href="${n.href}" class="${n.href === active ? "active" : ""}">${NAV_ICONS[n.icon]}${n.label}</a>`
    ).join("");
    return `
    <div class="admin-brand"><span class="dot"></span><span>LootLinks Admin</span></div>
    <nav class="admin-nav">
      ${links}
      <div class="nav-divider"></div>
      <a href="#" class="logout" id="logout-link">${NAV_ICONS.logout}Logout</a>
    </nav>`;
  }

  function injectChrome() {
    const shell = document.querySelector(".admin-shell");
    if (!shell) return;
    const sidebar = document.createElement("aside");
    sidebar.className = "admin-sidebar";
    sidebar.id = "admin-sidebar";
    sidebar.innerHTML = buildSidebar();
    shell.prepend(sidebar);

    const topbar = document.createElement("div");
    topbar.className = "admin-topbar";
    topbar.innerHTML = `<span style="font-family:var(--font-display);font-weight:600">LootLinks Admin</span>
      <button id="menu-toggle" aria-label="Menu">${NAV_ICONS.menu}</button>`;
    shell.prepend(topbar);

    document.getElementById("menu-toggle").addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
    document.getElementById("logout-link").addEventListener("click", async (e) => {
      e.preventDefault();
      await DB.Auth.logout();
      window.location.href = "login.html";
    });
  }

  function toast(message, type = "success") {
    let el = document.getElementById("toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "toast";
      el.className = "toast";
      document.body.appendChild(el);
    }
    el.textContent = message;
    el.className = `toast show ${type}`;
    clearTimeout(el._t);
    el._t = setTimeout(() => el.classList.remove("show"), 2600);
  }

  // Turns a chosen file into a base64 data URL for instant preview + storage
  // (no server upload endpoint needed for this local/demo build — see README
  // for wiring up real object storage like S3/Cloudinary/Supabase Storage).
  function fileToDataUrl(file, cb) {
    if (!file) return;
    if (!/^image\/(jpeg|jpg|png|webp)$/.test(file.type)) {
      toast("Please upload a JPG, PNG, or WebP image", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => cb(reader.result);
    reader.readAsDataURL(file);
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const ok = await DB.Auth.requireLogin();
    if (ok) injectChrome();
  });

  window.Admin = { toast, fileToDataUrl };
})();
