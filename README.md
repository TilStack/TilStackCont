# Tilstackcont — page de liens TilStack (cont.tilstack.me)

Projet **Angular 20** (composants autonomes, signaux, sans zone.js) **pré-rendu en statique** : le HTML complet est généré à la compilation, donc la page s'affiche tout de suite et reste bien référencée. Version française par défaut, bascule EN, thème clair/sombre. Aucun cookie, aucune mesure d'audience.

## Commandes

| Commande | Rôle |
|---|---|
| `npm install` | installe les dépendances (une fois) |
| `npm start` | serveur de développement sur http://localhost:4200 |
| `npm run build` | compile et pré-rend dans `dist/tilstackcont/browser` |
| `npm run serve:dist` | sert `dist` sur http://localhost:5173 avec les en-têtes de `firebase.json` (CSP comprise), compressé comme sur Firebase |
| `npm test` | tests unitaires (Chrome sans interface) |

## Où modifier quoi

| Je veux changer… | Fichier |
|---|---|
| Prix, liens, réseaux, applications, numéro | `src/app/data/site.data.ts` |
| Tous les textes FR et EN (message WhatsApp compris) | `src/app/core/messages.ts` |
| Données structurées (prix = celui affiché, même constante) | `src/app/core/structured-data.ts` |
| Couleurs, tailles | `src/styles/` |
| Fiche contact téléchargeable, icônes, polices, images | `public/` |
| Fond tournant (échecs → damiers → pions → Bible, 5 h chacun) | règle dans `src/app/core/background.service.ts` et `public/assets/js/theme.js` ; motifs SVG régénérés par `node scripts/generate-backgrounds.mjs` ; damiers dans `src/styles/_theme.scss` |
| Titre/aperçu de partage (version française, fixe) | `src/index.html` |

Prix : 7 500 XAF (ancien prix 12 000 XAF), relevé le 2026-10-11 sur la page de vente ; équivalent 7 500 / 655,957 = 11,43 €. Si le prix change : `PRODUCT` dans `site.data.ts`, plus le « 7 500 XAF » des textes `description` (`messages.ts` et `src/index.html`).

Les styles sont globaux (pas de style dans les composants) et le JSON-LD est écrit au pré-rendu : c'est ce qui permet une CSP sans `'unsafe-inline'`. Le script `public/assets/js/theme.js` applique le thème mémorisé avant le premier affichage.

## Publier sur Firebase Hosting (à faire par Israel)

Le site réutilise le projet Firebase du portfolio (`tilportofoliov2`) avec un second site d'hébergement nommé `tilstack-cont`.

1. Se connecter (une seule fois) : `npx firebase-tools login`
2. Créer le site : `npx firebase-tools hosting:sites:create tilstack-cont --project tilportofoliov2`
3. Associer la cible (déjà inscrite dans `.firebaserc`, à refaire seulement si elle manque) : `npx firebase-tools target:apply hosting links tilstack-cont`
4. Compiler puis déployer : `npm run build` puis `npx firebase-tools deploy --only hosting:links`
5. Domaine personnalisé : console Firebase → Hosting → site `tilstack-cont` → « Ajouter un domaine personnalisé » → `cont.tilstack.me`.
6. Chez le registrar de `tilstack.me`, créer les enregistrements DNS demandés par Firebase (d'abord le TXT de vérification, puis le A ou CNAME pour `cont`). Le certificat HTTPS est émis automatiquement ensuite.

## Après la mise en ligne

- Tester l'aperçu de partage (WhatsApp, Facebook) et soumettre `https://cont.tilstack.me/sitemap.xml` à la Search Console.
- Lighthouse mobile sur l'adresse réelle.
