import type { Obra } from "@/lib/obras";
import { Picture } from "./Picture";

const SIZES = "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw";

export function ObraCard({ obra, eager, onAbrir }: { obra: Obra; eager?: boolean; onAbrir: () => void }) {
  const meta = [obra.software, obra.anio].filter(Boolean).join(" · ");
  return (
    <button
      type="button"
      onClick={onAbrir}
      aria-label={`Ver "${obra.titulo}" en grande`}
      className="tarjeta group relative block w-full cursor-zoom-in overflow-hidden rounded-xs border border-border bg-surface text-left"
    >
      <Picture img={obra} alt={`${obra.titulo}${obra.software ? `, ilustración digital en ${obra.software}` : ""}`} sizes={SIZES} eager={eager} />
      <span
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-bg/95 via-bg/70 to-transparent px-3 pb-3 pt-10 opacity-100 md:px-4 md:pb-4 md:pt-16 transition-opacity duration-300 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover:opacity-100 group-focus-visible:opacity-100"
      >
        <span className="font-display text-base font-bold leading-tight md:text-lg">{obra.titulo}</span>
        <span className="text-xs text-accent-soft md:text-sm">{obra.categoriaLabel}</span>
        {meta && <span className="hidden text-xs text-muted md:block">{meta}</span>}
      </span>
    </button>
  );
}
