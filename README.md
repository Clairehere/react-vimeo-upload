# Vimeo Upload

Montrer l'upload de vidéos Vimeo

## Upload de vidéos

L'upload se fait en effet en deux étapes.
1. Une requête POST vers l'URL https://api.vimeo.com/me/videos pour initialiser l'upload. Cette requête renvoie notamment un "upload link", une URL qui va servir à l'étape suivante
2. Une ou plusieurs requêtes PATCH vers le upload link, pour envoyer le fichier morceau par morceau

Le guide pour cette méthode d'upload appelée "Resumable approach" est ici: https://developer.vimeo.com/api/upload/videos#resumable-guide

Voir le fichier `upload_sample_response.json` pour voir ce que renvoie Vimeo quand on initialise un upload (1ère étape).

## A faire après

Faire une requête GET pour récupérer les infos de la vidéo une fois l'upload totalement fini *ET* le traitement par Viméo.

Pourquoi pas en utilisant [setTimeout](https://www.w3schools.com/Jsref/met_win_settimeout.asp) pour attendre un peu avant de faire le GET.