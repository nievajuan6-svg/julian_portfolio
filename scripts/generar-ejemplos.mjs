// Genera ilustraciones abstractas de EJEMPLO para ver el diseño de la web antes de tener las obras reales.
// Uso: node scripts/generar-ejemplos.mjs      Para borrarlas: borrá los archivos que empiezan con "Ejemplo".
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const OBRAS = path.join(process.cwd(), "contenido", "obras");
const PROCESO = path.join(process.cwd(), "contenido", "proceso");
const HERO = path.join(process.cwd(), "contenido", "hero");

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
}
const pal = [
  ["#0b1e4a", "#1d4ed8", "#7dd3fc", "#e0f2fe"],
  ["#0a0c10", "#1e3a8a", "#3b82f6", "#bae6fd"],
  ["#111827", "#312e81", "#6366f1", "#c7d2fe"],
  ["#020617", "#0c4a6e", "#0ea5e9", "#f0f9ff"],
  ["#0f172a", "#1e40af", "#60a5fa", "#dbeafe"],
];

function personaje(w, h, seed, etapa = 4) {
  const r = rng(seed);
  const [a, b, c, d] = pal[seed % pal.length];
  const cx = w * 0.5, cy = h * 0.42;
  const head = w * 0.17;
  const boceto = etapa === 1, bloque = etapa === 2;
  const fondo = boceto ? "#0f1420" : `url(#bg)`;
  const trazo = (s, wd = 3) => `stroke="${boceto ? "#7dd3fc" : d}" stroke-opacity="${boceto ? 0.7 : 0.35}" stroke-width="${wd}" stroke-linecap="round"`;
  let rays = "";
  for (let i = 0; i < 14; i++) {
    const x = r() * w, y = r() * h * 0.7, l = 60 + r() * 220;
    rays += `<line x1="${x}" y1="${y}" x2="${x + l * 0.3}" y2="${y + l}" ${trazo(0, 1.5)}/>`;
  }
  const relleno = boceto ? "none" : bloque ? "#1e3a8a" : `url(#piel)`;
  const ropa = boceto ? "none" : bloque ? "#0f2557" : `url(#ropa)`;
  const detalles = etapa >= 3
    ? `<circle cx="${cx - head * 0.35}" cy="${cy - head * 0.05}" r="${head * 0.07}" fill="${d}"/><circle cx="${cx + head * 0.35}" cy="${cy - head * 0.05}" r="${head * 0.07}" fill="${d}"/>
       <path d="M${cx - head * 0.9} ${cy - head * 0.6} Q${cx} ${cy - head * 1.9} ${cx + head * 0.9} ${cy - head * 0.6} Q${cx + head * 1.15} ${cy + head * 0.9} ${cx + head * 0.6} ${cy + head * 1.5} L${cx + head * 0.5} ${cy + head * 0.2} Q${cx} ${cy - head * 0.75} ${cx - head * 0.5} ${cy + head * 0.2} L${cx - head * 0.6} ${cy + head * 1.5} Q${cx - head * 1.15} ${cy + head * 0.9} ${cx - head * 0.9} ${cy - head * 0.6}Z" fill="${etapa === 4 ? "url(#pelo)" : "#0b1a3d"}" opacity="0.95"/>`
    : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="38%" r="75%"><stop offset="0" stop-color="${c}" stop-opacity=".9"/><stop offset=".55" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></radialGradient>
    <linearGradient id="piel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${d}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <linearGradient id="ropa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b}"/><stop offset="1" stop-color="${a}"/></linearGradient>
    <linearGradient id="pelo" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${c}"/></linearGradient>
    <filter id="glow"><feGaussianBlur stdDeviation="${w * 0.02}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${fondo}"/>
  ${etapa >= 3 ? `<circle cx="${cx}" cy="${cy}" r="${w * 0.33}" fill="${d}" opacity=".16" filter="url(#glow)"/>` : ""}
  ${etapa >= 3 ? `<circle cx="${cx}" cy="${cy}" r="${w * 0.3}" fill="none" ${trazo(0, 2)} />` : ""}
  ${rays}
  <path d="M${w * 0.08} ${h} Q${w * 0.12} ${cy + head * 2.2} ${cx} ${cy + head * 1.7} Q${w * 0.88} ${cy + head * 2.2} ${w * 0.92} ${h}Z" fill="${ropa}" ${boceto ? trazo(0, 3) : ""}/>
  <rect x="${cx - head * 0.28}" y="${cy + head * 0.7}" width="${head * 0.56}" height="${head * 1.1}" rx="${head * 0.2}" fill="${relleno}" ${boceto ? trazo(0, 3) : ""}/>
  <ellipse cx="${cx}" cy="${cy}" rx="${head * 0.85}" ry="${head}" fill="${relleno}" ${boceto ? trazo(0, 3) : ""}/>
  ${detalles}
  ${boceto ? `<line x1="${cx}" y1="${cy - head}" x2="${cx}" y2="${cy + head}" ${trazo(0, 1.5)} stroke-dasharray="8 8"/><line x1="${cx - head}" y1="${cy}" x2="${cx + head}" y2="${cy}" ${trazo(0, 1.5)} stroke-dasharray="8 8"/>` : ""}
