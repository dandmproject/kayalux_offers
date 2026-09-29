# Търговска оферта за АВАНТИ – сайт за хостване (cPanel, PHP, MySQL)

Папката е готова за качване в тайната директория на поддомейна (виж `hosting/README.md`).

```
index.php            страницата (без PHP логика; .php е за да не се кешира и да не се листва)
assets/css/offer.css стилове (шрифтовете са в assets/fonts)
assets/js/           three.min.js, GLTFLoader.js, SkeletonUtils.js, people-gltf.js, offer.js
assets/img/          лого, подпис, снимки на устройствата
assets/models/       32 реалистични човешки модела (GLB) + rb-anims.glb + manifest.json
api/sign.php         приема подписа (JSON с PNG), записва в MySQL и праща имейл
api/schema.sql       таблицата за подписите
.htaccess            защита: без индексиране, без листване, само с линк
robots.txt
```

## Качване в cPanel
1. Качи цялата папка в `/home/CPANEL_USER/oferti/<тайно-име>/` (File Manager → Upload, или zip + Extract). `.htaccess` е скрит файл – включи *Show Hidden Files*.
2. MySQL: cPanel → *MySQL Databases* → нова база и потребител с всички права. cPanel → *phpMyAdmin* → базата → *Import* → `api/schema.sql`.
3. Отвори `api/sign.php` и попълни `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASS` и `MAIL_TO` (имейлът, на който да пристига подписът).
4. Провери: `https://oferti.kayalux.bg/<тайно-име>/` → офертата; подпиши → в phpMyAdmin се появява ред в `offer_signatures`, а на `MAIL_TO` идва имейл с PNG.

Без база и без попълнен `sign.php` всичко останало работи; подписът тогава се пази само на устройството на клиента и се изпраща с бутона „Изпрати потвърждението“ (готов имейл).

## Локално на твоя компютър (за преглед, без cPanel)
В папката `site/`:
- с PHP: `php -S localhost:8080` → http://localhost:8080/
- или с Python: `python3 -m http.server 8080` → http://localhost:8080/index.php

(Подписът към `api/sign.php` работи само с PHP + MySQL; локално с Python бутонът „Подпиши“ пази подписа на устройството.)

## Тегло
Общо ~26 MB, от които ~23 MB са човешките модели. Те се зареждат на заден план едва когато 3D схемата наближи екрана и се кешират от браузъра. Ако хостингът е бавен, махни редове от `assets/models/manifest.json` (12–15 модела стигат).
