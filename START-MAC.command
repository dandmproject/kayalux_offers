#!/bin/bash
# KAYA LUX · оферта АВАНТИ: първият свободен порт от 5340 нагоре, браузърът се отваря сам.
cd "$(dirname "$0")"
if command -v python3 >/dev/null; then exec python3 tools/serve.py "$@"; fi
URL=http://localhost:5340/index.php
( sleep 1; open "$URL" 2>/dev/null || xdg-open "$URL" 2>/dev/null ) &
exec php -S 0.0.0.0:5340 -t site
