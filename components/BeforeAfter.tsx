"use client";

import { useState } from "react";
import type { Imagen } from "@/lib/obras";
import { lqipFondo, PictureFill } from "./Picture";

type Props = { antes: Imagen; despues: Imagen; altAntes: string; altDespues: string; etiquetaAntes: string; etiquetaDespues: string };

export default function BeforeAfter({ antes, despues, altAntes, altDespues, etiquetaAntes, etiquetaDespues }: Props) {
  const [pos, setPos] = useState(50);
  const sizes = "(min-width: 1024px) 60vw, 100vw";
  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-2xl border border-border bg-cover shadow-[0_30px_80px_-40px_rgb(59_130_246/0.45)]"
      style={{ ...lqipFondo(despues), aspectRatio: `${despues.ancho} / ${despues.alto}`, width: `min(100%, calc(80svh * ${despues.ancho / despues.alto}))` }}
    >
      <PictureFill img={antes} alt={altAntes} sizes={sizes} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <PictureFill img={despues} alt={altDespues} sizes={sizes} />
      </div>

      <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-bg/75 px-3 py-1 text-xs font-medium backdrop-blur">{etiquetaAntes}</span>
      <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-bg/75 px-3 py-1 text-xs font-medium backdrop-blur">{etiquetaDespues}</span>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-accent-soft shadow-[0_0_16px_2px_rgb(125_211_252/0.7)]" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-accent-soft bg-bg/85 text-accent-soft backdrop-blur">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
            <path d="M9 7l-5 5 5 5M15 7l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>

      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Comparar ${etiquetaAntes} y ${etiquetaDespues}`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
      />
    </div>
  );
}
