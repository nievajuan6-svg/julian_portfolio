// Procesa las imágenes de contenido/ y genera data/portfolio.generated.json
// Uso: npm run obras   (también corre solo antes de cada build)
import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const RAIZ = process.cwd();
const DIR_OBRAS = path.join(RAIZ, "contenido", "obras");
const DIR_HERO = path.join(RAIZ, "contenido", "hero");
const DIR_PROCESO = path.join(RAIZ, "contenido", "proceso");
const PUB = path.join(RAIZ, "public");
const SALIDA_JSON = path.join(RAIZ, "data", "portfolio.generated.json");
const CACHE_FILE = path.join(RAIZ, ".obras-cache.json");
const CATEGORIAS_FILE = path.join(RAIZ, "contenido", "categorias.json");

const ANCHOS = [480, 960, 1440, 2200];
const EXT_OK = new Set([".png", ".jpg", ".jpeg", ".webp", ".tif", ".tiff", ".avif"]);
const VERSION_CACHE = "v2"; // subir este valor fuerza a reprocesar todo
const FONDO = "#0A0C10";

const ESC = String.fromCharCode(27);
const pintar = (n) => (s) => `${ESC}[${n}m${s}${ESC}[0m`;
const c = { rojo: pintar(31), amar: pintar(33), verde: pintar(32), gris: pintar(90), neg: pintar(1) };
const avisos = [];
const errores = [];
const aviso = (m) => avisos.push(m);
const error = (m) => errores.push(m);

const existe = async (p) => !!(await fs.stat(p).catch(() => null));
const leerJson = async (p, def) => {
  try {
    return JSON.parse(await fs.readFile(p, "utf8"));
  } catch {
    return def;
  }
};

function slugify(s) {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/&/g, " y ")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "obra"
  );
}
function tituloDeCarpeta(s) {
  return s.replace(/[-_]+/g, " ").replace(/\b\p{L}/gu, (m) => m.toUpperCase());
}
async function listar(dir) {
  return (await fs.readdir(dir, { withFileTypes: true }).catch(() => [])).filter(
    (e) => !e.name.startsWith(".") && !e.name.startsWith("~")
  );
}
const esImagen = (e) => e.isFile() && EXT_OK.has(path.extname(e.name).toLowerCase());

// ---------- nombre de archivo -> ficha ----------
function parsearNombre(archivo, carpeta) {
  const base = path.basename(archivo, path.extname(archivo)).normalize("NFC").trim();
  let resto = base;
  let orden = null;
  const m = resto.match(/^(\d{1,3})[_\-\s]+(.+)$/);
  if (m) {
    orden = parseInt(m[1], 10);
    resto = m[2];
  }
  const partes = resto.split("__").map((p) => p.trim());
  const [titulo, software = "", anioRaw = "", ...clienteP] = partes;
  const cliente = clienteP.join(" ").trim();
  const ayuda = `Debería llamarse:  Titulo__Software__Año__Cliente.png   (ej: Retrato de Ana__Krita__2025.png)`;
  if (!titulo) {
    error(`${carpeta}/${archivo}\n     → No tiene título. ${ayuda}`);
    return null;
  }
  let anio = "";
  if (anioRaw) {
    if (/^(19|20)\d{2}$/.test(anioRaw)) anio = anioRaw;
    else
      aviso(
        `${carpeta}/${archivo}\n     → El año "${anioRaw}" no parece un año (4 cifras). Se muestra sin año. ${ayuda}`
      );
  }
  if (partes.length < 3) {
    aviso(
      `${carpeta}/${archivo}\n     → Faltan datos en el nombre (software y/o año). La obra se publica igual. ${ayuda}`
    );
  }
  return { titulo, software, anio, cliente, orden };
}

// ---------- procesado de imágenes ----------
async function procesarImagen(origen, dirRel, cache, nuevaCache) {
  const st = await fs.stat(origen);
  const clave = path.relative(RAIZ, origen).replace(/\\/g, "/");
  const firma = `${VERSION_CACHE}-${st.mtimeMs}-${st.size}-${dirRel}`;
  const previo = cache[clave];
  const dirAbs = path.join(PUB, dirRel);

  if (previo && previo.firma === firma) {
    const ok = await Promise.all(
      previo.res.anchos.flatMap((w) => ["avif", "webp"].map((f) => existe(path.join(dirAbs, `${w}.${f}`))))
    );
    if (ok.every(Boolean)) {
      nuevaCache[clave] = previo;
      return { ...previo.res, reutilizada: true };
    }
  }

  const meta = await sharp(origen, { limitInputPixels: false, failOn: "none" }).metadata();
  let w = meta.width;
  let h = meta.height;
  if (!w || !h) throw new Error("no se pudo leer el tamaño de la imagen");
  if (meta.orientation && meta.orientation >= 5) [w, h] = [h, w];

  const maxAncho = ANCHOS[ANCHOS.length - 1];
  const anchos = [...new Set([...ANCHOS.filter((a) => a < w), ...(w <= maxAncho ? [w] : [])])].sort((a, b) => a - b);
  await fs.rm(dirAbs, { recursive: true, force: true });
  await fs.mkdir(dirAbs, { recursive: true });

  const base = () => sharp(origen, { limitInputPixels: false, failOn: "none" }).rotate().flatten({ background: FONDO });
  for (const ancho of anchos) {
    const r = () => base().resize({ width: ancho, withoutEnlargement: true });
    await Promise.all([
      r().avif({ quality: 55, effort: 4 }).toFile(path.join(dirAbs, `${ancho}.avif`)),
      r().webp({ quality: 80 }).toFile(path.join(dirAbs, `${ancho}.webp`)),
    ]);
  }
  const lq = await base().resize({ width: 24 }).webp({ quality: 45 }).toBuffer();
  const res = { dir: dirRel, ancho: w, alto: h, lqip: `data:image/webp;base64,${lq.toString("base64")}`, anchos };
  nuevaCache[clave] = { firma, res };
  return { ...res, reutilizada: false };
}

