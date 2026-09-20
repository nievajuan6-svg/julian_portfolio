// Modo desarrollo: procesa las imágenes, arranca la web y VIGILA contenido/.
// Cada vez que agregás, borrás, reemplazás o renombrás una imagen, se reprocesa sola
// y la página abierta se actualiza (sin volver a arrancar nada).
// Uso: npm run dev   (o doble clic en ver-web.bat)
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const RAIZ = process.cwd();
const CONTENIDO = path.join(RAIZ, "contenido");
const EXT_IMG = /\.(png|jpe?g|webp|tiff?|avif)$/i;

const procesar = () =>
  new Promise((resolve) => {
    const p = spawn(process.execPath, [path.join("scripts", "build-obras.mjs")], { stdio: "inherit", cwd: RAIZ });
    p.on("close", resolve);
  });

await procesar();

const next = spawn("npx", ["next", "dev"], { stdio: "inherit", cwd: RAIZ, shell: true });
next.on("close", (c) => process.exit(c ?? 0));
for (const s of ["SIGINT", "SIGTERM"]) process.on(s, () => next.kill());

// --- vigilancia con espera de 1 s (para que termine de copiarse el archivo) y sin procesos simultáneos
let temporizador = null;
let corriendo = false;
let pendiente = false;

async function reprocesar() {
  if (corriendo) {
    pendiente = true;
    return;
  }
  corriendo = true;
  console.log("\n🔄  Cambio detectado en contenido/ … actualizando la web");
  await procesar();
  corriendo = false;
  if (pendiente) {
    pendiente = false;
    reprocesar();
  }
}

fs.watch(CONTENIDO, { recursive: true }, (_evento, archivo) => {
  if (!archivo) return;
  const nombre = archivo.toString();
  // Se ignoran temporales (~$archivo, .tmp, Thumbs.db); se reacciona a imágenes y a carpetas/notas
  if (/(^|[\\/])(~|\.)/.test(nombre) || /\.(tmp|crdownload|part)$/i.test(nombre)) return;
  if (!EXT_IMG.test(nombre) && /\.[a-z0-9]{2,5}$/i.test(nombre) && !/\.(txt|json)$/i.test(nombre)) return;
  clearTimeout(temporizador);
  temporizador = setTimeout(reprocesar, 1000);
});

console.log("\n👀  Vigilando contenido/ : agregá, borrá o reemplazá imágenes y la web se actualiza sola.\n");
