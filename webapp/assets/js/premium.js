/* ==========================================================================
   CAROUBOT — Interactions premium
   Palette de commandes ⌘K, panneau de notifications, halo d'ambiance,
   surlignage glissant de la sidebar, mascotte qui parle, grain.
   ========================================================================== */
(function () {
  const I = window.ICON;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const norm = s => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

  /* ---------- Grain filmique ---------- */
  const grain = document.createElement("div");
  grain.className = "grain";
  document.body.appendChild(grain);

  /* ---------- Palette de commandes (⌘K / Ctrl+K / clic sur la recherche) ---------- */
  const COMMANDS = [
    { g: "Pages", t: "Accueil", d: "Tableau de bord", i: I.home, go: "index.html", k: "dashboard tableau" },
    { g: "Pages", t: "CarouSlide", d: "Générer un carrousel", i: I.slide, go: "carouslide.html", k: "generer creer studio slides" },
    { g: "Pages", t: "CarouRadar", d: "Tendances TikTok", i: I.radar, go: "carouradar.html", k: "tendances top classement" },
    { g: "Pages", t: "Mes albums", d: "Albums & téléchargements", i: I.folder, go: "albums.html", k: "zip galerie images" },
    { g: "Pages", t: "Mes créations", d: "Générations", i: I.layers, go: "creations.html", k: "historique en cours terminees" },
    { g: "Pages", t: "Abonnements", d: "Compte & crédits", i: I.crown, go: "compte.html", k: "compte credits packs profil" },
    { g: "Pages", t: "Aide / Support", d: "FAQ & contact", i: I.headset, go: "aide.html", k: "faq support contact" },
    { g: "Actions", t: "Nouvelle génération", d: "Importer des slides", i: I.upload, go: "carouslide.html", k: "importer upload nouveau" },
    { g: "Actions", t: "Créer un album", d: "Depuis tes images", i: I.plus, go: "albums.html", k: "album nouveau" },
    { g: "Actions", t: "Lancer une collecte Radar", d: "France", i: I.trending, go: "carouradar.html", k: "collecte radar" },
    { g: "Actions", t: "Recharger des crédits", d: "Packs", i: I.coins, go: "compte.html#packs", k: "acheter payer stripe" },
    { g: "Actions", t: "Ouvrir le panneau Mes créations", d: "Panneau latéral", i: I.layers, run: () => window.CAROUBOT_SHELL.openDrawer(), k: "drawer panneau" },
  ];
  const scrim = document.createElement("div");
  scrim.className = "cmdk-scrim";
  const box = document.createElement("div");
  box.className = "cmdk";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Recherche rapide");
  box.innerHTML = `
    <div class="cmdk-input">${I.search}<input type="text" placeholder="Rechercher une page ou une action…" aria-label="Rechercher"/><span class="kbd">Échap</span></div>
    <div class="cmdk-list" role="listbox"></div>
    <div class="cmdk-foot"><span><b>↑</b><b>↓</b> naviguer</span><span><b>↵</b> ouvrir</span><span><b>⌘</b><b>K</b> ouvrir / fermer</span></div>`;
  document.body.append(scrim, box);
  const input = box.querySelector("input"), list = box.querySelector(".cmdk-list");
  let results = [], sel = 0;

  function draw() {
    const q = norm(input.value.trim());
    results = COMMANDS.filter(c => !q || norm(c.t + " " + c.d + " " + c.k).includes(q));
    sel = Math.min(sel, Math.max(0, results.length - 1));
    if (!results.length) { list.innerHTML = `<div class="cmdk-empty">Aucun résultat pour « ${input.value.replace(/[<>&]/g, "")} »</div>`; return; }
    let html = "", group = "";
    results.forEach((c, n) => {
      if (c.g !== group) { group = c.g; html += `<div class="cmdk-group">${group}</div>`; }
      html += `<div class="cmdk-item ${n === sel ? "sel" : ""}" data-n="${n}" role="option"><span class="ci">${c.i}</span>${c.t}<small>${c.d}</small></div>`;
    });
    list.innerHTML = html;
    list.querySelector(".sel")?.scrollIntoView({ block: "nearest" });
  }
  function run(c) {
    if (!c) return;
    close();
    if (c.run) return c.run();
    if (c.go.split("#")[0] === location.pathname.split("/").pop()) { if (c.go.includes("#")) document.getElementById(c.go.split("#")[1])?.scrollIntoView({ behavior: "smooth" }); return; }
    location.href = c.go;
  }
  function open() {
    scrim.classList.add("open"); box.classList.add("open"); input.value = ""; sel = 0; draw();
    const focus = (n) => { input.focus({ preventScroll: true }); if (document.activeElement !== input && n > 0) requestAnimationFrame(() => focus(n - 1)); };
    requestAnimationFrame(() => focus(10));
  }
  function close() { scrim.classList.remove("open"); box.classList.remove("open"); }
  input.addEventListener("input", () => { sel = 0; draw(); });
  input.addEventListener("keydown", e => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = (sel + 1) % Math.max(1, results.length); draw(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = (sel - 1 + results.length) % Math.max(1, results.length); draw(); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[sel]); }
    else if (e.key === "Escape") close();
  });
  list.addEventListener("click", e => { const it = e.target.closest(".cmdk-item"); if (it) run(results[+it.dataset.n]); });
  list.addEventListener("pointermove", e => { const it = e.target.closest(".cmdk-item"); if (it && +it.dataset.n !== sel) { sel = +it.dataset.n; list.querySelectorAll(".cmdk-item").forEach(x => x.classList.toggle("sel", +x.dataset.n === sel)); } });
  scrim.addEventListener("click", close);
  document.addEventListener("keydown", e => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); box.classList.contains("open") ? close() : open(); }
    else if (e.key === "Escape" && box.classList.contains("open")) close();
  });
  const search = document.querySelector(".topbar-search");
  if (search) {
    const si = search.querySelector("input");
    si.readOnly = true;
    search.addEventListener("click", e => { e.preventDefault(); open(); });
    si.addEventListener("focus", () => { si.blur(); open(); });
  }
  window.CAROUBOT_CMDK = { open, close };

  /* ---------- Panneau de notifications (vide tant que rien n'est relié) ---------- */
  const bell = document.querySelector(".bell-btn");
  if (bell) {
    bell.querySelector(".ping")?.remove();          // pas de pastille : aucune notification réelle
    const pop = document.createElement("div");
    pop.className = "notif-pop";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Notifications");
    pop.innerHTML = `
      <h4>Notifications <span class="badge">0</span></h4>
      <div class="notif-empty">
        <div class="ne-ico">${I.bell}</div>
        <strong>Tout est calme pour l'instant</strong>
        Tes alertes (générations terminées, crédits, nouveautés Radar) apparaîtront ici une fois ton compte relié au bot.
      </div>`;
    document.body.appendChild(pop);
    const place = () => {
      const r = bell.getBoundingClientRect();
      pop.style.top = (r.bottom + 10) + "px";
      pop.style.right = Math.max(12, window.innerWidth - r.right - 60) + "px";
    };
    bell.addEventListener("click", e => { e.stopPropagation(); place(); pop.classList.toggle("open"); });
    document.addEventListener("click", e => { if (!pop.contains(e.target)) pop.classList.remove("open"); });
    window.addEventListener("resize", () => pop.classList.contains("open") && place());
    document.addEventListener("keydown", e => { if (e.key === "Escape") pop.classList.remove("open"); });
  }

  if (reduce) return;

  /* ---------- Halo d'ambiance qui suit la souris (avec inertie) ---------- */
  if (finePointer) {
    const au = document.createElement("div");
    au.className = "aurora";
    document.body.appendChild(au);
    let tx = innerWidth / 2, ty = innerHeight / 2, x = tx, y = ty, raf = 0;
    const loop = () => {
      x += (tx - x) * .08; y += (ty - y) * .08;
      au.style.transform = `translate(${x}px, ${y}px)`;
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > .5) ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", e => { tx = e.clientX; ty = e.clientY; au.classList.add("on"); if (!raf) raf = requestAnimationFrame(loop); });
    document.addEventListener("pointerleave", () => au.classList.remove("on"));
  }

  /* ---------- Surlignage qui glisse entre les onglets de la sidebar ---------- */
  const nav = document.querySelector(".sidebar-nav");
  if (nav && finePointer) {
    const ind = document.createElement("span");
    ind.className = "nav-ind";
    nav.prepend(ind);
    nav.classList.add("has-ind");
    nav.addEventListener("pointerover", e => {
      const it = e.target.closest(".nav-item");
      if (!it) return;
      ind.style.transform = `translateY(${it.offsetTop}px)`;
      ind.style.height = it.offsetHeight + "px";
      ind.style.opacity = it.classList.contains("active") ? "0" : "1";
    });
    nav.addEventListener("pointerleave", () => { ind.style.opacity = "0"; });
  }

  /* ---------- La mascotte parle (accueil) ---------- */
  const robot = document.querySelector(".wh-robot");
  const stage = document.querySelector(".wh-stage");
  if (robot && stage) {
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    stage.appendChild(bubble);
    const tips = [
      "Salut ! 👋 Prêt à créer ton prochain carrousel ?",
      "Astuce : une image générée coûte 7 crédits.",
      "Glisse tes slides pour changer leur ordre, il sera conservé.",
      "CarouRadar collecte les tendances à la demande, jamais en automatique.",
      "Jusqu'à 4 variantes par slide, dans 5 langues.",
      "Tes albums se téléchargent en ZIP, même hors connexion.",
    ];
    let k = 0, hideT = 0;
    const say = txt => {
      bubble.textContent = txt;
      bubble.classList.add("show");
      clearTimeout(hideT);
      hideT = setTimeout(() => bubble.classList.remove("show"), 4800);
    };
    setTimeout(() => say(tips[0]), 1500);
    robot.addEventListener("click", () => {
      robot.classList.remove("jump"); void robot.offsetWidth; robot.classList.add("jump");
      k = (k + 1) % tips.length;
      say(tips[k]);
    });
    robot.addEventListener("animationend", e => { if (e.animationName === "robotJump") robot.classList.remove("jump"); });
  }
})();
