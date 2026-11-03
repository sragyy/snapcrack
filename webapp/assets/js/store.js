/* ==========================================================================
   CAROUBOT — Store client (état local uniquement)
   --------------------------------------------------------------------------
   IMPORTANT : tant que backendConnected === false, on NE SIMULE PAS de
   génération réelle ni de débit de crédits. Les "créations" créées en local
   sont marquées status:"pending_backend" (en attente de connexion backend) :
   elles n'ont rien exécuté, elles n'ont débité aucun crédit.
   ========================================================================== */
window.CAROUBOT_STORE = (function () {
  const KEY = "caroubot_creations_v1";
  const XFER = "caroubot_radar_transfer_v1";

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; }
  }
  function write(list) {
    try { localStorage.setItem(KEY, JSON.stringify(list)); } catch {}
    window.dispatchEvent(new CustomEvent("caroubot:creations-changed"));
  }

  return {
    getCreations() { return read(); },

    /* Enregistre une demande de génération.
       En mode non connecté -> status "pending_backend" (aucune exécution réelle). */
    addPendingJob(job) {
      const list = read();
      const entry = {
        id: "job_" + Date.now(),
        title: job.title || "Génération CarouSlide",
        slides: job.slides ?? null,     // null = connu après extraction (génération massive)
        images: job.images ?? null,
        links: job.links ?? null,       // nombre de liens TikTok (génération massive)
        lang: job.lang || "fr",
        credits: job.credits ?? null,   // null = calculé par le serveur avant débit
        status: window.CAROUBOT_CONFIG.backendConnected ? "running" : "pending_backend",
        progress: 0,
        createdAt: Date.now(),
        error: null,
      };
      list.unshift(entry);
      write(list);
      return entry;
    },

    updateJob(id, patch) {
      const list = read();
      const i = list.findIndex(j => j.id === id);
      if (i >= 0) { list[i] = { ...list[i], ...patch }; write(list); }
    },

    /* Résumé lisible d'une demande, y compris en génération massive */
    describe(j) {
      const parts = [];
      if (j.links) parts.push(`${j.links} lien${j.links > 1 ? "s" : ""} TikTok`);
      if (j.slides != null) parts.push(`${j.slides} slide${j.slides > 1 ? "s" : ""}`);
      if (j.images != null) parts.push(`${j.images} image${j.images > 1 ? "s" : ""}`);
      parts.push((j.lang || "fr").toUpperCase());
      parts.push(j.credits != null ? `${Number(j.credits).toLocaleString("fr-FR")} crédits` : "coût calculé avant débit");
      return parts.join(" · ");
    },

    removeJob(id) { write(read().filter(j => j.id !== id)); },
    clearAll() { write([]); },

    /* Transfert CarouRadar -> CarouSlide */
    setTransfer(items) { try { sessionStorage.setItem(XFER, JSON.stringify(items)); } catch {} },
    takeTransfer() {
      try {
        const v = JSON.parse(sessionStorage.getItem(XFER)) || [];
        sessionStorage.removeItem(XFER);
        return v;
      } catch { return []; }
    },
  };
})();

/* ---------- Toasts ---------- */
window.toast = function (msg, variant) {
  let wrap = document.querySelector(".toast-wrap");
  if (!wrap) { wrap = document.createElement("div"); wrap.className = "toast-wrap"; document.body.appendChild(wrap); }
  const t = document.createElement("div");
  t.className = "toast " + (variant || "");
  t.innerHTML = msg;
  wrap.appendChild(t);
  setTimeout(() => { t.style.transition = "opacity .3s, transform .3s"; t.style.opacity = "0"; t.style.transform = "translateY(10px)"; setTimeout(() => t.remove(), 320); }, 2800);
};

/* ---------- Fenêtre de confirmation (coût affiché avant toute action payante) ----------
   confirmCost({ title, lines: [..], cost, unit, confirmLabel, note }) -> Promise<boolean> */
window.confirmCost = function (opt) {
  return new Promise(resolve => {
    const I = window.ICON || {};
    const wrap = document.createElement("div");
    wrap.className = "cc-scrim";
    wrap.innerHTML = `
      <div class="cc-box" role="dialog" aria-modal="true" aria-label="${opt.title}">
        <div class="cc-ico">${I.coins || ""}</div>
        <h3>${opt.title}</h3>
        ${(opt.lines || []).map(l => `<p class="cc-line">${l}</p>`).join("")}
        ${opt.cost != null ? `<div class="cc-cost"><span>Coût</span><strong>${opt.cost} ${opt.unit || (opt.cost > 1 ? "crédits" : "crédit")}</strong></div>` : ""}
        ${opt.note ? `<p class="cc-note">${opt.note}</p>` : ""}
        <div class="cc-actions">
          <button class="btn btn-ghost" data-cc="0">Annuler</button>
          <button class="btn btn-primary" data-cc="1">${opt.confirmLabel || "Confirmer"}</button>
        </div>
      </div>`;
    document.body.appendChild(wrap);
    requestAnimationFrame(() => wrap.classList.add("open"));
    const done = v => { wrap.classList.remove("open"); setTimeout(() => wrap.remove(), 250); document.removeEventListener("keydown", onKey); resolve(v); };
    const onKey = e => { if (e.key === "Escape") done(false); if (e.key === "Enter") done(true); };
    document.addEventListener("keydown", onKey);
    wrap.addEventListener("click", e => {
      const b = e.target.closest("[data-cc]");
      if (b) done(b.dataset.cc === "1"); else if (e.target === wrap) done(false);
    });
    setTimeout(() => wrap.querySelector('[data-cc="1"]')?.focus(), 60);
  });
};
