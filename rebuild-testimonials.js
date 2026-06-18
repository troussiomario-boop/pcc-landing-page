#!/usr/bin/env node
/*
 * Reconstruit le carrousel "Les résultats partagés" de la landing page PCC.
 * Scanne ~/Documents/pcc-landing-page/assets/testimonials/, trouve toutes les
 * images, les trie par numéro (testimonial-4 ... testimonial-13) et régénère
 * les cartes dans index.html. Sauvegarde l'ancien fichier en index.html.bak.
 *
 * Lancer :  node rebuild-testimonials.js
 */
const fs = require('fs');
const path = require('path');
const os = require('os');

const REPO = path.join(os.homedir(), 'Documents', 'pcc-landing-page');
const HTML = path.join(REPO, 'index.html');
const IMG_DIR = path.join(REPO, 'assets', 'testimonials');
const WEB_DIR = '/assets/testimonials';

// 1. Lister les images du dossier
const exts = ['.jpg', '.jpeg', '.png', '.webp'];
let files;
try {
  files = fs.readdirSync(IMG_DIR).filter(f => exts.includes(path.extname(f).toLowerCase()));
} catch (e) {
  console.error('❌ Dossier introuvable : ' + IMG_DIR);
  process.exit(1);
}
if (files.length === 0) {
  console.error('❌ Aucune image trouvée dans ' + IMG_DIR);
  process.exit(1);
}

// Trier par le numéro présent dans le nom (testimonial-7.jpg -> 7)
const num = f => { const m = f.match(/(\d+)/); return m ? parseInt(m[1], 10) : 0; };
files.sort((a, b) => num(a) - num(b));

// 2. Construire les cartes (sans légende)
const cards = files.map(f =>
  '        <div class="testimonial-card">\n' +
  '          <img src="' + WEB_DIR + '/' + f + '" alt="Résultat partagé par la communauté" class="testimonial-img">\n' +
  '        </div>'
).join('\n');
const newInner = '\n' + cards + '\n      ';

// 3. Lire index.html
let html;
try {
  html = fs.readFileSync(HTML, 'utf8');
} catch (e) {
  console.error('❌ index.html introuvable : ' + HTML);
  process.exit(1);
}

// 4. Trouver le bloc .testimonials-grid et remplacer son contenu (en équilibrant les <div>)
const openTag = '<div class="testimonials-grid">';
const start = html.indexOf(openTag);
if (start === -1) {
  console.error('❌ "testimonials-grid" introuvable dans index.html — rien modifié.');
  process.exit(1);
}
let depth = 1;
let closeStart = -1;
const re = /<div\b|<\/div>/g;
re.lastIndex = start + openTag.length;
let m;
while ((m = re.exec(html)) !== null) {
  if (m[0] === '</div>') {
    depth--;
    if (depth === 0) { closeStart = m.index; break; }
  } else {
    depth++;
  }
}
if (closeStart === -1) {
  console.error('❌ Balises <div> non équilibrées — rien modifié.');
  process.exit(1);
}

const newHtml = html.slice(0, start + openTag.length) + newInner + html.slice(closeStart);

// 5. Sauvegarde + écriture
fs.writeFileSync(HTML + '.bak', html, 'utf8');
fs.writeFileSync(HTML, newHtml, 'utf8');

console.log('✅ ' + files.length + ' screenshots insérés dans le carrousel :');
files.forEach(f => console.log('   - ' + f));
console.log('\n💾 Ancien fichier sauvegardé → index.html.bak');
console.log('   (pour annuler : mv index.html.bak index.html)');
