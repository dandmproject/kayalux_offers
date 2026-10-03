# План за хостване на офертата АВАНТИ (стъпка по стъпка)

Документът е написан така, че друг човек или друг модел да може да го изпълни от начало до край без допълнителни въпроси. Всички пътища са спрямо корена на хранилището `dandmproject/kayalux_offers` (клон `claude/peaceful-fermi-ga4idt`), локално например `C:\Users\User\Downloads\kayalux offer\kayalux-avanti\`.

---

## 0. Какво има в проекта и какво отива на хостинга

| Папка/файл | На хостинга? | Какво е |
|---|---|---|
| `site/` | **ДА, съдържанието ѝ** | Истинският сайт: `index.php`, `assets/`, `api/`, `.htaccess`, `robots.txt` |
| `hosting/root.htaccess` | **ДА**, преименуван на `.htaccess` | Отива в **корена** на поддомейна; затваря всичко освен тайните папки |
| `hosting/robots.txt` | **ДА** | Отива в **корена** на поддомейна |
| `hosting/.htaccess` | само за вариант Б | `.htaccess` за самостоятелния HTML файл (DirectoryIndex index.html) |
| `offers/avanti-777/*.html` | само за вариант Б | Самостоятелен файл с всичко вградено (без реалните човешки модели) |
| `tools/` | НЕ | Локален сървър, минификация, сглобяване |
| `START-WINDOWS.bat`, `START-MAC.command`, `.version`, `.git`, `hosting/*.md` | НЕ | Само за локална работа |

**Кратко:** на хостинга не се качва цялата папка на проекта. Качва се **съдържанието на `site/`** в тайна папка и два файла от `hosting/` в корена на поддомейна.

---

## 1. Изисквания към хостинга

- cPanel (или подобен) с Apache 2.4 или LiteSpeed; включени `mod_rewrite`, `mod_headers` (обикновено са), за предпочитане и `mod_deflate` или `mod_brotli`.
- PHP 8.0+ с PDO MySQL (за `api/sign.php`). Самата страница няма PHP логика, `.php` е само за заглавки и без кеш.
- MySQL/MariaDB (1 база, 1 таблица).
- `mail()` да работи (стандартно на cPanel) или SMTP от хостинга.
- AutoSSL (Let's Encrypt) за поддомейна.
- Място: около 5 MB.

---

## 2. Сглобяване преди качване (прави се локално, само ако е променян код)

Файловете в хранилището вече са сглобени (`app.min.js`, `offer.min.css`, `?v=` хешовете в `index.php`). Ако е сменян `offer.js`, `people-gltf.js` или `offer.css`:

```
cd tools
npm i
node minify.mjs          # прави assets/js/app.min.js и assets/css/offer.min.css и сменя ?v=<хеш> в index.php
cd ..
python3 tools/build_single.py   # (по желание) пресглобява самостоятелния файл за вариант Б
```

Ако са сменени човешките модели (`site/assets/models/*.glb`, `manifest.json`, `rb-anims.glb`): в `site/assets/js/people-gltf.js` смени `var MV='?v=...'` на нова стойност (например днешна дата + буква), после `node minify.mjs`. Иначе браузърите, които са кеширали старите модели, ще продължат да ги показват.

Проверка след сглобяване: в `site/index.php` редовете `assets/css/offer.min.css?v=` и `assets/js/app.min.js?v=` трябва да имат нов хеш.

---

## 3. Вариант А (препоръчан): целият сайт в тайна папка на поддомейн

### 3.1 Поддомейн
1. cPanel → *Domains* → *Create A New Domain* → `oferti.kayalux.bg`.
2. Document root: `/home/CPANEL_USER/oferti` (отделно от `public_html`).
3. cPanel → *SSL/TLS Status* → поддомейна → *Run AutoSSL*. Изчакай валиден сертификат.
4. DNS: ако домейнът е в същия cPanel, записът се прави сам. Иначе A запис `oferti` → IP на хостинга.

### 3.2 Корен на поддомейна
В `/home/CPANEL_USER/oferti/` качи:
- `hosting/root.htaccess` → **преименувай на `.htaccess`**
- `hosting/robots.txt`

Ефект: `https://oferti.kayalux.bg/` и всяка непозната пътека дават 404. Отварят се само папки с име от 20+ знака `[a-z0-9-]` и `robots.txt`.

### 3.3 Тайна папка
1. Генерирай име (поне 20 знака, само малки латински букви, цифри и тирета, иначе коренният `.htaccess` го блокира):
   - Linux/Mac/cPanel Terminal: `echo "$(openssl rand -hex 10 | sed 's/\(....\)/\1-/g;s/-$//')-avanti"`
   - Windows PowerShell: `-join ((48..57)+(97..122) | Get-Random -Count 24 | % {[char]$_}) + "-avanti"`
2. Създай `/home/CPANEL_USER/oferti/<тайно-име>/`.
3. Качи **съдържанието** на `site/` (не самата папка `site`) вътре. Най-лесно:
   - локално направи zip от съдържанието на `site/` (включително скрития `.htaccess`);
   - File Manager → Upload → zip → *Extract* в тайната папка → изтрий zip-а.
4. File Manager → *Settings* → *Show Hidden Files* и провери, че `.htaccess` е там.

Резултатната структура:
```
/home/CPANEL_USER/oferti/
├── .htaccess            (от hosting/root.htaccess)
├── robots.txt           (от hosting/robots.txt)
└── <тайно-име>/
    ├── .htaccess        (от site/.htaccess; DirectoryIndex index.php)
    ├── index.php
    ├── robots.txt
    ├── api/
    │   ├── .htaccess    (само POST към sign.php)
    │   ├── sign.php
    │   └── schema.sql   (.htaccess забранява достъп до .sql)
    └── assets/
        ├── css/  fonts/  img/  js/
        └── models/      (19 × .glb + rb-anims.glb + manifest.json)
```

### 3.4 База данни за подписа
1. cPanel → *MySQL Databases* → нова база (напр. `CPANELUSER_offers`) и потребител със силна парола → *Add User To Database* → *ALL PRIVILEGES*.
2. cPanel → *phpMyAdmin* → базата → *Import* → `api/schema.sql` (или копирай SQL в таба *SQL*).
3. В `<тайно-име>/api/sign.php` попълни константите на ред 6-7:
   ```php
   const DB_HOST='localhost';
   const DB_NAME='CPANELUSER_offers';
   const DB_USER='CPANELUSER_offers';
   const DB_PASS='<паролата>';
   const MAIL_TO='scent@kayalux.bg';      // къде идва имейлът с подписа
   const OFFER_NO='2026-148-A';
   ```
4. Не качвай попълнения `sign.php` обратно в GitHub (паролата остава само на сървъра).

Без база и без попълнен `sign.php` всичко останало работи; подписът тогава се пази на устройството на клиента и се праща с бутона за имейл.

### 3.5 Какво правят заглавките (вече са в `site/.htaccess`, нищо не се пише ръчно)
- Само HTTPS (301 от http).
- Ботове и търсачки (Google, Bing, Facebook, WhatsApp, Telegram, GPTBot, curl, wget и др.) → 403.
- `X-Robots-Tag: noindex, nofollow, noarchive...`, `Referrer-Policy: no-referrer`, `X-Frame-Options: DENY`, HSTS, COOP, `nosniff`.
- CSP: `script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval'` (meshopt декодерът е WebAssembly), `img-src 'self' data: blob:`, `connect-src 'self' data: blob:`. Ако се добави външен ресурс, трябва да се добави и тук, иначе браузърът го блокира.
- Кеш: страницата `no-store`; `.css/.js/.woff2` за година (`immutable`, защото имат `?v=<хеш>`); `.glb/.json/.png/.jpg/.webp/.svg` за 1 час (моделите се обновяват чрез `MV`).
- Компресия: deflate/brotli за html, css, js, json, glb.
- MIME: `.glb` → `model/gltf-binary`, `.woff2` → `font/woff2`.
- Само GET/HEAD навсякъде, POST само към `api/sign.php`.

LiteSpeed: всичко работи. Ако някъде се получи 500 заради `.htaccess`, провери за ред `Header unset ETag` и го махни; ако хостингът няма `mod_brotli`, блокът `<IfModule>` просто се пропуска.

---

## 4. Вариант Б: един самостоятелен HTML файл

За бърз линк без PHP/MySQL. Човешките модели не са вградени (в схемата има опростени фигури), подписът се праща само с бутона за имейл.
1. `python3 tools/build_single.py` → `offers/avanti-777/aromatizatsia-2026-148-a.html`.
2. Стъпки 3.1-3.3 както горе, но в тайната папка качваш:
   - този HTML файл, **преименуван на `index.html`**;
   - `hosting/.htaccess` (с `DirectoryIndex index.html`).

---

## 5. Вариант В: локално (за преглед и тестове)

`START-WINDOWS.bat` (Windows) или `START-MAC.command` (Mac) → `tools/serve.py` на порт 5340 (или първия свободен), отваря браузъра, обновява се сам от GitHub на всеки 3 минути и показва бутон „Има нова версия“. Това не е за клиенти.

---

## 6. Проверка след качване (всичко в частен прозорец)

| # | Какво | Очаквано |
|---|---|---|
| 1 | `https://oferti.kayalux.bg/` | 404 |
| 2 | `https://oferti.kayalux.bg/nqkakvo/` | 404 |
| 3 | `http://oferti.kayalux.bg/<тайно-име>/` | 301 към https |
| 4 | `https://oferti.kayalux.bg/<тайно-име>/` | офертата се зарежда, без грешки в DevTools → Console |
| 5 | DevTools → Network → документа | има `X-Robots-Tag`, `Content-Security-Policy`, `Cache-Control: private, no-store` |
| 6 | `.../assets/js/app.min.js?v=...` | `Cache-Control: ... immutable`, `Content-Encoding: br` или `gzip` |
| 7 | `.../assets/models/manifest.json` | 200, JSON |
| 8 | `.../api/schema.sql`, `.../.htaccess`, `.../api/` | 403 или 404 |
| 9 | `curl -I https://oferti.kayalux.bg/<тайно-име>/` | 403 (curl е в списъка на ботовете, така трябва) |
| 10 | Скрол до 3D схемата | лентата за зареждане стига 100 %, после се вижда магазинът, тече презентацията |
| 11 | `https://oferti.kayalux.bg/<тайно-име>/?diag=1` | появява се диагностичен панел (fps, кадри) с бутон за копиране на лога |
| 12 | Подпис (ако е настроена база) | ред в `offer_signatures` в phpMyAdmin + имейл с PNG на `MAIL_TO` |
| 13 | iPhone (Safari) и Android (Chrome) | всичко зарежда, 3D се върти с пръсти, контактните бутони работят |
| 14 | https://securityheaders.com | A или A+ |

Ако т. 4 е бяла страница: Console ще покаже CSP грешка (добави източника в CSP) или 404 на файл (не е качен, или е качена папката `site` вместо съдържанието ѝ).

---

## 7. Даване и спиране на достъп

- Даваш: пращаш `https://oferti.kayalux.bg/<тайно-име>/` на клиента, за предпочитане по имейл.
- Спираш: File Manager → *Rename* на тайната папка. Старият линк спира веднага.
- Друг клиент: отделна тайна папка с отделно копие. Нищо общо между тях.
- Парола само за една оферта (по желание): cPanel → *Directory Privacy* върху тайната папка.

---

## 8. Обновяване на вече качена оферта

1. Локално: промяна → `node minify.mjs` (и нов `MV`, ако са сменени моделите) → тест с `START-WINDOWS.bat`.
2. Качи само променените файлове (обикновено `index.php`, `assets/js/app.min.js`, `assets/css/offer.min.css`) с презаписване.
3. **Не** презаписвай `api/sign.php` на сървъра (там са паролите), освен ако не е променен; тогава попълни константите отново.
4. Отвори линка в частен прозорец и провери т. 4, 10 и 11 от раздел 6. Заради `?v=<хеш>` клиентите получават новата версия веднага, без да чистят кеш.

---

## 9. Алгоритъм накратко (за изпълнение от друг модел)

```
1. git pull клон claude/peaceful-fermi-ga4idt
2. ако е променян код: cd tools && npm i && node minify.mjs
3. създай поддомейн oferti.<домейн> с document root извън public_html; пусни AutoSSL
4. качи в корена: hosting/root.htaccess → .htaccess, hosting/robots.txt
5. генерирай тайно име (≥20 знака, [a-z0-9-]) и създай папката
6. качи СЪДЪРЖАНИЕТО на site/ (с .htaccess) в тайната папка
7. създай MySQL база и потребител, импортирай api/schema.sql
8. попълни DB_HOST, DB_NAME, DB_USER, DB_PASS, MAIL_TO в api/sign.php на сървъра
9. изпълни проверките от раздел 6; при грешка виж Console и раздел 3.5
10. прати линка https://oferti.<домейн>/<тайно-име>/ на клиента
```
