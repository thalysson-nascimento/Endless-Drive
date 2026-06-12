// ╔══════════════════════════════════════════════════════════════╗
// ║  SETUP ÚNICO — rode na raiz do projeto:                      ║
// ║  node setup-house-sprite.mjs                                 ║
// ║  Isso salva o sprite 2.5D em public/models/assets/           ║
// ╚══════════════════════════════════════════════════════════════╝
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Base64 da casa roxa com fundo transparente (512×770 px, RGBA)
// Gerado automaticamente pelo Claude — não editar
const HOUSE_B64 = "PLACEHOLDER_B64";

const buf = Buffer.from(HOUSE_B64, 'base64');
const outPath = path.join(__dirname, 'public', 'models', 'assets', 'house-a.2-5d.png');

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, buf);

console.log('✅  house-a.2-5d.png salvo em', outPath);
console.log(`    Tamanho: ${(buf.length / 1024).toFixed(1)} KB`);