async function limpiarHuerfanos(sub, usados) {
  const dir = path.join(PUB, sub);
  for (const e of await listar(dir)) {
    if (e.isDirectory() && !usados.has(`${sub}/${e.name}`)) {
      await fs.rm(path.join(dir, e.name), { recursive: true, force: true });
    }
  }
}

async function primeraImagen(dir) {
  const arch = (await listar(dir)).filter(esImagen);
  arch.sort((a, b) => a.name.localeCompare(b.name));
  return arch[0] ? path.join(dir, arch[0].name) : null;
}

// ---------- principal ----------
const t0 = Date.now();
await fs.mkdir(path.join(RAIZ, "data"), { recursive: true });
await fs.mkdir(PUB, { recursive: true });
const cache = await leerJson(CACHE_FILE, {});
const nuevaCache = {};
const catConfig = await leerJson(CATEGORIAS_FILE, {});
let nuevas = 0;
let reutil = 0;
const cuenta = (r) => (r.reutilizada ? reutil++ : nuevas++);

// --- obras
const slugsUsados = new Set();
const obras = [];
const fuentePorCategoria = {};
for (const carpeta of await listar(DIR_OBRAS)) {
  if (!carpeta.isDirectory()) continue;
  const catSlug = slugify(carpeta.name);
  const archivos = (await listar(path.join(DIR_OBRAS, carpeta.name))).filter(esImagen);
  for (const a of archivos) {
    const ficha = parsearNombre(a.name, carpeta.name);
    if (!ficha) continue;
    let slug = slugify(ficha.titulo);
    if (slugsUsados.has(slug)) slug = `${slug}-${catSlug}`;
    for (let i = 2; slugsUsados.has(slug); i++) slug = `${slugify(ficha.titulo)}-${i}`;
    slugsUsados.add(slug);
    try {
      const origen = path.join(DIR_OBRAS, carpeta.name, a.name);
      const r = await procesarImagen(origen, `obras/${slug}`, cache, nuevaCache);
      cuenta(r);
      const { reutilizada, ...datos } = r;
      obras.push({ slug, ...ficha, categoria: catSlug, ejemplo: /^ejemplo\b/i.test(ficha.titulo), ...datos });
      fuentePorCategoria[slug] = origen;
    } catch (e) {
      error(`${carpeta.name}/${a.name}\n     → No se pudo procesar la imagen (${e.message}). ¿Está dañada?`);
      slugsUsados.delete(slug);
    }
  }
}
obras.sort((a, b) => {
  if (a.orden != null && b.orden != null) return a.orden - b.orden;
  if (a.orden != null) return -1;
  if (b.orden != null) return 1;
  return (b.anio || "0").localeCompare(a.anio || "0") || a.titulo.localeCompare(b.titulo);
});

// --- categorías (orden: las de categorias.json primero, luego el resto alfabético)
const cats = new Map();
for (const o of obras) cats.set(o.categoria, (cats.get(o.categoria) ?? 0) + 1);
const conf = Object.fromEntries(Object.entries(catConfig).map(([k, v]) => [slugify(k), v]));
const orden = [...Object.keys(conf), ...[...cats.keys()].filter((k) => !(k in conf)).sort()];
const categorias = orden
  .filter((k) => cats.has(k))
  .map((slug) => ({ slug, label: conf[slug] ?? tituloDeCarpeta(slug), count: cats.get(slug) }));
const labelCat = Object.fromEntries(categorias.map((x) => [x.slug, x.label]));
for (const o of obras) o.categoriaLabel = labelCat[o.categoria];

// --- hero
let hero = null;
const heroSrc = await primeraImagen(DIR_HERO);
if (heroSrc) {
  try {
    const r = await procesarImagen(heroSrc, "hero/principal", cache, nuevaCache);
    cuenta(r);
    const { reutilizada, ...d } = r;
    hero = d;
  } catch (e) {
    error(`hero/${path.basename(heroSrc)}\n     → No se pudo procesar (${e.message}).`);
  }
}

