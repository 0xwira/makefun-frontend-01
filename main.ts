// FIELDNOTES is a static field guide to make.fun bounties, standings, and builders.
// Package the browser app and available screenshots, then describe the entry with
// the vendored dossier builder. MAKEFUN_OUTPUT_DIR selects a local output folder.
import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const source = fileURLToPath(new URL('.', import.meta.url));
const output = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
mkdirSync(output, { recursive: true });
cpSync(join(source, 'app'), join(output, 'app'), { recursive: true });
mkdirSync(join(output, 'screenshots'), { recursive: true });
if (existsSync(join(source, 'screenshots'))) {
  cpSync(join(source, 'screenshots'), join(output, 'screenshots'), { recursive: true });
}
writeFileSync(join(output, 'dossier.json'), buildDossier(output, {
  text_max_bytes: 163840,
  screenshots: { max: 3, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
}));
