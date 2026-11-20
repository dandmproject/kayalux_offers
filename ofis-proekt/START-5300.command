#!/bin/bash
cd "$(dirname "$0")/3d"
echo "Ofis 3D: http://localhost:5300/"
ipconfig getifaddr en0 2>/dev/null | sed "s#^#Za telefon: http://#; s#\$#:5300/#"
(sleep 1; open http://localhost:5300/) &
python3 -m http.server 5300
