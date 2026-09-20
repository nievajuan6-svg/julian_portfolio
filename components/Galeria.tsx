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
        <div role="group" aria-label="Filtrar por categoría" className="-mx-4 mb-10 flex gap-2 overflow-x-auto px-4 pb-2 md:mx-0 md:flex-wrap md:overflow-visible md:px-0 scroll-fino">
          {filtros.map((f) => (
            <button
              key={f.slug}
              type="button"
              aria-pressed={cat === f.slug}
              onClick={() => elegirCategoria(f.slug)}
              className={`shrink-0 cursor-pointer rounded-full border px-5 py-2.5 text-sm font-medium transition-all duration-200 active:scale-95 ${
                cat === f.slug
                  ? "border-accent bg-accent text-[#050a18] shadow-[0_0_28px_-4px_rgb(59_130_246/0.6)]"
                  : "border-border bg-surface/60 text-muted hover:border-accent/60 hover:text-text"
              }`}
            >
              {f.label}
              <span className={`ml-2 text-xs ${cat === f.slug ? "opacity-70" : "opacity-50"}`}>{f.count}</span>
            </button>
          ))}
        </div>
      )}

      {obras.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted">
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
