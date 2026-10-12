// Serveur local du dossier publié (dist) avec les en-têtes de firebase.json, dont la CSP :
// node scripts/serve.mjs [port]   (après `npm run build`)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const cfg = JSON.parse(fs.readFileSync(path.join(root, 'firebase.json'), 'utf8')).hosting;
const site = path.join(root, cfg.public);
const port = Number(process.argv[2]) || 5173;
const pick = (...src) => cfg.headers.filter((h) => src.includes(h.source)).flatMap((h) => h.headers);
const base = pick('**');
const htmlOnly = pick('**/*.html').filter((x) => x.key === 'Content-Security-Policy');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json',
  '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.vcf': 'text/vcard; charset=utf-8',
  '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf' };

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  let f = path.join(site, p);
  if (!f.startsWith(site) || /[\/]\./.test(p)) { res.writeHead(403); return res.end(); }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html';
  const ok = fs.existsSync(f) && fs.statSync(f).isFile();
  if (!ok) f = path.join(site, '404.html');
  const h = { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' };
  base.forEach((x) => (h[x.key] = x.value));
  if (f.endsWith('.html')) htmlOnly.forEach((x) => (h[x.key] = x.value));
  // Compression comme Firebase Hosting (brotli/gzip), pour des mesures réalistes.
  const text = /text|javascript|json|xml|svg/.test(h['Content-Type']);
  const ae = String(req.headers['accept-encoding'] || '');
  const stream = fs.createReadStream(f);
  res.setHeader('Vary', 'Accept-Encoding');
  if (text && ae.includes('br')) { h['Content-Encoding'] = 'br'; res.writeHead(ok ? 200 : 404, h); stream.pipe(zlib.createBrotliCompress()).pipe(res); }
  else if (text && ae.includes('gzip')) { h['Content-Encoding'] = 'gzip'; res.writeHead(ok ? 200 : 404, h); stream.pipe(zlib.createGzip()).pipe(res); }
  else { res.writeHead(ok ? 200 : 404, h); stream.pipe(res); }
}).listen(port, () => console.log(`http://localhost:${port}`));
