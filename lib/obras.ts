import data from "@/data/portfolio.generated.json";

export type Imagen = { dir: string; ancho: number; alto: number; lqip: string; anchos: number[] };
export type Obra = Imagen & {
  slug: string;
  titulo: string;
  software: string;
  anio: string;
  cliente: string;
  orden: number | null;
  categoria: string;
  categoriaLabel: string;
  ejemplo: boolean;
};
export type Etapa = Imagen & { n: number; label: string; nota: string };
export type Proceso = { slug: string; titulo: string; ejemplo: boolean; etapas: Etapa[] };
export type Categoria = { slug: string; label: string; count: number };
export type Portfolio = {
  hero: Imagen | null;
  obras: Obra[];
  categorias: Categoria[];
  proceso: Proceso[];
  cv: boolean;
};

/** Datos generados por `npm run obras` (scripts/build-obras.mjs). No editar a mano. */
export const portfolio = data as unknown as Portfolio;

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
/** Ruta pública de un archivo de /public respetando el basePath de GitHub Pages. */
export const asset = (ruta: string) => `${BASE_PATH}/${ruta}`;