</svg>`;
}

function paisaje(w, h, seed, etapa = 4) {
  const r = rng(seed);
  const [a, b, c, d] = pal[seed % pal.length];
  const boceto = etapa === 1, bloque = etapa === 2;
  const capas = [];
  const n = 5;
  for (let i = 0; i < n; i++) {
    const base = h * (0.45 + i * 0.11);
    let p = `M0 ${h} L0 ${base}`;
    const pasos = 8 + i * 2;
    for (let k = 1; k <= pasos; k++) p += ` L${(w / pasos) * k} ${base - r() * h * (0.22 - i * 0.03)}`;
    p += ` L${w} ${h}Z`;
    const t = i / (n - 1);
    const col = boceto ? "none" : bloque ? ["#0f2557", "#12306e", "#163a85", "#1a449a", "#1d4ed8"][i] : `url(#l${i})`;
    capas.push(`<path d="${p}" fill="${col}" ${boceto ? `stroke="#7dd3fc" stroke-opacity=".6" stroke-width="3"` : ""}/>`);
  }
  const defs = Array.from({ length: n }, (_, i) => {
    const t = i / (n - 1);
    return `<linearGradient id="l${i}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${i === 0 ? c : b}" stop-opacity="${0.55 + t * 0.45}"/><stop offset="1" stop-color="${a}"/></linearGradient>`;
  }).join("");
  const estrellas = etapa >= 3 ? Array.from({ length: 60 }, () => `<circle cx="${r() * w}" cy="${r() * h * 0.5}" r="${0.6 + r() * 1.8}" fill="${d}" opacity="${0.3 + r() * 0.6}"/>`).join("") : "";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset=".6" stop-color="${b}"/><stop offset="1" stop-color="${c}"/></linearGradient>${defs}
    <filter id="glow"><feGaussianBlur stdDeviation="${w * 0.03}"/></filter>
  </defs>
  <rect width="${w}" height="${h}" fill="${boceto ? "#0f1420" : "url(#sky)"}"/>
  ${estrellas}
  ${etapa >= 3 ? `<circle cx="${w * 0.72}" cy="${h * 0.24}" r="${w * 0.11}" fill="${d}" opacity=".35" filter="url(#glow)"/>` : ""}
  <circle cx="${w * 0.72}" cy="${h * 0.24}" r="${w * 0.05}" fill="${boceto ? "none" : d}" ${boceto ? `stroke="#7dd3fc" stroke-opacity=".6" stroke-width="3"` : ""}/>
  ${capas.join("")}
