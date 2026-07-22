import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const assetDirectory = resolve(scriptDirectory, process.argv[2] || '../assets/basic-shell');
const manifest = JSON.parse(await readFile(resolve(assetDirectory, 'manifest.json'), 'utf8'));
const failures = [];

for (const asset of manifest.assets) {
  const filePath = resolve(assetDirectory, asset.file);
  try {
    const bytes = await readFile(filePath);
    const actual = createHash('sha256').update(bytes).digest('hex');
    if (actual !== asset.sha256) failures.push(`${asset.file}: expected ${asset.sha256}, received ${actual}`);
  } catch (error) {
    failures.push(`${asset.file}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log(`Verified ${manifest.assets.length} Basic shell assets in ${assetDirectory}`);

