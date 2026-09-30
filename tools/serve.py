#!/usr/bin/env python3
"""KAYA LUX · офертата за АВАНТИ на твоя компютър.

Пуска папката site/ като сайт: gzip за текста, дълго кеширане за модели, шрифтове и снимки
(вторият път всичко идва от кеша на браузъра), index.php без PHP частта.
Порт: първият свободен от 5340 нагоре. Друг порт: serve.py 5400
Вижда се и от телефон в същата Wi-Fi мрежа (адресът се изписва при старта).
Само Python 3, без допълнителни пакети.

Обновяване: при старта и после на всеки 3 минути проверява в GitHub дали има нова версия на офертата;
ако има, я изтегля и подменя site/, tools/, hosting/, offers/ – без рестарт. Отвореният в браузъра сайт
показва бутон „Има нова версия · Обнови“. Без интернет всичко си работи с наличната версия.
Спиране на обновяването: serve.py --no-update
"""
import gzip, io, json, mimetypes, os, re, shutil, socket, sys, tempfile, threading, time, urllib.request, webbrowser, zipfile
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

BASE = os.path.normpath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
ROOT = os.path.join(BASE, 'site')
SKIP = {5300}
TEXT = ('text/', 'application/javascript', 'application/json', 'image/svg+xml')
LONG = ('/assets/fonts/', '/assets/js/three.min.js')  # never change; everything else is revalidated (ETag → 304), so an update shows at once
CSP = ("default-src 'none'; script-src 'self' 'unsafe-inline' 'wasm-unsafe-eval' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; "
       "img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' data: blob:; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
_gz = {}
_lock = threading.Lock()
mimetypes.add_type('model/gltf-binary', '.glb')
mimetypes.add_type('application/javascript', '.js')
mimetypes.add_type('font/woff2', '.woff2')


class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=ROOT, **kw)

    def log_message(self, fmt, *args):
        pass

    def do_GET(self):
        path = self.path.split('?', 1)[0].split('#', 1)[0]
        if path == '/':
            path = '/index.php'
        if path == '/__version':  # the page asks this to offer a reload after an update
            data = json.dumps({'sha': current_version()}).encode()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Cache-Control', 'no-store')
            self.send_header('Content-Length', str(len(data)))
            self.end_headers()
            self.wfile.write(data)
            return
        if path.startswith('/api/') or '/.' in path:
            self.send_error(404)
            return
        fs = os.path.realpath(os.path.join(ROOT, path.lstrip('/')))
        if not fs.startswith(os.path.realpath(ROOT)) or not os.path.isfile(fs):
            self.send_error(404)
            return
        st = os.stat(fs)
        etag = '"%x-%x"' % (int(st.st_mtime), st.st_size)
        ctype = 'text/html; charset=utf-8' if fs.endswith('.php') else (mimetypes.guess_type(fs)[0] or 'application/octet-stream')
        if self.headers.get('If-None-Match') == etag:
            self.send_response(304)
            self.send_header('ETag', etag)
            self.end_headers()
            return
        key = (fs, etag)
        with _lock:
            body = _gz.get(key)
        if body is None:
            with open(fs, 'rb') as f:
                raw = f.read()
            if fs.endswith('.php'):  # офертата е статична; PHP частта в началото праща само заглавки
                raw = re.sub(rb'^<\?php.*?\?>', b'', raw, count=1, flags=re.S)
                raw = raw.replace(b'</head>', b'<meta name="kl-local" content="1"></head>', 1)  # the page polls /__version only when served from here
            if ctype.startswith(TEXT) or fs.endswith('.php'):
                buf = io.BytesIO()
                with gzip.GzipFile(fileobj=buf, mode='wb', compresslevel=6, mtime=0) as g:
                    g.write(raw)
                body = (buf.getvalue(), True)
            else:
                body = (raw, False)
            with _lock:
                _gz[key] = body
        data, zipped = body
        use_gz = zipped and 'gzip' in (self.headers.get('Accept-Encoding') or '')
        if zipped and not use_gz:
            data = gzip.decompress(data)
        self.send_response(200)
        self.send_header('Content-Type', ctype)
        self.send_header('Content-Length', str(len(data)))
        self.send_header('ETag', etag)
        self.send_header('Vary', 'Accept-Encoding')
        if use_gz:
            self.send_header('Content-Encoding', 'gzip')
        if any(path.startswith(p) for p in LONG):
            self.send_header('Cache-Control', 'public, max-age=31536000, immutable')
        else:
            self.send_header('Cache-Control', 'no-cache')
        self.send_header('X-Robots-Tag', 'noindex, nofollow')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Content-Security-Policy', CSP)  # същата като в site/.htaccess, за да се хване всяко нарушение още локално
        self.end_headers()
        self.wfile.write(data)



# ---------- обновяване от GitHub ----------
REPO = 'dandmproject/kayalux_offers'
VERSION_FILE = os.path.join(BASE, '.version')
SYNC_DIRS = ('site', 'tools', 'hosting', 'offers')
_upd_lock = threading.Lock()


def current_version():
    try:
        with open(VERSION_FILE, encoding='utf-8') as f:
            return f.read().strip()
    except OSError:
        return ''


