// Свива скриптовете и стиловете на site/ в два файла: assets/js/app.min.js и assets/css/offer.min.css.
// Изходните файлове остават четими; след всяка промяна в тях: cd tools && npm i && node minify.mjs
import {readFileSync, writeFileSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {minify} from 'terser';
import {minify as cssMin} from 'csso';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..', 'site');
const JS = ['GLTFLoader.js', 'SkeletonUtils.js', 'meshopt_decoder.js', 'people-gltf.js', 'offer.js'];
const parts = {};
for (const f of JS) parts[f] = readFileSync(join(SITE, 'assets/js', f), 'utf8');
// each file keeps its own scope (they are IIFEs / UMD), so they are minified one by one and joined
let out = '';
for (const f of JS) {
  const r = await minify({[f]: parts[f]}, {ecma: 2019, compress: {passes: 2}, mangle: true, format: {comments: /^!|@license|MIT/i}});
  out += r.code.replace(/;?\s*$/, ';') + '\n';
}
writeFileSync(join(SITE, 'assets/js/app.min.js'), out);
const css = cssMin(readFileSync(join(SITE, 'assets/css/offer.css'), 'utf8'), {restructure: true}).css;
writeFileSync(join(SITE, 'assets/css/offer.min.css'), css);
const kb = s => (Buffer.byteLength(s) / 1024).toFixed(0) + ' KB';
console.log('app.min.js', kb(out), '(от', kb(Object.values(parts).join('')) + ')', '· offer.min.css', kb(css));
