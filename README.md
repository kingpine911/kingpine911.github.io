# site/ — le site à mettre en ligne

**Ce dossier est entièrement regénéré par `python3 sources/build.py`. N'y modifiez rien à la main : vos changements seraient perdus au prochain build.** Seul ce fichier README est conservé.

## Ce qu'il contient
```
site/
├── index.html, le-centre.html, plongee.html, …   les 9 pages en français
├── en/                                            les 9 mêmes pages en anglais
└── assets/
    ├── css/style.css    toute la mise en forme
    ├── js/script.js     toutes les interactions
    └── img/             les photos, le logo et le favicon
```
Environ 7 Mo au total. Les photos, les styles et le script sont partagés par toutes les pages : le navigateur ne les télécharge qu'une fois.

## Mettre en ligne sur GitHub
Déposez **tout le contenu de ce dossier** à la racine du dépôt GitHub (ou du dossier publié par GitHub Pages) : les pages, le dossier `en/` et le dossier `assets/`, en gardant cette organisation. La page d'accueil est `index.html`.

- Le fichier `.nojekyll` (masqué sur Mac) fait partie de l'envoi : il demande à GitHub de servir les fichiers tels quels.
- Les anciens fichiers `oceanes-dream-v9.html` et `oceanes-dream-v9-en.html` ne font plus partie du site : vous pouvez les retirer du dépôt, ou les garder comme ancienne version.
- À chaque mise à jour, remplacez l'ensemble du dossier : les noms des fichiers de style et de script portent un numéro de version, qui force les navigateurs à recharger la nouvelle mise en forme.

## Voir le site sur votre ordinateur
Ouvrez `index.html` dans un navigateur : tous les liens fonctionnent sans serveur. Les polices demandent une connexion Internet.

## Avant un vrai passage en production
1. **Formulaire.** Il ouvre aujourd'hui WhatsApp ou la messagerie du visiteur avec le message pré-rempli. Pour un envoi direct depuis la page, il faudra un service de réception.
2. **Nom de domaine et HTTPS.**
3. **Référencement.** `sitemap.xml`, `robots.txt`, données structurées, adresses définitives dans les balises `hreflang`.
4. **Mentions légales** et politique de confidentialité ; bannière de consentement si un outil de mesure est ajouté.
5. **Photos.** Plusieurs tailles par image (`srcset`), et des originaux en meilleure définition pour l'accueil.
6. **Témoignages réels** à la place des deux avis fictifs de l'accueil.