def _get(url, timeout=15):
    req = urllib.request.Request(url, headers={'User-Agent': 'kayalux-offer-updater', 'Accept': 'application/vnd.github+json'})
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return r.read()


def latest_sha():
    try:
        with open(os.path.join(BASE, 'tools', 'update-branch.txt'), encoding='utf-8') as f:
            branch = f.read().strip()
    except OSError:
        branch = 'claude/peaceful-fermi-ga4idt'
    try:
        return json.loads(_get('https://api.github.com/repos/%s/commits/%s' % (REPO, branch)))['sha']
    except Exception:
        default = json.loads(_get('https://api.github.com/repos/%s' % REPO))['default_branch']
        return json.loads(_get('https://api.github.com/repos/%s/commits/%s' % (REPO, default)))['sha']


def _sync(src, dst):
    """dst becomes an exact copy of src (node_modules left alone)."""
    keep = set()
    for d, dirs, files in os.walk(src):
        dirs[:] = [x for x in dirs if x != 'node_modules']
        rel = os.path.relpath(d, src)
        os.makedirs(os.path.join(dst, rel), exist_ok=True)
        for f in files:
            s_, t_ = os.path.join(d, f), os.path.normpath(os.path.join(dst, rel, f))
            keep.add(t_)
            if not os.path.exists(t_) or os.path.getsize(t_) != os.path.getsize(s_) or open(s_, 'rb').read() != open(t_, 'rb').read():
                shutil.copy2(s_, t_)
    for d, dirs, files in os.walk(dst, topdown=False):
        if 'node_modules' in d.split(os.sep):
            continue
        for f in files:
            p = os.path.normpath(os.path.join(d, f))
            if p not in keep:
                os.remove(p)


def update(quiet=False):
    """Returns True when a new version was installed."""
    if not _upd_lock.acquire(blocking=False):
        return False
    try:
        sha = latest_sha()
        if sha == current_version():
            return False
        print('Има нова версия на офертата, изтеглям я...', flush=True)
        blob = _get('https://codeload.github.com/%s/zip/%s' % (REPO, sha), timeout=180)
        with tempfile.TemporaryDirectory() as tmp:
            with zipfile.ZipFile(io.BytesIO(blob)) as z:
                for m in z.namelist():  # only plain relative paths
                    if m.startswith('/') or '..' in m.split('/'):
                        raise ValueError('unsafe path in the archive: ' + m)
                z.extractall(tmp)
            src = next(os.path.join(tmp, d) for d in os.listdir(tmp) if os.path.isdir(os.path.join(tmp, d)))
            for d in SYNC_DIRS:
                if os.path.isdir(os.path.join(src, d)):
                    _sync(os.path.join(src, d), os.path.join(BASE, d))
            shutil.copy2(os.path.join(src, 'START-MAC.command'), os.path.join(BASE, 'START-MAC.command'))
            # START-WINDOWS.bat may be the running script: the new copy waits beside it and is swapped in by the next start
            shutil.copy2(os.path.join(src, 'START-WINDOWS.bat'), os.path.join(BASE, 'START-WINDOWS.new'))
        with open(VERSION_FILE, 'w', encoding='utf-8') as f:
            f.write(sha)
        with _lock:
            _gz.clear()
        print('Готово: обновено до последната версия (%s). В браузъра натисни „Обнови“.' % sha[:7], flush=True)
        return True
    except Exception as e:
        if not quiet:
            print('Не успях да проверя за нова версия (%s). Работи наличната.' % e.__class__.__name__, flush=True)
        return False
    finally:
        _upd_lock.release()


def updater_loop():
    while True:
        time.sleep(180)
        update(quiet=True)


def free_port(start):
    for p in range(start, start + 60):
        if p in SKIP:
            continue
        with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
            try:
                s.bind(('0.0.0.0', p))
                return p
            except OSError:
                continue
    raise SystemExit('Няма свободен порт между %d и %d' % (start, start + 60))


def lan_ip():
    try:
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            s.connect(('10.255.255.255', 1))
            return s.getsockname()[0]
    except OSError:
        return None


def main():
    auto = '--no-update' not in sys.argv
    if auto:
        update()
        threading.Thread(target=updater_loop, daemon=True).start()
    nums = [a for a in sys.argv[1:] if a.isdigit()]
    port = free_port(int(nums[0]) if nums else 5340)
    httpd = ThreadingHTTPServer(('0.0.0.0', port), Handler)
    url = 'http://localhost:%d/' % port
    print('KAYA LUX · оферта АВАНТИ')
    print('  на този компютър:  ' + url)
    ip = lan_ip()
    if ip:
        print('  от телефон (същата Wi-Fi):  http://%s:%d/' % (ip, port))
    print('Затвори прозореца, за да спреш сайта.')
    if '--no-browser' not in sys.argv:
        threading.Timer(.8, lambda: webbrowser.open(url)).start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    for stream in (sys.stdout, sys.stderr):  # кирилицата в конзолата на Windows без грешки
        try:
            stream.reconfigure(encoding='utf-8', errors='replace')
        except Exception:
            pass
    try:
        main()
    except SystemExit:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        print('\nГРЕШКА: %s' % e)
        sys.exit(1)
