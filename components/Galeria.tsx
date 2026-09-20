"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Categoria, Obra } from "@/lib/obras";
import { ObraCard } from "./ObraCard";

// El modal se descarga solo cuando se abre la primera obra.
const ObraModal = dynamic(() => import("./ObraModal"), { ssr: false });

export function Galeria({ obras, categorias }: { obras: Obra[]; categorias: Categoria[] }) {
  const [cat, setCat] = useState("todo");
  const [abierta, setAbierta] = useState<string | null>(null);

  // Leer filtro y obra desde la URL (?cat=… y #obra/…) para poder compartir enlaces.
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("cat");
    if (p && categorias.some((c) => c.slug === p)) setCat(p);
    const m = window.location.hash.match(/^#obra\/(.+)$/);
    if (m && obras.some((o) => o.slug === decodeURIComponent(m[1]))) setAbierta(decodeURIComponent(m[1]));
  }, [categorias, obras]);

  const elegirCategoria = useCallback((slug: string) => {
    setCat(slug);
    const url = new URL(window.location.href);
    if (slug === "todo") url.searchParams.delete("cat");
    else url.searchParams.set("cat", slug);
    url.hash = "";
    window.history.replaceState(null, "", url);
  }, []);

  const abrir = useCallback((slug: string) => {
    setAbierta(slug);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}#obra/${slug}`);
  }, []);

  const cerrar = useCallback(() => {
    setAbierta(null);
    window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  }, []);

  const visibles = useMemo(() => (cat === "todo" ? obras : obras.filter((o) => o.categoria === cat)), [cat, obras]);
  const lista = abierta && visibles.some((o) => o.slug === abierta) ? visibles : obras;
  const filtros = [{ slug: "todo", label: "Todo", count: obras.length }, ...categorias];

  return (
    <>
      {categorias.length > 1 && (
        <div role="group" aria-label="Filtrar por categoría" className="mb-6 flex flex-wrap gap-x-5 gap-y-0 md:mb-8 md:gap-x-6 md:gap-y-2">
          {filtros.map((f) => (
            <button
              key={f.slug}
              type="button"
              aria-pressed={cat === f.slug}
              onClick={() => elegirCategoria(f.slug)}
              className={`cursor-pointer border-b py-2.5 text-xs md:py-1 uppercase tracking-[0.14em] transition-colors duration-200 ${
                cat === f.slug ? "border-accent-soft text-text" : "border-transparent text-muted hover:text-text"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {obras.length === 0 ? (
        <p className="rounded-xs border border-dashed border-border p-10 text-center text-muted">
          Todavía no hay obras. Arrastrá imágenes a <code className="text-accent-soft">contenido/obras/</code> y corré <code className="text-accent-soft">npm run obras</code>.
        </p>
      ) : (
        <ul key={cat} className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {visibles.map((o, i) => (
            <li key={o.slug} className="aparece mb-4 break-inside-avoid" style={{ "--d": Math.min(i, 12) } as React.CSSProperties}>
              <ObraCard obra={o} eager={i < 3} onAbrir={() => abrir(o.slug)} />
            </li>
          ))}
        </ul>
      )}

      {abierta && <ObraModal lista={lista} slug={abierta} onCambiar={abrir} onCerrar={cerrar} />}
    </>
  );
}
