/* ==========================================================================
   CAROUBOT — Configuration frontend
   --------------------------------------------------------------------------
   AUCUNE clé API ni donnée sensible ici. Le frontend ne connaît que des
   endpoints RELATIFS. Le backend (à implémenter) doit exposer ces routes et
   gérer l'authentification, les crédits, OpenArt, le Radar, Stripe, etc.
   Tant qu'un endpoint renvoie 404 / n'existe pas, l'app affiche "Non connecté"
   et NE SIMULE JAMAIS une génération ou un débit réel.
   ========================================================================== */
window.CAROUBOT_CONFIG = {
  // Mettre à true seulement quand un vrai backend répond sur /api/*
  backendConnected: false,

  // Endpoints relatifs attendus côté serveur (proxy VPS -> services internes)
  api: {
    me:            "/api/me",              // profil + solde crédits
    credits:       "/api/credits",         // solde + historique
    creations:     "/api/creations",       // liste des générations
    createJob:     "/api/carouslide/jobs", // POST : lance une génération
    jobStatus:     "/api/carouslide/jobs/", // GET  /:id : progression
    radarSearch:   "/api/radar/search",    // POST : collecte à la demande (cache partagé)
    albums:        "/api/albums",          // galerie
    tiktokImport:  "/api/import/tiktok",   // POST : extrait les slides d'un lien
    billing:       "/api/billing",         // packs, abonnements, Stripe
  },

  // Paramètres métier
  pricing: {
    creditsPerImage: 7,         // 7 crédits CAROUBOT par image générée
    currencySymbol: "€",
  },

  languages: [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English",  flag: "🇬🇧" },
    { code: "es", label: "Español",  flag: "🇪🇸" },
    { code: "de", label: "Deutsch",  flag: "🇩🇪" },
    { code: "it", label: "Italiano", flag: "🇮🇹" },
  ],

  radar: {
    countries: [{ code: "FR", label: "France", flag: "🇫🇷" }],
    periods: [
      { code: "24h", label: "24 heures" },
      { code: "7d",  label: "7 jours" },
      { code: "30d", label: "30 jours" },
    ],
    sorts: [
      { code: "views", label: "Vues" },
      { code: "sales", label: "Ventes / CA" },
    ],
  },
};
