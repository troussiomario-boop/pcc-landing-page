# Checklist de déploiement Netlify

## Avant de déployer (TODO)

- [ ] **Remplacer le logo SVG** : `assets/logo-pcc.svg` → `assets/logo-pcc.png` (si tu as le PNG)
  - Mets à jour dans `index.html` : `src="assets/logo-pcc.svg"` → `src="assets/logo-pcc.png"`
  - Mets à jour dans les pages légales (même chose)

- [ ] **Créer og-image.jpg** : exporte `assets/og-image.svg` en JPG (1200×630)
  - Déploie le JPG sur Netlify (ou un CDN)
  - Remplace l'URL dans `index.html` `<head>` (og:image meta)

- [ ] **Configurer l'endpoint formulaire** : `script.js` ligne ~11
  - Change `window.PCC_FORM_ENDPOINT = 'https://example.com/api/leads'`
  - Vers ton vrai webhook/CRM

- [ ] **Captures membres** : remplace les 4 placeholders `.proof__ph` par de vraies images (WebP + JPG fallback)
  - Section 4 (`#preuves`), les 4 divs `.proof`

- [ ] **Lien MyFxBook** : remplace `#` par l'URL publique du compte
  - Section 4, ligne "Voir le track record complet"

- [ ] **Lien Telegram** : dans success screen + page contact
  - `#successTelegram` dans `index.html`
  - `contact.html` — lien de la communauté

- [ ] **Email de contact** : `contact.html`
  - Remplace `contact@paycomedyclub.com` par ton email réel

- [ ] **Pages légales** : remplis les `<!-- TODO -->` dans :
  - `mentions-legales.html` : SIREN, raison sociale, adresse, hébergeur
  - `politique-confidentialite.html` : responsable traitement, durées de conservation
  - `contact.html` : téléphone, adresses (si applicable)

## Déployer sur Netlify

1. Va sur [app.netlify.com](https://app.netlify.com)
2. **Add new site → Deploy manually**
3. Glisse-dépose le dossier `pcc-landing-page/` entier
4. ✅ C'est en ligne

Alternative (si tu as un repo Git) :
1. **New site from Git** → sélectionne ton repo GitHub
2. Netlify build automatiquement à chaque push

## Après déploiement

- Teste tous les liens (formulaire, TikTok, pages légales, Telegram)
- Teste le formulaire (doit faire un POST vers ton endpoint)
- Teste sur mobile (375px) et desktop — le hero animé + section bots doivent être fluides
- Vérifier le **LCP** (hero animé) en DevTools → doit être < 2s en 4G
- Meta Ads pixel : ajoute le pixel Facebook pour le retargeting (optionnel mais recommandé)

## Notes

- Pas de build step, pas de dépendances npm — c'est du pur HTML/CSS/JS
- Le serveur Netlify sert juste les fichiers statiques
- Les redirects HTTP 301 (si tu dois renommer des pages) se font via `_redirects` (créé si besoin)
- Netlify gère les certificats HTTPS automatiquement
