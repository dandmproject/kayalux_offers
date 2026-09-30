#!/bin/bash
# Свива моделите за хостинга: текстури (тяло 512 JPEG, глава 384 JPEG, прозрачност 256 PNG) + gltfpack -cc (meshopt).
# Употреба: tools/rocketbox/pack.sh <папка с изходни .glb> site/assets/models
# Нужни: python3 + Pillow, npx gltfpack (npm i gltfpack). Браузърът декодира с assets/js/meshopt_decoder.js.
set -e
SRC="$1"; DST="$2"; TMP=$(mktemp -d)
for f in "$SRC"/*.glb; do n=$(basename "$f")
  if [ "$n" = rb-anims.glb ]; then npx gltfpack -i "$f" -o "$DST/$n" -cc -kn -af 24
  else python3 "$(dirname "$0")/prep_textures.py" "$f" "$TMP/$n" && npx gltfpack -i "$TMP/$n" -o "$DST/$n" -cc -kn; fi
done
rm -rf "$TMP"
