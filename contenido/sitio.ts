/**
 * TEXTOS Y DATOS DEL SITIO — editá acá todo lo que no son imágenes.
 * Guardá el archivo y la web se actualiza. Solo cambiá lo que está entre comillas "…".
 */
export const sitio = {
  nombre: "Julián Piaggio",
  subtitulo: "Ilustrador digital — personajes, concept art e ilustración editorial.",
  descripcion:
    "Portfolio de Julián Piaggio, ilustrador digital: diseño de personajes, concept art e ilustración editorial. Disponible para encargos y colaboraciones con estudios y agencias.",

  // Dirección final de la web (sin barra al final). Se usa para SEO y para compartir en redes.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://nievajuan6-svg.github.io",

  // true = muestra el punto verde "Disponible". false = lo oculta.
  disponible: true,
  textoDisponible: "Disponible para nuevos proyectos",

  // ⚠️ COMPLETAR: tu email real
  email: "tuemail@ejemplo.com",

  // ⚠️ COMPLETAR: pegá la dirección completa de cada red. Las que dejes vacías ("") no se muestran.
  redes: [
    { nombre: "Instagram", url: "" }, // ej: "https://instagram.com/tuusuario"
    { nombre: "ArtStation", url: "" }, // ej: "https://artstation.com/tuusuario"
    { nombre: "Behance", url: "" }, // ej: "https://behance.net/tuusuario"
  ],

  // Formulario de contacto (opcional). Creá una cuenta gratis en formspree.io, hacé un formulario
  // y pegá acá su código (lo que viene después de /f/). Vacío = solo se muestra el botón de email.
  formspreeId: "",

  // ⚠️ COMPLETAR: texto de "Sobre mí". Cada línea entre comillas es un párrafo.
  sobreMi: [
    "Soy ilustrador digital y trabajo construyendo mundos y personajes con una mirada cinematográfica: luz contenida, paletas frías y composiciones que guían la mirada.",
    "Me inspira el cine, la fantasía y el diseño editorial. Busco que cada imagen cuente algo con pocos elementos y mucha atmósfera.",
    "Trabajo por encargo y en equipo: me adapto a tu proyecto, a tu estilo y a tus tiempos de entrega.",
  ],

  herramientas: [
    "Krita",
    "Clip Studio Paint",
    "Adobe Photoshop",
    "Adobe Illustrator",
    "Adobe Animate",
    "FireAlpaca",
    "Blender (apoyo 3D)",
  ],

  habilidades: [
    "Diseño de personajes y retrato",
    "Concept art y diseño de entornos",
    "Ilustración editorial",
    "Teoría del color y composición",
  ],

  // ⚠️ COMPLETAR: experiencia destacada (podés agregar o borrar bloques { … })
  experiencia: [
    { anio: "2025", titulo: "Cliente / Estudio / Proyecto", detalle: "Qué aportaste o lograste en este proyecto." },
    { anio: "2024", titulo: "Cliente / Estudio / Proyecto", detalle: "Breve descripción del encargo." },
  ],

  // ⚠️ COMPLETAR: estudios, cursos o talleres
  formacion: "Estudios, cursos o talleres relevantes.",
};