</svg>`;
}

function geometrica(w, h, seed, etapa = 4) {
  const r = rng(seed);
  const [a, b, c, d] = pal[seed % pal.length];
  const boceto = etapa === 1;
  let formas = "";
  for (let i = 0; i < 9; i++) {
    const x = r() * w, y = r() * h, s = 80 + r() * Math.min(w, h) * 0.45;
    const col = [a, b, c, d][i % 4];
    const op = boceto ? 0 : 0.35 + r() * 0.6;
    const st = boceto ? `stroke="#7dd3fc" stroke-opacity=".6" stroke-width="3" fill="none"` : `fill="${col}" fill-opacity="${op}"`;
    if (i % 3 === 0) formas += `<circle cx="${x}" cy="${y}" r="${s / 2}" ${st}/>`;
    else if (i % 3 === 1) formas += `<rect x="${x - s / 2}" y="${y - s / 2}" width="${s}" height="${s * (0.5 + r())}" rx="${r() * 30}" transform="rotate(${r() * 60 - 30} ${x} ${y})" ${st}/>`;
    else formas += `<polygon points="${x},${y - s / 2} ${x + s / 2},${y + s / 2} ${x - s / 2},${y + s / 2}" ${st}/>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs>
  <rect width="${w}" height="${h}" fill="${boceto ? "#0f1420" : "url(#g)"}"/>
  ${formas}
  <rect x="${w * 0.08}" y="${h * 0.08}" width="${w * 0.84}" height="${h * 0.84}" fill="none" stroke="${d}" stroke-opacity=".35" stroke-width="3"/>
</svg>`;
}

async function guardar(svg, archivo) {
  await fs.mkdir(path.dirname(archivo), { recursive: true });
  await sharp(Buffer.from(svg)).png().toFile(archivo);
}

const obras = [
  ["personajes", "01_Ejemplo Retrato Aurora__Krita__2025", personaje, 1600, 2000, 11],
  ["concept-art", "02_Ejemplo Valle Nocturno__Photoshop__2025", paisaje, 2400, 1500, 22],
  ["editorial", "03_Ejemplo Portada Norte__Illustrator__2024__Revista Norte", geometrica, 1600, 2100, 33],
  ["personajes", "04_Ejemplo Guardián__Clip Studio Paint__2025", personaje, 1800, 1800, 44],
  ["concept-art", "05_Ejemplo Ciudad Flotante__Blender + Photoshop__2024__Estudio Demo", paisaje, 2400, 1350, 55],
  ["editorial", "06_Ejemplo Ensayo Visual__Clip Studio Paint__2024", geometrica, 2200, 1500, 66],
  ["personajes", "07_Ejemplo Viajera__Krita__2024", personaje, 1500, 2100, 77],
  ["concept-art", "08_Ejemplo Faro__Photoshop__2024", paisaje, 1700, 2200, 88],
  ["editorial", "09_Ejemplo Ritmo__Illustrator__2023", geometrica, 2000, 2000, 99],
];
for (const [cat, nombre, fn, w, h, seed] of obras) await guardar(fn(w, h, seed), path.join(OBRAS, cat, `${nombre}.png`));

await guardar(paisaje(3200, 1800, 7), path.join(HERO, "hero.png"));

const dirP = path.join(PROCESO, "Ejemplo Retrato Aurora");
const nombresE = ["1_boceto", "2_linea", "3_render", "4_final"];
for (let i = 0; i < 4; i++) await guardar(personaje(1600, 2000, 11, i + 1), path.join(dirP, `${nombresE[i]}.png`));
await fs.writeFile(
  path.join(dirP, "notas.txt"),
  "1: Thumbnails rápidos para encontrar la pose y el ritmo de la composición.\n2: Bloqueo de formas y paleta limitada en azules para fijar la atmósfera.\n3: Luces, volumen del rostro y detalles de textura en el cabello.\n4: Ajustes finales de color, contraste y resplandor.\n"
);
const dirP2 = path.join(PROCESO, "Ejemplo Valle Nocturno");
for (let i = 0; i < 4; i++) await guardar(paisaje(2400, 1500, 22, i + 1), path.join(dirP2, `${nombresE[i]}.png`));
await fs.writeFile(
  path.join(dirP2, "notas.txt"),
  "1: Siluetas y planos de profundidad.\n2: Bloques de color por capas atmosféricas.\n3: Luz de luna, estrellas y bruma.\n4: Acabado y corrección de color.\n"
);
console.log("Ejemplos generados.");
