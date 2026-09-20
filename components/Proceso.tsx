import type { Proceso as TProceso } from "@/lib/obras";
import BeforeAfter from "./BeforeAfter";
import { lqipFondo, PictureFill } from "./Picture";

export function Proceso({ procesos }: { procesos: TProceso[] }) {
  return (
    <section id="proceso" className="seccion border-y border-border/60">
      <div className="contenedor">
        <header className="revela mb-12 flex flex-wrap items-baseline gap-x-5 gap-y-1">
          <h2 className="titulo-seccion">Proceso</h2>
          <p className="text-sm text-muted">Arrastrá el control para comparar.</p>
        </header>

        <div className="space-y-20 md:space-y-28">
          {procesos.map((p) => {
            const primera = p.etapas[0];
            const ultima = p.etapas[p.etapas.length - 1];
            return (
              <article key={p.slug} aria-labelledby={`proc-${p.slug}`}>
                <h3 id={`proc-${p.slug}`} className="revela mb-5 font-display text-base font-medium tracking-wide">
                  {p.titulo}
                </h3>

                <div className="revela">
                  <BeforeAfter
                    antes={primera}
                    despues={ultima}
                    altAntes={`${p.titulo}: ${primera.label}`}
                    altDespues={`${p.titulo}: ${ultima.label}`}
                  />
                </div>

                <ol className="mx-auto mt-2 grid gap-2" style={{ gridTemplateColumns: `repeat(${Math.min(p.etapas.length, 4)}, minmax(0, 1fr))`, maxWidth: "min(100%, 56rem)" }}>
                  {p.etapas.map((e) => (
                    <li key={e.n} className="revela relative overflow-hidden rounded-xs border border-border bg-cover" style={{ ...lqipFondo(e), aspectRatio: `${e.ancho} / ${e.alto}` }}>
                      <PictureFill img={e} alt={`${p.titulo}: ${e.label}`} sizes="(min-width: 768px) 14vw, 25vw" />
                    </li>
                  ))}
                </ol>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
