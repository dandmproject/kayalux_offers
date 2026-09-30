# Търговска оферта за АВАНТИ – сайт за хостване (cPanel, PHP, MySQL)

Папката е готова за качване в тайната директория на поддомейна (виж `hosting/README.md`).

```
index.php            страницата (без PHP логика; .php е за да не се кешира и да не се листва)
assets/css/offer.css стилове (шрифтовете са в assets/fonts)
assets/js/           three.min.js, GLTFLoader.js, SkeletonUtils.js, meshopt_decoder.js, people-gltf.js, offer.js
assets/img/          лого, подпис, снимки на устройствата
assets/models/       32 реалистични човешки модела (GLB, свити с gltfpack) + rb-anims.glb + manifest.json
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

## Локално на твоя компютър
Двоен клик на `START-WINDOWS.bat` (Windows) или `START-MAC.command` (Mac) в корена на проекта. Скриптът пуска `tools/serve.py` на първия свободен порт от **5340** нагоре и отваря браузъра. Сървърът компресира текста (gzip) и кешира моделите, шрифтовете и снимките за година, така че второто отваряне идва от кеша. Адресът за телефон в същата Wi-Fi мрежа се изписва в прозореца. Друг порт: `python3 tools/serve.py 5400`.

(Подписът към `api/sign.php` работи само с PHP + MySQL; локално бутонът „Подпиши“ пази подписа на устройството.)

## Тегло
Страницата без моделите е около 0,7 MB (компресирана). Моделите са общо около 5,4 MB (32 човека по ~170 KB + анимации 0,5 MB), свити с `tools/rocketbox/pack.sh` (gltfpack, meshopt). Те тръгват на заден план след зареждането на страницата и се кешират; докато пристигнат, в схемата се движат опростени фигури, които се подменят една по една, без да спира картината.

## Самостоятелен файл
`python3 tools/build_single.py` сглобява `offers/avanti-777/aromatizatsia-2026-148-a.html` от тази папка (всичко вградено, без реалните модели).
