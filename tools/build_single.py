#!/usr/bin/env python3
"""Сглобява самостоятелната оферта (един HTML файл) от site/.

site/ е единственият източник. Файлът offers/avanti-777/aromatizatsia-2026-148-a.html се получава оттук:
стилове, шрифтове, снимки и скриптове са вградени; реалните човешки модели остават само за хостнатия сайт
(в единичния файл хората са процедурните фигури, които сайтът показва и докато моделите се зареждат).
Употреба: python3 tools/build_single.py
"""
import base64, os, re

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
SITE = os.path.join(ROOT, 'site')
OUT = os.path.join(ROOT, 'offers', 'avanti-777', 'aromatizatsia-2026-148-a.html')
MIME = {'.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2'}


def data_uri(rel):
    p = os.path.join(SITE, rel)
    with open(p, 'rb') as f:
        return 'data:%s;base64,%s' % (MIME[os.path.splitext(p)[1]], base64.b64encode(f.read()).decode())


def read(rel):
    with open(os.path.join(SITE, rel), encoding='utf-8') as f:
        return f.read()


html = read('index.php')
html = re.sub(r'^<\?php.*?\?>', '', html, count=1, flags=re.S)
# preloads are pointless once everything is inline
html = re.sub(r'<link rel="preload"[^>]*>\n', '', html)
css = read('assets/css/offer.min.css')
css = re.sub(r'url\(\.\./fonts/([^)]+)\)', lambda m: 'url(' + data_uri('assets/fonts/' + m.group(1)) + ')', css)
html = re.sub(r'<link rel="stylesheet" href="assets/css/offer(\.min)?\.css[^"]*">', lambda m: '<style>\n' + css + '\n</style>', html)
# real people (models + decoder + loader start) stay on the hosted site
for s in ('GLTFLoader.js', 'SkeletonUtils.js', 'meshopt_decoder.js', 'people-gltf.js'):
    html = re.sub(r'<script defer src="assets/js/' + re.escape(s) + r'[^"]*"></script>\n', '', html)
html = re.sub(r'<script>/\* моделите .*?</script>\n', '', html, flags=re.S)


def inline_js(m):
    js = read('assets/js/' + m.group(1))
    if m.group(1) == 'offer.js':
        js = js.replace("'assets/img/logo.jpg'", "'" + data_uri('assets/img/logo.jpg') + "'")
    return '<script>\n' + js.replace('</script', '<\\/script') + '\n</script>'


# the hosted bundle (app.min.js) carries the model loader too; the single file only needs offer.js
html = re.sub(r'<script defer src="assets/js/app\.min\.js[^"]*"></script>', '<script defer src="assets/js/offer.js"></script>', html)
html = re.sub(r'<script defer src="assets/js/([^"?]+)[^"]*"></script>', inline_js, html)
html = re.sub(r'(src|href)="(assets/img/[^"]+)"', lambda m: m.group(1) + '="' + data_uri(m.group(2)) + '"', html)
os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, 'w', encoding='utf-8') as f:
    f.write(html)
left = re.findall(r'(?:src|href)="assets/[^"]+"', html)
print('%s  %d KB%s' % (os.path.relpath(OUT, ROOT), os.path.getsize(OUT) // 1024, ('  непокрити: ' + ', '.join(left)) if left else ''))
