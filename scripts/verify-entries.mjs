import { readFileSync, existsSync } from 'fs';
// FIX: Import `process` to ensure it's available in the module scope and fix the type error on `process.exit`.
import process from 'node:process';

let ok = true;
if (!existsSync('index.html')) { console.log('FAIL: index.html ausente'); ok = false; }
else {
  const html = readFileSync('index.html','utf8');
  if (!html.includes('<script type="module" src="./index.tsx"></script>')) { console.log('FAIL: index.html sem script correto'); ok = false; }
  else console.log('OK: index.html');
}
if (!existsSync('index.tsx')) { console.log('FAIL: index.tsx ausente'); ok = false; } else console.log('OK: index.tsx');
if (!existsSync('App.tsx')) { console.log('FAIL: App.tsx ausente'); ok = false; } else console.log('OK: App.tsx');
process.exit(ok ? 0 : 1);