# Реални хора в 3D схемата (assets/models)

Схемата рисува хората процедурно, докато тук няма модели. Сложиш ли GLB файлове и ги опишеш в `manifest.json`, страницата ги зарежда сама и ги ползва вместо процедурните фигури (върви и без тях – нищо не се чупи).

## Откъде се вземат модели с реален вид

1. **Mixamo (Adobe, безплатно с Adobe ID)** – https://www.mixamo.com → *Characters*: Remy, Stefani, Regina, Malcolm, Pete, Ely, Jolleen, Kaya, Megan, Josh, Leonard, Louise… (реалистични хора в ежедневни дрехи).
   Download → Format **FBX Binary**, Skin **With Skin**, без анимация (T-pose). Конвертира се до GLB с:
   ```
   npx fbx2gltf -i Remy.fbx -o remy.glb --binary
   ```
   (Може и *Walking* / *Idle* анимации „with skin“ – тогава клиповете вътре се ползват директно; иначе се ползват общите от `anim.glb`.)
2. **Ready Player Me** – https://readyplayer.me → създаваш аватар от снимка, копираш линка `…/xxxx.glb` и го сваляш. Полуреалистичен стил, дрехи по избор.
3. **Sketchfab** (лиценз CC0/CC-BY, търси „rigged human mixamo“) – Download → glTF.

Условие: скелетът да е Mixamo-съвместим (кости Hips, Spine, LeftArm… с или без префикс `mixamorig:`). Височина, пол и роля се дават в manifest-а.

## manifest.json

```json
[
  {"file":"remy.glb",    "height":1.78, "tags":["m"]},
  {"file":"stefani.glb", "height":1.66, "tags":["f"]},
  {"file":"child.glb",   "height":1.15, "tags":["child"]},
  {"file":"leonard.glb", "height":1.72, "tags":["elderly","m"]},
  {"file":"cashier.glb", "height":1.68, "tags":["staff","f"]}
]
```

`tags`: `m`, `f`, `child`, `elderly`, `staff` – по тях схемата избира кого да пусне в магазина. Пълен набор за реалистична картина: 3–4 мъже, 3–4 жени, 1–2 деца, 1–2 възрастни, 1 касиер.

## Тегло и производителност

Един Mixamo персонаж е 1–4 MB (текстури 1024–2048 px). За 10 модела това са ~25 MB първо зареждане; после браузърът ги кешира. Ако е много: при конвертирането свали текстурите до 1024 px (`npx fbx2gltf … --binary` пази оригиналните).
