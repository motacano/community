// Escanea cada subcarpeta de public/assets/images y genera un manifest.json
// con la lista de fotos encontradas (nombre y cantidad NO se hardcodean en
// el componente Angular: el carrusel simplemente lee este manifest).
//
// Se ejecuta automáticamente antes de "npm start" y "npm run build"
// (ver "prestart"/"prebuild" en package.json), así que basta con añadir o
// quitar fotos de la carpeta del evento para que el carrusel se actualice.
import { readdirSync, statSync, writeFileSync } from 'node:fs';
import { join, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const imagesRoot = join(__dirname, '..', 'src', 'public', 'assets', 'images');
const IMAGE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif']);

// Orden natural (foto2.jpg antes que foto10.jpg) en vez de orden alfabético puro.
function naturalCompare(a, b) {
  return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
}

function generateManifestFor(folderPath) {
  const photos = readdirSync(folderPath)
    .filter((name) => IMAGE_EXTENSIONS.has(extname(name).toLowerCase()))
    .sort(naturalCompare);

  writeFileSync(join(folderPath, 'manifest.json'), JSON.stringify({ photos }, null, 2));
  return photos.length;
}

let entries;
try {
  entries = readdirSync(imagesRoot, { withFileTypes: true });
} catch {
  console.log(`[gallery] No existe ${imagesRoot}, nada que generar.`);
  process.exit(0);
}

const folders = entries.filter((entry) => entry.isDirectory());

if (folders.length === 0) {
  console.log('[gallery] No hay subcarpetas de galería en assets/images.');
}

for (const folder of folders) {
  const folderPath = join(imagesRoot, folder.name);
  if (!statSync(folderPath).isDirectory()) continue;
  const count = generateManifestFor(folderPath);
  console.log(`[gallery] ${folder.name}: ${count} foto(s) -> manifest.json`);
}
