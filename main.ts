import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { existsSync } from 'node:fs';
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { buildDossier } from './vendor/makefun-frontend.ts';

const entryHome = dirname(fileURLToPath(import.meta.url));
const packageHome = resolve(entryHome, process.env.MAKEFUN_OUTPUT_DIR ?? '/output');

await mkdir(packageHome, { recursive: true });
await cp(join(entryHome, 'app'), join(packageHome, 'app'), { recursive: true });

const capturesHome = join(entryHome, 'screenshots');
if (existsSync(capturesHome)) {
  await cp(capturesHome, join(packageHome, 'screenshots'), { recursive: true });
}

const dossierBytes = buildDossier(packageHome, {
  app_max_bytes: 16777216,
  app_max_files: 993,
  screenshots: { max_bytes: 262144, max: 3 },
  text_max_bytes: 163840,
});
await writeFile(join(packageHome, 'dossier.json'), dossierBytes);
