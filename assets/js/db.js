/**
 * db.js (v2 — connected to a real database)
 * ----------------------------------------------------------------
 * Every page still calls DB.Profile / DB.Social / DB.Products / DB.Settings /
 * DB.Analytics / DB.Auth — same names as before. The difference is these are
 * now `async` functions that call your Vercel API routes (in /api), which
 * talk to your Neon Postgres database. That's what makes changes show up
 * for every visitor, from any device, instead of just your own browser.
 */
(function (window) {
  async function api(path, options = {}) {
    const res = await fetch(`/api/${path}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      ...options,
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
    if (!res.ok) {
      let msg = `Request failed (${res.status})`;
      try {
        const data = await res.json();
        if (data.error) msg = data.error;
      } catch (_) {}
      throw new Error(msg);
    }
    if (res.status === 204) return null;
    return res.json();
  }

  // ---------------- Profile ----------------
  const Profile = {
    get: () => api("profile"),
    update: (patch) => api("profile", { method: "PUT", body: patch }),
  };

  // ---------------- Social ----------------
  const Social = {
    getAll: () => api("social"),
    getEnabled: () => api("social?enabled=1"),
    add: (platform, url) => api("social", { method: "POST", body: { platform, url } }),
    update: (id, patch) => api(`social?id=${id}`, { method: "PATCH", body: patch }),
    remove: (id) => api(`social?id=${id}`, { method: "DELETE" }),
    toggle: async (id) => {
      const all = await Social.getAll();
      const current = all.find((s) => s.id === id);
      return Social.update(id, { enabled: !current.enabled });
    },
  };

  // ---------------- Products ----------------
  const Products = {
    getAll: () => api("products"),
    getPublic: () => api("products?active=1"),
    getById: async (id) => {
      const all = await Products.getAll();
      return all.find((p) => p.id === id) || null;
    },
    add: (product) => api("products", { method: "POST", body: product }),
    update: (id, patch) => api(`products?id=${id}`, { method: "PATCH", body: patch }),
    remove: (id) => api(`products?id=${id}`, { method: "DELETE" }),
    toggleActive: async (id) => {
      const p = await Products.getById(id);
      if (p) await Products.update(id, { active: !p.active });
    },
    reorder: (orderedIds) => api("products?action=reorder", { method: "POST", body: { ids: orderedIds } }),
    move: async (id, direction) => {
      const list = await Products.getAll(); // already sorted by sort_order
      const idx = list.findIndex((p) => p.id === id);
      const swapIdx = idx + direction;
      if (idx === -1 || swapIdx < 0 || swapIdx >= list.length) return;
      const ids = list.map((p) => p.id);
      [ids[idx], ids[swapIdx]] = [ids[swapIdx], ids[idx]];
      await Products.reorder(ids);
    },
    recordClick: (id) => api("products?action=click", { method: "POST", body: { id } }),
  };

  // ---------------- Settings ----------------
  const Settings = {
    get: () => api("settings"),
    update: (patch) => api("settings", { method: "PUT", body: patch }),
  };

  // ---------------- Analytics ----------------
  const Analytics = {
    logVisit: () => api("analytics", { method: "POST" }).catch(() => {}),
    logClick: () => {}, // recorded server-side inside Products.recordClick
    summary: () => api("analytics"),
  };

  // ---------------- Auth ----------------
  const Auth = {
    login: async (username, password) => {
      try {
        await api("auth?action=login", { method: "POST", body: { username, password } });
        return true;
      } catch (e) {
        return false;
      }
    },
    logout: () => api("auth?action=logout", { method: "POST" }).catch(() => {}),
    isLoggedIn: async () => {
      const { loggedIn } = await api("auth");
      return loggedIn;
    },
    requireLogin: async () => {
      const ok = await Auth.isLoggedIn();
      if (!ok) window.location.href = "login.html";
      return ok;
    },
  };

  window.DB = { Profile, Social, Products, Settings, Analytics, Auth };
})(window);
