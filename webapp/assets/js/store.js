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
        slides: job.slides || 0,
        images: job.images || 0,
        lang: job.lang || "fr",
        credits: job.credits || 0,
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