// --- proceso
const ETAPAS = {
  boceto: "Boceto / Thumbnails",
  bocetos: "Boceto / Thumbnails",
  thumbnails: "Boceto / Thumbnails",
  linea: "Línea / Bloqueo de color",
  lineas: "Línea / Bloqueo de color",
  color: "Línea / Bloqueo de color",
  bloqueo: "Línea / Bloqueo de color",
  render: "Render y detalles",
  detalles: "Render y detalles",
  final: "Resultado final",
  resultado: "Resultado final",
};
const proceso = [];
for (const carpeta of await listar(DIR_PROCESO)) {
  if (!carpeta.isDirectory()) continue;
  const dir = path.join(DIR_PROCESO, carpeta.name);
  const titulo = carpeta.name.replace(/^\d{1,3}[_\-\s]+/, "").replace(/_/g, " ").trim();
  const pslug = slugify(titulo);
  const notasTxt = await fs.readFile(path.join(dir, "notas.txt"), "utf8").catch(() => "");
  const notas = {};
  for (const l of notasTxt.split(/\r?\n/)) {
    const m = l.match(/^\s*(\d+)\s*[:=\-]\s*(.+)$/);
    if (m) notas[+m[1]] = m[2].trim();
  }
  const etapas = [];
  const imgs = (await listar(dir)).filter(esImagen).map((e) => e.name).sort();
  for (const nombre of imgs) {
    const m = path.basename(nombre, path.extname(nombre)).match(/^(\d+)[_\-\s]*(.*)$/);
    if (!m) {
      aviso(
        `proceso/${carpeta.name}/${nombre}\n     → Debe empezar con un número: 1_boceto.png, 2_linea.png, 3_render.png, 4_final.png. Se ignora.`
      );
      continue;
    }
    const n = +m[1];
    const clave = slugify(m[2]);
    try {
      const r = await procesarImagen(path.join(dir, nombre), `proceso/${pslug}/${n}`, cache, nuevaCache);
      cuenta(r);
      const { reutilizada, ...d } = r;
      etapas.push({
        n,
        label: ETAPAS[clave] ?? (m[2] ? tituloDeCarpeta(m[2]) : `Paso ${n}`),
        nota: notas[n] ?? "",
        ...d,
      });
    } catch (e) {
      error(`proceso/${carpeta.name}/${nombre}\n     → No se pudo procesar (${e.message}).`);
    }
  }
  etapas.sort((a, b) => a.n - b.n);
  if (etapas.length >= 2) proceso.push({ slug: pslug, titulo, ejemplo: /^ejemplo\b/i.test(titulo), etapas });
  else if (imgs.length)
    aviso(`proceso/${carpeta.name}\n     → Necesita al menos 2 imágenes (boceto y final) para mostrarse.`);
}

// --- limpieza de derivados de imágenes que ya no existen
await limpiarHuerfanos("obras", new Set(obras.map((o) => o.dir)));
await limpiarHuerfanos("proceso", new Set(proceso.map((p) => `proceso/${p.slug}`)));
if (!hero) await fs.rm(path.join(PUB, "hero"), { recursive: true, force: true });

// --- imagen para redes (Open Graph)
try {
  const fuente = heroSrc ?? (obras[0] ? fuentePorCategoria[obras[0].slug] : null);
  if (fuente) {
    await sharp(fuente, { limitInputPixels: false, failOn: "none" })
      .rotate()
      .flatten({ background: FONDO })
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(PUB, "og.jpg"));
  }
} catch {
  /* la imagen para redes es opcional */
}

// --- CV
const cv = await existe(path.join(PUB, "cv", "julian-piaggio-cv.pdf"));

await fs.writeFile(
  SALIDA_JSON,
  JSON.stringify({ generado: new Date().toISOString(), anchos: ANCHOS, hero, obras, categorias, proceso, cv }, null, 1)
);
await fs.writeFile(CACHE_FILE, JSON.stringify(nuevaCache));

// ---------- resumen ----------
console.log(c.neg("\n🎨  Portfolio · procesado de imágenes"));
console.log(
  `   ${c.verde(obras.length + " obras")} en ${categorias.length} categorías · ${proceso.length} procesos · hero: ${hero ? "sí" : "no"} · CV: ${cv ? "sí" : "no"}`
);
console.log(c.gris(`   ${nuevas} imágenes procesadas, ${reutil} reutilizadas (caché) · ${((Date.now() - t0) / 1000).toFixed(1)}s`));
for (const cat of categorias) console.log(c.gris(`     · ${cat.label}: ${cat.count}`));
if (obras.some((o) => o.ejemplo) || proceso.some((p) => p.ejemplo))
  console.log(c.amar('\n   ℹ  Hay obras de EJEMPLO (nombre que empieza con "Ejemplo"). Borralas cuando subas las tuyas.'));
if (avisos.length) {
  console.log(c.amar(`\n   ⚠  ${avisos.length} aviso(s):`));
  avisos.forEach((m) => console.log(c.amar("   • " + m)));
}
if (errores.length) {
  console.log(c.rojo(`\n   ✖  ${errores.length} archivo(s) NO se publicaron:`));
  errores.forEach((m) => console.log(c.rojo("   • " + m)));
}
if (!obras.length)
  console.log(c.amar("\n   Todavía no hay obras. Arrastrá imágenes a contenido/obras/<categoria>/ y corré de nuevo."));
console.log("");
