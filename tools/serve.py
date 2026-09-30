#!/usr/bin/env python3
"""KAYA LUX · офертата за АВАНТИ на твоя компютър.

Пуска папката site/ като сайт: gzip за текста, дълго кеширане за модели, шрифтове и снимки
(вторият път всичко идва от кеша на браузъра), index.php без PHP частта.
Порт: първият свободен от 5340 нагоре. Друг порт: serve.py 5400
Вижда се и от телефон в същата Wi-Fi мрежа (адресът се изписва при старта).
Само Python 3, без допълнителни пакети.
"""
import gzip, io, mimetypes, os, re, socket, sys, threading, webbrowser
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'site')
SKIP = {5300}
TEXT = ('text/', 'application/javascript', 'application/json', 'image/svg+xml')
LONG = ('/assets/models/', '/assets/fonts/', '/assets/img/', '/assets/js/three.min.js', '/assets/js/GLTFLoader.js',
        '/assets/js/SkeletonUtils.js', '/assets/js/meshopt_decoder.js')
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
        elif path.endswith('.php'):
            self.send_header('Cache-Control', 'no-cache')
        else:
            self.send_header('Cache-Control', 'public, max-age=3600')  # offer.js / offer.css: адресът носи ?v=
        self.send_header('X-Robots-Tag', 'noindex, nofollow')
        self.send_header('Referrer-Policy', 'no-referrer')
        self.send_header('Content-Security-Policy', CSP)  # същата като в site/.htaccess, за да се хване всяко нарушение още локално
        self.end_headers()
        self.wfile.write(data)



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


if __name__ == '__main__':
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
