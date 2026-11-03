/* ==========================================================================
   CAROUBOT — Mascotte (SVG original, reconstruite, aucune image copiée)
   Petit robot bleu/violet néon. Rendu vectoriel inline.
   ========================================================================== */
window.CAROUBOT_MASCOT = {
  inline(size = 100) {
    return `
    <div class="mascot" style="width:${size}px;height:${size}px">
      <svg viewBox="0 0 120 120" width="100%" height="100%" aria-label="Mascotte CAROUBOT">
        <defs>
          <linearGradient id="mBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stop-color="#22d3ee"/>
            <stop offset="1" stop-color="#a855f7"/>
          </linearGradient>
          <radialGradient id="mGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0" stop-color="rgba(56,224,255,.5)"/>
            <stop offset="1" stop-color="rgba(56,224,255,0)"/>
          </radialGradient>
        </defs>
        <ellipse cx="60" cy="108" rx="34" ry="7" fill="rgba(0,0,0,.35)"/>
        <circle cx="60" cy="52" r="46" fill="url(#mGlow)"/>
        <!-- antenne -->
        <line x1="60" y1="18" x2="60" y2="30" stroke="#38e0ff" stroke-width="3" stroke-linecap="round"/>
        <circle cx="60" cy="15" r="5" fill="#c084fc" class="mascot-antenna"/>
        <!-- tête -->
        <rect x="26" y="30" width="68" height="56" rx="20" fill="url(#mBody)"/>
        <rect x="30" y="34" width="60" height="48" rx="17" fill="#0b0e20"/>
        <!-- yeux -->
        <circle cx="48" cy="56" r="7" fill="#38e0ff" class="mascot-eye"/>
        <circle cx="72" cy="56" r="7" fill="#38e0ff" class="mascot-eye"/>
        <circle cx="48" cy="54" r="2.4" fill="#fff"/>
        <circle cx="72" cy="54" r="2.4" fill="#fff"/>
        <!-- sourire -->
        <path d="M50 70 q10 8 20 0" stroke="#a855f7" stroke-width="3" fill="none" stroke-linecap="round"/>
        <!-- oreilles -->
        <rect x="20" y="50" width="8" height="18" rx="4" fill="#a855f7"/>
        <rect x="92" y="50" width="8" height="18" rx="4" fill="#22d3ee"/>
      </svg>
    </div>`;
  },
};
