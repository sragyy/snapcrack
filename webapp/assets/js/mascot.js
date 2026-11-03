/* ==========================================================================
   CAROUBOT — Mascotte (SVG original, reconstruite, aucune image copiée)
   Robot chromé souriant à visière cyan, inspiré de la direction artistique
   de la maquette (sans copier l'illustration).
   ========================================================================== */
window.CAROUBOT_MASCOT = (function () {
  function defs(id) {
    return `
      <defs>
        <linearGradient id="${id}-chrome" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f4f8ff"/>
          <stop offset="0.55" stop-color="#cdd8ee"/>
          <stop offset="1" stop-color="#9fb0d4"/>
        </linearGradient>
        <linearGradient id="${id}-visor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#0a1230"/>
          <stop offset="1" stop-color="#101a44"/>
        </linearGradient>
        <radialGradient id="${id}-glow" cx="50%" cy="42%" r="60%">
          <stop offset="0" stop-color="rgba(69,229,255,.55)"/>
          <stop offset="1" stop-color="rgba(69,229,255,0)"/>
        </radialGradient>
        <linearGradient id="${id}-ear" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="#45e5ff"/>
          <stop offset="1" stop-color="#a855f7"/>
        </linearGradient>
      </defs>`;
  }

  // Tête de robot seule — pour le logo / la pastille
  function head(id) {
    return `
      ${defs(id)}
      <circle cx="60" cy="54" r="46" fill="url(#${id}-glow)"/>
      <line x1="60" y1="16" x2="60" y2="28" stroke="#45e5ff" stroke-width="3.5" stroke-linecap="round"/>
      <circle cx="60" cy="13" r="5.5" fill="#c084fc" class="mascot-antenna"/>
      <rect x="23" y="47" width="9" height="20" rx="4.5" fill="url(#${id}-ear)"/>
      <rect x="88" y="47" width="9" height="20" rx="4.5" fill="url(#${id}-ear)"/>
      <rect x="28" y="28" width="64" height="58" rx="22" fill="url(#${id}-chrome)"/>
      <rect x="33" y="33" width="54" height="48" rx="18" fill="url(#${id}-visor)" stroke="#45e5ff" stroke-width="1.5" stroke-opacity=".5"/>
      <g class="mascot-eye">
        <circle cx="49" cy="55" r="6.5" fill="#45e5ff"/>
        <circle cx="71" cy="55" r="6.5" fill="#45e5ff"/>
      </g>
      <path d="M50 67 q10 7 20 0" stroke="#45e5ff" stroke-width="3" fill="none" stroke-linecap="round"/>`;
  }

  return {
    // Grande mascotte (dashboard)
    inline(size = 100) {
      return `<div class="mascot" style="width:${size}px;height:${size}px">
        <svg viewBox="0 0 120 120" width="100%" height="100%" aria-label="Mascotte CAROUBOT">
          ${head("m" + Math.random().toString(36).slice(2, 6))}
          <ellipse cx="60" cy="110" rx="30" ry="6" fill="rgba(0,0,0,.4)"/>
        </svg></div>`;
    },
    // Petit logo-mark (sidebar / topbar)
    mark(size = 34) {
      const id = "k" + Math.random().toString(36).slice(2, 6);
      return `<svg viewBox="20 8 80 86" width="${size}" height="${size}" aria-hidden="true" style="display:block">${head(id)}</svg>`;
    },
  };
})();
