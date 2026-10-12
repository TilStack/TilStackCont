# Contenu modifiable

`apps.json` : la liste « Mes applications ». Pour ajouter une application, copiez un bloc et changez :

- `id` : identifiant unique, sans espace.
- `name` : nom affiché (non traduit).
- `logo` (facultatif) : chemin d'une image placée dans `public/assets/img/`. `alt` est alors requis.
- `url` (facultatif) : lien de la carte. Sans `url`, la carte n'est pas cliquable.
- `supportUrl` (facultatif) : ajoute un bouton « Me soutenir » vers ce lien.
- `soft` (facultatif) : `true` pour un badge discret (projet sans date).
- `desc` et `badge` : textes `fr` et `en`.

Ensuite : `npm run build`, puis `npx.cmd firebase-tools deploy --only hosting:links`.
