# CAROUBOT — WebApp (frontend)

WebApp SaaS premium pour créer (CarouSlide) et analyser (CarouRadar) des
carrousels TikTok. Interface futuriste responsive (ordinateur + téléphone),
construite en HTML/CSS/JS **sans dépendance de build** — elle s'ouvre
directement dans un navigateur ou se sert derrière n'importe quel serveur
statique.

> ⚠️ **Statut actuel : frontend uniquement.** Aucun backend n'est connecté.
> L'application **ne simule jamais** une génération réelle ni un débit de
> crédits : tout ce qui dépend du serveur affiche clairement « Non connecté /
> en attente backend ». Aucune clé API ni donnée sensible n'est présente dans
> le frontend.

## Lancer en local

```bash
cd webapp
python3 -m http.server 9877
# puis ouvrir http://localhost:9877/index.html
```

(Le port 9877 correspond au port de prévisualisation mentionné dans
l'infrastructure. N'importe quel serveur statique convient : nginx, Caddy,
`npx serve`, etc.)

## Pages

| Fichier            | Rôle                                                        |
|--------------------|-------------------------------------------------------------|
| `index.html`       | Accueil / tableau de bord (mascotte, cartes, stats réelles) |
| `carouslide.html`  | Studio de génération (import, réorg, variations, crédits)   |
| `carouradar.html`  | Veille des tendances (collecte à la demande, transfert)     |
| `albums.html`      | Mes albums (dossiers, sélection, téléchargement)            |
| `creations.html`   | Mes créations (en cours / terminées / erreurs)              |
| `compte.html`      | Compte, crédits, packs & abonnements, support               |

## Architecture

```
webapp/
├── index.html, carouslide.html, …        # pages
└── assets/
    ├── css/
    │   ├── design-system.css   # tokens : couleurs, boutons, cartes, champs…
    │   ├── app.css             # shell (sidebar/topbar/bottom-nav) + composants
    │   └── mascot.css          # animations de la mascotte
    └── js/
        ├── config.js           # endpoints relatifs + paramètres métier
        ├── icons.js            # icônes SVG inline (aucune image externe)
        ├── mascot.js           # mascotte CAROUBOT (SVG original)
        ├── store.js            # état client (créations locales, transferts)
        └── shell.js            # assemble le chrome partagé sur chaque page
```

Le **système de design** est centralisé dans `design-system.css`
(variables CSS réutilisables : couleurs cyan/violet néon, rayons, lueurs,
boutons, cartes, champs, stepper, badges…). Le **shell** (`shell.js` + `app.css`)
est partagé par toutes les pages : sidebar rétractable, topbar
(recherche/crédits/notifications/profil), barre inférieure mobile
(CarouRadar · CarouSlide · Accueil · Albums · Compte) et bouton flottant
permanent « Mes créations ».

## Connecter le backend (plus tard)

Tout passe par des **endpoints relatifs** définis dans
`assets/js/config.js`. Le frontend ne connaît aucune clé : le VPS doit exposer
ces routes (proxy vers les services internes) et gérer l'authentification.

1. Implémenter côté serveur les routes de `CAROUBOT_CONFIG.api` :
   `/api/me`, `/api/credits`, `/api/creations`, `/api/carouslide/jobs`,
   `/api/radar/search`, `/api/albums`, `/api/import/tiktok`, `/api/billing`.
2. Passer `backendConnected: true` dans `config.js`.
3. Renseigner `window.CAROUBOT_CREDITS` depuis `/api/me` (actuellement `null`).

Points d'intégration prévus : comptes utilisateurs, crédits partagés avec le
bot Telegram, générations OpenArt, résultats CarouRadar (collecte à la demande,
cache partagé), paiements Stripe, albums et historique.

### Règles respectées
- **Aucune** modification du bot Telegram ni de l'Admin Panel.
- Travail **isolé** dans `webapp/` uniquement.
- **Aucune** collecte automatique Radar (collecte à la demande uniquement).
- **Aucune** fausse statistique, aucun faux album, aucune génération simulée.
- 7 crédits CAROUBOT par image générée (`pricing.creditsPerImage`).

## Sauvegarde / retour arrière

Le frontend est versionné dans Git sur la branche
`claude/caroubot-webapp-redesign-nfzf3k`. Pour revenir à un état antérieur :

```bash
git log --oneline            # repérer le commit souhaité
git checkout <commit> -- webapp   # restaurer uniquement la webapp
```

## Tests effectués

Testé réellement dans Chromium (Playwright), résolutions ordinateur
(1440×900) et téléphone (390×844) :
- 0 erreur console / page sur les 6 pages ;
- barre de navigation inférieure visible et ordonnée sur mobile ;
- aucun débordement horizontal ;
- flux CarouSlide de bout en bout : import de slides → stepper variations →
  calcul images/crédits (ex. 6 images = 42 crédits) → suppression → confirmation
  → enregistrement dans « Mes créations » avec statut « en attente backend »
  (aucun crédit débité).

## Alignement sur la V9 existante

Après analyse du code de la WebApp V9 (fourni via le script de déploiement),
cette refonte a été alignée sur les comportements réels du produit :
- **Variations par slide : 1 à 4** (−/+), 7 crédits par image.
- **Langue** sélectionnée par pastilles à drapeaux (fr/en/es/de/it).
- **Mascotte** : réutilisation de l'asset SVG réel du projet
  (`assets/img/caroubot-mascot.svg`).
- **Mes albums** : gestionnaire **local fonctionnel** (import d'images →
  sélection multiple → téléchargement en lot via partage natif, sinon **ZIP
  généré côté client** sans dépendance ni serveur), repris de la V9. Les
  carrousels générés par le bot seront synchronisés une fois le backend relié.

La V9, comme cette refonte, est explicitement une démonstration : solde de
crédits fictif, aucune génération réelle, aucun débit, aucune statistique
inventée tant que le backend n'est pas connecté.

> ⚠️ Le script `MAJ_CAROUBOT_WEBAPP_V9_REDESIGN.command` déploie en SSH sur le
> VPS de production (`/home/ubuntu/caroubot_webapp_preview`). Il **n'a pas été
> exécuté** depuis cette session : le déploiement reste une action manuelle et
> volontaire de ta part. Le bot Telegram et l'Admin Panel ne sont pas touchés.
