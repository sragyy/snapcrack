/* ==========================================================================
   CAROUBOT — Shell applicatif partagé
   Injecte sidebar + topbar + bottom-nav + bouton flottant + drawer.
   Chaque page définit window.CAROUBOT_PAGE = 'home'|'carouslide'|'carouradar'
   |'albums'|'creations'|'account'.
   ========================================================================== */
(function () {
  const I = window.ICON;
  const page = window.CAROUBOT_PAGE || "home";

  const NAV = [
    { id: "home",       label: "Accueil",       icon: I.home,    href: "index.html" },
    { id: "carouslide", label: "CarouSlide",    icon: I.slide,   href: "carouslide.html" },
    { id: "carouradar", label: "CarouRadar",    icon: I.radar,   href: "carouradar.html" },
    { id: "albums",     label: "Mes albums",    icon: I.folder,  href: "albums.html" },
    { id: "creations",  label: "Mes créations", icon: I.layers,  href: "creations.html" },
    { id: "account",    label: "Abonnements",   icon: I.crown,   href: "compte.html" },
    { id: "aide",       label: "Aide / Support",icon: I.headset, href: "aide.html" },
  ];

  // Ordre bottom nav mobile : CarouRadar · CarouSlide · Accueil(centre) · Albums · Compte
  const BOTTOM = [
    { id: "carouradar", label: "Radar",   icon: I.radar,  href: "carouradar.html" },
    { id: "carouslide", label: "Slide",   icon: I.slide,  href: "carouslide.html" },
    { id: "home",       label: "Accueil", icon: I.home,   href: "index.html", center: true },
    { id: "albums",     label: "Albums",  icon: I.albums, href: "albums.html" },
    { id: "account",    label: "Compte",  icon: I.account,href: "compte.html" },
  ];

  const credits = window.CAROUBOT_CREDITS; // null = inconnu (non connecté)
  const creditsText = (credits == null) ? "—" : credits.toLocaleString("fr-FR");

  /* ---------- SIDEBAR ---------- */
  const sidebar = `
    <aside class="sidebar">
      <a class="sidebar-brand" href="index.html">
        <div class="brand-logo">${window.CAROUBOT_MASCOT ? window.CAROUBOT_MASCOT.mark(34) : "C"}</div>
        <div class="brand-name"><span class="bn-carou">CAROU</span><span class="bn-bot">BOT</span><small>STUDIO</small></div>
      </a>
      <nav class="sidebar-nav">
        <div class="nav-group-label">Navigation</div>
        ${NAV.map(n => `
          <a class="nav-item ${n.id===page?'active':''}" href="${n.href}">
            ${n.icon}<span>${n.label}</span>${n.badge||''}
          </a>`).join("")}
      </nav>
      <div class="sidebar-foot">
        <div class="credits-pill">
          <div class="ico">${I.coin}</div>
          <div class="credits-text">
            <div class="credits-amount mono">${creditsText}</div>
            <div class="credits-label">crédits CAROUBOT</div>
          </div>
        </div>
      </div>
    </aside>
    <div class="sidebar-scrim" data-close-sidebar></div>`;

  /* ---------- TOPBAR ---------- */
  const topbar = `
    <header class="topbar">
      <button class="icon-btn topbar-toggle" id="btnSidebarToggle" aria-label="Menu">${I.menu}</button>
      <label class="topbar-search">
        ${I.search}
        <input type="search" placeholder="Rechercher un projet, un album…" aria-label="Rechercher"/>
        <span class="kbd">⌘ K</span>
      </label>
      <div class="topbar-right">
        <div class="credits-chip" title="Solde de crédits">
          ${I.coin}<span class="mono">${creditsText}</span><span class="credits-chip-label">crédits</span>
          <a class="credits-add" href="compte.html" aria-label="Recharger des crédits">${I.plus}</a>
        </div>
        <button class="icon-btn" aria-label="Notifications">${I.bell}<span class="ping"></span></button>
        <button class="profile-btn" aria-label="Profil">
          <span class="avatar">U</span>
          <span>
            <span class="pname">Mon compte</span><br>
            <span class="pmail">Non connecté</span>
          </span>
        </button>
      </div>
    </header>`;

  /* ---------- BOTTOM NAV ---------- */
  const bottomNav = `
    <nav class="bottom-nav">
      ${BOTTOM.map(n => n.center ? `
        <a class="bn-item bn-center ${n.id===page?'active':''}" href="${n.href}">
          <span class="bn-fab">${n.icon}</span>
        </a>` : `
        <a class="bn-item ${n.id===page?'active':''}" href="${n.href}">
          ${n.icon}<span>${n.label}</span>
        </a>`).join("")}
    </nav>`;

  /* ---------- FAB + DRAWER « Mes créations » ---------- */
  const fab = `
    <button class="fab-creations" id="fabCreations" aria-label="Ouvrir mes créations">
      ${I.layers}<span class="fab-label">Mes créations</span><span class="fab-count" id="fabCount">0</span>
    </button>`;

  const drawer = `
    <div class="drawer-scrim" id="drawerScrim"></div>
    <aside class="drawer" id="creationsDrawer" aria-label="Mes créations">
      <div class="drawer-head">
        <div class="brand-logo" style="width:34px;height:34px;border-radius:10px;font-size:16px;">${I.layers}</div>
        <h3>Mes créations</h3>
        <button class="icon-btn" id="drawerClose" aria-label="Fermer">${I.close}</button>
      </div>
      <div class="drawer-body" id="drawerBody">
        <!-- rempli dynamiquement -->
      </div>
    </aside>`;

  /* ---------- Montage ---------- */
  const root = document.getElementById("app");
  root.classList.add("app");
  root.innerHTML = `
    ${sidebar}
    <div class="main">
      ${topbar}
      <main class="page" id="pageContent"></main>
    </div>
    ${bottomNav}
    ${fab}
    ${drawer}`;

  /* ---------- Comportements ---------- */
  const app = root;
  const toggleBtn = document.getElementById("btnSidebarToggle");
  const isMobile = () => window.matchMedia("(max-width: 960px)").matches;

  toggleBtn.addEventListener("click", () => {
    if (isMobile()) app.classList.toggle("drawer-open-sidebar");
    else app.classList.toggle("sidebar-collapsed");
  });
  app.querySelector("[data-close-sidebar]").addEventListener("click", () => app.classList.remove("drawer-open-sidebar"));
  app.querySelectorAll(".sidebar-nav .nav-item").forEach(a =>
    a.addEventListener("click", () => app.classList.remove("drawer-open-sidebar")));

  // Drawer "Mes créations"
  const scrim = document.getElementById("drawerScrim");
  const drawerEl = document.getElementById("creationsDrawer");
  const openDrawer = () => { scrim.classList.add("open"); drawerEl.classList.add("open"); renderDrawer(); };
  const closeDrawer = () => { scrim.classList.remove("open"); drawerEl.classList.remove("open"); };
  document.getElementById("fabCreations").addEventListener("click", openDrawer);
  document.getElementById("drawerClose").addEventListener("click", closeDrawer);
  scrim.addEventListener("click", closeDrawer);
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeDrawer(); });

  function renderDrawer() {
    const body = document.getElementById("drawerBody");
    const jobs = window.CAROUBOT_STORE.getCreations();
    if (!jobs.length) {
      body.innerHTML = `
        <div class="empty">
          ${I.layers}
          <h4>Aucune création pour le moment</h4>
          <p class="section-sub">Lancez une génération depuis CarouSlide pour la retrouver ici, quelle que soit la page.</p>
          <a class="btn btn-primary" href="carouslide.html" style="margin-top:14px">${I.slide} Ouvrir CarouSlide</a>
        </div>`;
      return;
    }
    body.innerHTML = jobs.map(j => {
      const statusBadge = j.status === "done"
        ? `<span class="badge badge-success"><span class="dot"></span>Terminé</span>`
        : j.status === "error"
        ? `<span class="badge badge-danger"><span class="dot"></span>Erreur</span>`
        : `<span class="badge badge-cyan"><span class="dot"></span>En cours ${j.progress}%</span>`;
      return `
        <div class="creation-row">
          <div class="creation-thumb">${I.slide}</div>
          <div class="creation-main">
            <div class="t">${j.title}</div>
            <div class="s">${j.images} images · ${j.lang.toUpperCase()} · ${j.credits} crédits</div>
            ${j.status==="running" ? `<div class="progress" style="margin-top:8px"><span style="width:${j.progress}%"></span></div>` : ""}
          </div>
          ${statusBadge}
        </div>`;
    }).join("");
  }

  // Compteur FAB
  function refreshFabCount() {
    const n = window.CAROUBOT_STORE.getCreations().length;
    document.getElementById("fabCount").textContent = n;
  }
  window.addEventListener("caroubot:creations-changed", () => { refreshFabCount(); if (drawerEl.classList.contains("open")) renderDrawer(); });
  refreshFabCount();

  // Expose un helper de rendu de page
  window.CAROUBOT_SHELL = { pageEl: document.getElementById("pageContent"), openDrawer, closeDrawer, isMobile };
})();
