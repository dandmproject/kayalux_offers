# Частни оферти на домейна на KAYA LUX (достъп само с линк)

Без парола. Сигурността идва от три неща:

1. **Адресът не може да се познае.** Офертата стои в папка с дълго случайно име, например `https://oferti.kayalux.bg/k7x2-9qzv-m4pd-w8rt-avanti/`. Такъв адрес не може да се налучка, а сървърът отговаря с 404 на всичко друго.
2. **Търсачките не я получават.** Ботовете на Google, Bing, Facebook, WhatsApp, Telegram и десетки други получават 403 още преди страницата. За всеки друг клиент сървърът праща заглавка `X-Robots-Tag: noindex, nofollow, noarchive`, така че и при случайно попадане нищо не се индексира и не се архивира.
3. **Няма откъде да изтече.** Никакво листване на папки, `Referrer-Policy: no-referrer` (адресът не се праща на cdnjs при зареждане на three.js), `Cache-Control: no-store`, забрана за вграждане в чужд сайт.

Какво това **не** спира: човек, който има линка, може да го препрати. Ако го пусне в социална мрежа или публичен чат, ботовете за preview няма да го отворят (403), но хората ще. Ако това стане проблем за конкретна оферта, добавяш парола само за нея (виж най-долу) или сменяш името на папката, което прави стария линк невалиден веднага.

## Стъпки в cPanel

1. **Поддомейн.** cPanel → *Domains* → *Create A New Domain* → `oferti.kayalux.bg`, document root `/home/CPANEL_USER/oferti`. Отделна папка, не `public_html`.

2. **SSL.** cPanel → *SSL/TLS Status* → поддомейна → *Run AutoSSL*.

3. **Корен на поддомейна.** В `/home/CPANEL_USER/oferti/` качи:
   - `root.htaccess`, преименуван на `.htaccess`
   - `robots.txt`

   Този `.htaccess` връща 404 за всичко освен тайните папки и `robots.txt`.

4. **Тайна папка за офертата.** Име: поне 20 знака, само малки букви, цифри и тирета (иначе кореновият `.htaccess` я блокира). Генерирай го, не го измисляй:
   - cPanel → *Terminal*: `echo "$(openssl rand -hex 10 | sed 's/\(....\)/\1-/g' | sed 's/-$//')-avanti"`
   - или на твоя компютър същата команда; на Windows: PowerShell `-join ((48..57)+(97..122) | Get-Random -Count 24 | % {[char]$_})`

   Създай папката `/home/CPANEL_USER/oferti/<името>/` и качи в нея:
   - `index.html` (офертата; името `index.html` е нарочно: линкът свършва с `/` и файлът не се вижда в адреса)
   - `.htaccess` от тази папка (файлът с пълните заглавки)

   File Manager → *Settings* → *Show Hidden Files*, за да виждаш `.htaccess`.

5. **Проверка** (в частен прозорец):
   - `https://oferti.kayalux.bg/` → 404
   - `https://oferti.kayalux.bg/<името>/` → офертата
   - `https://oferti.kayalux.bg/<името>/index.html` → офертата (или го редиректни на `/`, не е задължително)
   - `http://…` → прескача на `https://`
   - `curl -I https://oferti.kayalux.bg/<името>/` → 403 (curl е в списъка с ботове; така трябва)
   - от браузър: DevTools → Network → заглавката `X-Robots-Tag` трябва да присъства
   - https://securityheaders.com → A/A+

6. **Search Console.** Не добавяй поддомейна и не подавай sitemap. Ако основният домейн `kayalux.bg` има sitemap, увери се, че не включва `oferti.`.

## Как даваш и спираш достъп

- Даваш: пращаш линка на клиента. По-добре по имейл, не в чат с preview. (Preview ботовете ще получат 403, но е чист навик.)
- Спираш: преименуваш папката (File Manager → *Rename*). Старият линк умира веднага, новият важи. Или изтриваш папката, когато офертата изтече.
- Няколко клиента: отделна тайна папка за всеки. Нищо общо между тях.

## Ако някога поискаш парола за конкретна оферта

Само в нейната папка, в началото на `.htaccess`, добави:

```
AuthType Basic
AuthName "KAYA LUX"
AuthUserFile /home/CPANEL_USER/oferti.htpasswd
Require valid-user
```

и създай `oferti.htpasswd` една папка над `oferti` с `htpasswd -nB ime` (cPanel → *Terminal*). Или cPanel → *Directory Privacy* върху папката, което прави същото с кликове.

## LiteSpeed

Всичко работи. Ако сървърът даде 500, махни реда `Header unset ETag`.

## Нула външни заявки

Офертата има всичко вградено (шрифтове, лого, подпис) освен библиотеката three.js от cdnjs. Ако искаш и нея локално: свали `three.min.js` в тайната папка, в `index.html` смени `src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"` на `src="three.min.js"` и махни `https://cdnjs.cloudflare.com` от CSP реда в `.htaccess`.
