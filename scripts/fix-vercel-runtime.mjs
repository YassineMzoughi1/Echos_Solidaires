// Force every Vercel serverless function bundled by Astro to use nodejs20.x.
// Works around @astrojs/vercel v7's runtime detection which silently falls
// back to nodejs18.x — a runtime Vercel no longer accepts.
import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const FUNCTIONS_DIR = '.vercel/output/functions';
const TARGET_RUNTIME = 'nodejs20.x';

if (!existsSync(FUNCTIONS_DIR)) {
  console.log(`[fix-vercel-runtime] ${FUNCTIONS_DIR} not found, skipping.`);
  process.exit(0);
}

let patched = 0;
for (const entry of readdirSync(FUNCTIONS_DIR, { withFileTypes: true })) {
  if (!entry.isDirectory() || !entry.name.endsWith('.func')) continue;
  const cfgPath = join(FUNCTIONS_DIR, entry.name, '.vc-config.json');
  if (!existsSync(cfgPath)) continue;

  const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));
  if (cfg.runtime && cfg.runtime !== 'edge' && cfg.runtime !== TARGET_RUNTIME) {
    const before = cfg.runtime;
    cfg.runtime = TARGET_RUNTIME;
    writeFileSync(cfgPath, JSON.stringify(cfg, null, 2));
    console.log(`[fix-vercel-runtime] ${entry.name}: ${before} → ${TARGET_RUNTIME}`);
    patched += 1;
  }
}

console.log(`[fix-vercel-runtime] patched ${patched} function(s).`);
