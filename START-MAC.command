#!/bin/bash
cd "$(dirname "$0")/site"
URL=http://localhost:8080/index.php
( sleep 1; open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null ) &
if command -v php >/dev/null; then php -S localhost:8080; else python3 -m http.server 8080; fi
