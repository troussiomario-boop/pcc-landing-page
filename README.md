# Pay Comedy Club — Landing page

Landing page de génération de leads pour **Pay Comedy Club (PCC)** : un robot de trading
automatisé, gratuit pour l'utilisateur (modèle revenue-share avec un broker partenaire).

Page statique, mobile-first, optimisée pour du trafic Meta Ads vidéo (95% mobile).
Aucun build step, aucun framework : HTML + CSS + JS vanilla.

## Stack

- HTML statique + CSS écrit à la main
- JavaScript vanilla (formulaire multi-étapes, sticky CTA, accordéon FAQ)
- [Tabler icons](https://tabler.io/icons) via CDN
- Police Inter via Google Fonts (chargement non bloquant)

## Structure

```
pcc-landing-page/
├── index.html                      # landing principale (9 sections)
├── mentions-legales.html           # page légale (modèle à compléter)
├── politique-confidentialite.html  # page RGPD (modèle à compléter)
├── contact.html                    # page contact (email / TikTok / Telegram)
├── styles.css        # styles, mobile-first puis @media min-width:768px
├── script.js         # formulaire + sticky CTA + FAQ + robot mascotte
├── assets/
│   ├── logo-pcc.svg  # logo placeholder (à remplacer par le PNG fourni)
│   └── og-image.svg  # source de l'OG image (à exporter en JPG)
└── README.md
```

## Robot mascotte (décor animé)

Un petit robot SVG flotte en arrière-plan (coin bas-gauche). Il bouge (flottement,
clignement, salut), son antenne pulse et **ses yeux suivent le curseur**. Il est en
`pointer-events: none` (ne bloque jamais le formulaire) et désactivé si l'utilisateur
a activé « réduire les animations ». Pour ajuster sa discrétion : `opacity` de `.bot`
dans `styles.css`.

## Pages légales & risque

L'avertissement sur les risques a été retiré du footer de la landing. Il reste présent
dans la **FAQ**, dans la **case à cocher obligatoire** du formulaire, et est désormais
documenté dans **mentions-legales.html** (encadré « Avertissement sur les risques »).
Les 3 pages légales sont des **modèles** : cherche les blocs `.todo` et les `<!-- TODO -->`
pour renseigner l'entité juridique, l'hébergeur, l'email, etc.

## Lancer en local

Aucune dépendance. Ouvre simplement le fichier :

```bash
open index.html
```

Ou sers le dossier (recommandé pour tester `fetch` / CORS) :

```bash
python3 -m http.server 8000   # puis http://localhost:8000
```

## Déployer

### Vercel / Netlify (drag & drop)
1. Va sur le dashboard Vercel (« Add New → Project ») ou Netlify (« Add new site → Deploy manually »).
2. Glisse-dépose le dossier `pcc-landing-page/` entier.
3. C'est en ligne. Aucune config de build (framework preset = « Other / None »).

## ⚠️ À remplacer avant la prod

Cherche les commentaires `TODO` dans le code. À traiter :

| # | Quoi | Où |
|---|------|----|
| 1 | **Endpoint du formulaire** — `window.PCC_FORM_ENDPOINT` (webhook/CRM réel) | `script.js` (en haut) |
| 2 | **Logo** — remplacer `assets/logo-pcc.svg` par le vrai `logo-pcc.png` et mettre à jour les `src` | `index.html` (hero + footer) |
| 3 | **Captures membres** — remplacer les 4 placeholders `.proof__ph` par les vraies captures (WebP + fallback JPG, `loading="lazy"`) | `index.html` §4 |
| 4 | **Lien MyFxBook** public | `index.html` §4 |
| 5 | **OG image** — exporter `assets/og-image.svg` en JPG 1200×630 et mettre l'URL **absolue** de prod | `index.html` `<head>` |
| 6 | **Lien Telegram** — success screen + `contact.html` | `index.html` §7, `contact.html` |
| 7 | **Pages légales** — remplir entité juridique, hébergeur, durées RGPD (blocs `.todo`) | `mentions-legales.html`, `politique-confidentialite.html` |
| 8 | **Email de contact** — actuellement `contact@paycomedyclub.com` (placeholder) | `contact.html` |

### Définir l'endpoint sans toucher au JS

Tu peux surcharger l'endpoint avant le chargement de `script.js` :

```html
<script>window.PCC_FORM_ENDPOINT = 'https://ton-webhook.example/leads';</script>
```

## Payload envoyé par le formulaire (POST JSON)

```json
{
  "montant": "Entre 400€ et 800€",
  "experience": "Débutant, je n'ai jamais tradé",
  "objectif": "Compléter mes revenus",
  "prenom": "…", "nom": "…", "email": "…", "telephone": "…",
  "consent_contact": true, "consent_risque": true,
  "submitted_at": "2026-06-06T…Z", "page": "https://…"
}
```

> Note : les leads « Moins de 400€ » sont **quand même** envoyés (pour le retargeting),
> mais voient un message de liste d'attente sur le success screen.
