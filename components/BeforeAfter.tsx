"use client";

import { useState } from "react";
import type { Imagen } from "@/lib/obras";
import { lqipFondo, PictureFill } from "./Picture";

type Props = { antes: Imagen; despues: Imagen; altAntes: string; altDespues: string };

/** Comparador sin textos encima: solo las dos imágenes y el control. */
export default function BeforeAfter({ antes, despues, altAntes, altDespues }: Props) {
  const [pos, setPos] = useState(50);
  const sizes = "(min-width: 1024px) 60vw, 100vw";
  return (
    <div
      className="relative mx-auto select-none overflow-hidden rounded-xs border border-border bg-cover"
      style={{ ...lqipFondo(despues), aspectRatio: `${despues.ancho} / ${despues.alto}`, width: `min(100%, calc(80svh * ${despues.ancho / despues.alto}))` }}
    >
      <PictureFill img={antes} alt={altAntes} sizes={sizes} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 0 0 ${pos}%)` }}>
        <PictureFill img={despues} alt={altDespues} sizes={sizes} />
      </div>

      <div className="pointer-events-none absolute inset-y-0 w-px bg-accent-soft/90" style={{ left: `${pos}%` }}>
        <span className="absolute left-1/2 top-1/2 grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-xs border border-accent-soft/80 bg-bg/80 text-accent-soft backdrop-blur">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
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
        aria-label="Comparar boceto y resultado final"
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0 [touch-action:pan-y]"
      />
    </div>
  );
}
