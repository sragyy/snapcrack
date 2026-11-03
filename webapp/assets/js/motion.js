/* ==========================================================================
   CAROUBOT — Effets interactifs (cascade, halo souris, inclinaison 3D,
   particules, transitions de page, onde au clic, compteurs).
   Chargé en fin de page, après le rendu du contenu.
   Rien ne s'active si l'utilisateur préfère réduire les animations.
   ========================================================================== */
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const page = document.getElementById("pageContent");
  if (!page) return;

  /* ---------- Apparition en cascade des blocs présents au chargement ---------- */
  const blocks = page.querySelectorAll(
    ".page-head, .steps, .toolbar, .hero-row > .card, .stat-row > .card, .grid > .card, .recent-panel, " +
    ".section-head, #csLayout > div > .card, .notice, .radar-skel-head, .empty, .folder-hint"
  );
  let i = 0;
  blocks.forEach(el => {
    if (el.closest(".rv")) return;               // pas d'animation imbriquée
    el.classList.add("rv");
    el.style.setProperty("--d", Math.min(i++ * 70, 840) + "ms");
    const done = e => { if (e.target === el) { el.classList.remove("rv"); el.removeEventListener("animationend", done); } };
    el.addEventListener("animationend", done);
  });

  /* ---------- Halo qui suit la souris + inclinaison 3D ---------- */
  function enhanceCard(card) {
    if (card.dataset.fx) return;
    card.dataset.fx = "1";
    card.classList.add("spot");
    const light = document.createElement("span");
    light.className = "spot-light";
    card.prepend(light);
    const tilt = card.matches(".hero-card, .stat-card, .rc-card, .rk-card, .plan-card, .folder-new");
    if (tilt) card.classList.add("tilt");
    card.addEventListener("pointermove", e => {
      const r = card.getBoundingClientRect();
      const x = e.clientX - r.left, y = e.clientY - r.top;
      card.style.setProperty("--mx", x + "px");
      card.style.setProperty("--my", y + "px");
      if (tilt) {
        const rx = ((y / r.height) - .5) * -7, ry = ((x / r.width) - .5) * 9;
        card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-3px)`;
      }
    });
    card.addEventListener("pointerleave", () => { if (tilt) card.style.transform = ""; });
  }
  if (finePointer) {
    page.querySelectorAll(".card").forEach(enhanceCard);
    // Cartes ajoutées plus tard (slides importées, albums, résultats…)
    new MutationObserver(() => page.querySelectorAll(".card:not([data-fx])").forEach(enhanceCard))
      .observe(page, { childList: true, subtree: true });
  }

  /* ---------- Particules sous la mascotte ---------- */
  const stage = page.querySelector(".wh-stage");
  if (stage) {
    for (let n = 0; n < 18; n++) {
      const p = document.createElement("span");
      p.className = "wh-particle" + (n % 3 === 0 ? " v" : "");
      p.style.left = (30 + Math.random() * 40) + "%";
      p.style.setProperty("--t", (3 + Math.random() * 3).toFixed(2) + "s");
      p.style.setProperty("--dl", (-Math.random() * 6).toFixed(2) + "s");
      p.style.setProperty("--dx", ((Math.random() - .5) * 90).toFixed(0) + "px");
      const s = (2 + Math.random() * 4).toFixed(1) + "px";
      p.style.width = p.style.height = s;
      stage.appendChild(p);
    }
    // La mascotte suit légèrement la souris
    if (finePointer) {
      const robot = stage.querySelector(".wh-robot");
      const hero = page.querySelector(".welcome-hero");
      hero && hero.addEventListener("pointermove", e => {
        const r = hero.getBoundingClientRect();
        const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5;
        stage.style.transform = `translate(${dx * 14}px, ${dy * 10}px)`;
        if (robot) robot.style.translate = `${dx * 10}px ${dy * 6}px`;
      });
      hero && hero.addEventListener("pointerleave", () => { stage.style.transform = ""; if (robot) robot.style.translate = ""; });
      stage.style.transition = "transform .4s cubic-bezier(.2,.8,.2,1)";
    }
  }

  /* ---------- Compteurs animés (valeurs numériques réelles uniquement) ---------- */
  page.querySelectorAll(".stat-val").forEach(el => {
    const target = parseInt(el.textContent.replace(/\s/g, ""), 10);
    if (!Number.isFinite(target) || target <= 0 || String(target) !== el.textContent.replace(/\s/g, "")) return;
    const t0 = performance.now(), dur = 900;
    const step = now => {
      const k = Math.min(1, (now - t0) / dur), v = Math.round(target * (1 - Math.pow(1 - k, 3)));
      el.textContent = v.toLocaleString("fr-FR");
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  /* ---------- Onde au clic sur les boutons ---------- */
  document.addEventListener("pointerdown", e => {
    const b = e.target.closest(".btn, .hero-go, .credits-add, .seg button, .lang-pill");
    if (!b || b.disabled) return;
    const r = b.getBoundingClientRect(), size = Math.max(r.width, r.height);
    const w = document.createElement("span");
    w.className = "ripple";
    w.style.width = w.style.height = size + "px";
    w.style.left = (e.clientX - r.left - size / 2) + "px";
    w.style.top = (e.clientY - r.top - size / 2) + "px";
    if (getComputedStyle(b).position === "static") b.style.position = "relative";
    b.style.overflow = "hidden";
    b.appendChild(w);
    setTimeout(() => w.remove(), 650);
  });

  /* ---------- Transition douce entre les pages ---------- */
  const app = document.getElementById("app");
  document.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || a.target) return;
    const href = a.getAttribute("href");
    if (!/^[\w-]+\.html(#.*)?$/.test(href)) return;        // liens internes uniquement
    if (href.split("#")[0] === location.pathname.split("/").pop()) return;
    e.preventDefault();
    app.classList.add("leaving");
    setTimeout(() => { location.href = href; }, 200);
  });
  window.addEventListener("pageshow", ev => { if (ev.persisted) app.classList.remove("leaving"); });
})();
