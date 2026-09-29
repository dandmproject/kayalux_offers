# Реални хора за 3D схемата – Microsoft Rocketbox → GLB

Източник: https://github.com/microsoft/Microsoft-Rocketbox (MIT лиценз, 115 ригнати аватара + 417 анимации).

- `rb_avatar.sh <Категория> <Име>` – сваля FBX + текстури от GitHub, конвертира с FBX2glTF (`npm pack fbx2gltf`), вгражда текстури (JPEG 1024/768) → `people/<име>.glb`
- `rb_embed.py` – вграждането на текстурите в GLB
- `rb_anims.py` – събира клиповете walk/walkslow/idle/wait/look/phone/bag (м/ж) в един `rb-anims.glb`, in-place, 15 fps, ≤ 8 s
- `avatars.txt` – кои аватари са свалени; финалният избор (32) е в `site/assets/models/manifest.json`
