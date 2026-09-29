#!/bin/bash
# usage: rb_avatar.sh <Category> <Name>   -> people/<name>.glb  (downloads fbx+textures, converts, embeds 1024px jpeg, cleans up)
set -e
CAT=$1; NAME=$2; B="https://raw.githubusercontent.com/microsoft/Microsoft-Rocketbox/master/Assets/Avatars/$CAT/$NAME"
W=work/$NAME; mkdir -p $W people; cd $W
[ -f ../../people/$(echo $NAME | tr 'A-Z' 'a-z').glb ] && exit 0
curl -sS -m 300 -o a.fbx "$B/Export/${NAME}_facial.fbx"; FACIAL=1; if [ ! -s a.fbx ] || [ "$(head -c 2 a.fbx)" != "Ka" ]; then curl -sS -m 180 -o a.fbx "$B/Export/$NAME.fbx"; FACIAL=0; fi
# texture basenames referenced by the fbx
for t in $(strings -n 8 a.fbx | grep -oE '[A-Za-z0-9_]+_color\.tga' | sort -u); do
  curl -sS -m 300 -o "$t" "$B/Textures/$t" || true
done
../../../fbx/bin/Linux/FBX2glTF -i a.fbx -o a0.glb --binary >/dev/null 2>&1
if [ "$FACIAL" = 1 ]; then python3 ../../rb_facial.py a0.glb a.glb >/dev/null; else mv a0.glb a.glb; fi
python3 ../../rb_embed.py a.glb ../../people/$(echo $NAME | tr 'A-Z' 'a-z').glb
cd ../..; rm -rf $W
