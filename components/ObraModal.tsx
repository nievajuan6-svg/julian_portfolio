"use client";

import { useEffect, useRef } from "react";
import { asset, type Obra } from "@/lib/obras";

type Props = { lista: Obra[]; slug: string; onCambiar: (slug: string) => void; onCerrar: () => void };

const Flecha = ({ dir }: { dir: "izq" | "der" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
    <path d={dir === "izq" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ObraModal({ lista, slug, onCambiar, onCerrar }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const toqueX = useRef<number | null>(null);
  const i = Math.max(0, lista.findIndex((o) => o.slug === slug));
  const obra = lista[i];

  const cerrarRef = useRef(onCerrar);
  cerrarRef.current = onCerrar;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    // Evento nativo: cubre Esc, botón Cerrar y clic fuera de la imagen.
    const alCerrar = () => cerrarRef.current();
    d.addEventListener("close", alCerrar);
    return () => d.removeEventListener("close", alCerrar);
  }, []);

  // Precarga la anterior y la siguiente: pasar de obra se siente instantáneo.
  useEffect(() => {
    [lista[i - 1], lista[i + 1]].forEach((o) => {
      if (!o) return;
      const w = o.anchos.find((a) => a >= 1440) ?? o.anchos[o.anchos.length - 1];
      new Image().src = asset(`${o.dir}/${w}.avif`);
    });
  }, [i, lista]);

  if (!obra) return null;
  const ir = (d: number) => onCambiar(lista[(i + d + lista.length) % lista.length].slug);
  const set = (f: string) => obra.anchos.map((w) => `${asset(`${obra.dir}/${w}.${f}`)} ${w}w`).join(", ");
  const fallback = asset(`${obra.dir}/${obra.anchos[obra.anchos.length - 1]}.webp`);
  const datos = [obra.categoriaLabel, obra.software, obra.anio, obra.cliente && `Cliente: ${obra.cliente}`].filter(Boolean) as string[];

  return (
    <dialog
      ref={ref}
      aria-label={obra.titulo}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") ir(-1);
        if (e.key === "ArrowRight") ir(1);
      }}
      onTouchStart={(e) => (toqueX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (toqueX.current == null) return;
        const dx = e.changedTouches[0].clientX - toqueX.current;
        toqueX.current = null;
        if (Math.abs(dx) > 60) ir(dx < 0 ? 1 : -1);
      }}
      className="m-0 h-dvh max-h-none w-screen max-w-none flex-col bg-[rgb(6_8_12/0.97)] p-0 text-text backdrop-blur-xl open:flex backdrop:bg-black/80"
    >
      <div className="flex items-center justify-between px-4 py-3 md:px-8">
        <span className="text-sm tabular-nums text-muted">
          {String(i + 1).padStart(2, "0")} / {String(lista.length).padStart(2, "0")}
        </span>
        <button
          type="button"
          autoFocus
          onClick={() => ref.current?.close()}
          aria-label="Cerrar"
          className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-border bg-surface/70 transition hover:border-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div
        className="relative grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] px-4 md:px-20"
        onClick={(e) => e.target === e.currentTarget && ref.current?.close()}
      >
        <picture key={obra.slug}>
          <source type="image/avif" srcSet={set("avif")} sizes="100vw" />
          <source type="image/webp" srcSet={set("webp")} sizes="100vw" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fallback}
            alt={obra.titulo}
            width={obra.ancho}
            height={obra.alto}
            decoding="async"
            style={{ backgroundImage: `url(${obra.lqip})`, backgroundSize: "contain", backgroundRepeat: "no-repeat", backgroundPosition: "center" }}
            className="aparece h-full w-full object-contain"
          />
        </picture>

        {lista.length > 1 && (
          <>
            <button type="button" onClick={() => ir(-1)} aria-label="Obra anterior" className="absolute left-2 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-bg/70 backdrop-blur transition hover:border-accent md:left-6">
              <Flecha dir="izq" />
            </button>
            <button type="button" onClick={() => ir(1)} aria-label="Obra siguiente" className="absolute right-2 top-1/2 grid h-12 w-12 -translate-y-1/2 cursor-pointer place-items-center rounded-full border border-border bg-bg/70 backdrop-blur transition hover:border-accent md:right-6">
              <Flecha dir="der" />
            </button>
          </>
        )}
      </div>

      <div className="px-4 pb-5 pt-4 md:px-8 md:pb-7">
        <h3 className="font-display text-2xl font-bold tracking-tight md:text-3xl">{obra.titulo}</h3>
        <ul className="mt-3 flex flex-wrap gap-2">
          {datos.map((d, k) => (
            <li key={k} className={`chip ${k === 0 ? "border-accent/40 text-accent-soft" : ""}`}>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </dialog>
  );
}
