import type { Proceso as TProceso } from "@/lib/obras";
import BeforeAfter from "./BeforeAfter";
import { lqipFondo, PictureFill } from "./Picture";

export function Proceso({ procesos }: { procesos: TProceso[] }) {
  return (
    <section id="proceso" className="seccion border-y border-border/60 bg-surface/30">
      <div className="contenedor">
        <header className="revela mb-16 max-w-2xl">
          <p className="etiqueta mb-4">Proceso</p>
          <h2 className="titulo-seccion">Del boceto al resultado final</h2>
          <p className="mt-5 text-lg text-muted">Así trabajo: desde las primeras ideas hasta el acabado. Arrastrá el control para comparar.</p>
        </header>

        <div className="space-y-24 md:space-y-32">
          {procesos.map((p, idx) => {
            const primera = p.etapas[0];
            const ultima = p.etapas[p.etapas.length - 1];
            return (
              <article key={p.slug} aria-labelledby={`proc-${p.slug}`}>
                <div className="revela mb-8 flex items-baseline gap-4">
                  <span className="font-display text-5xl font-bold text-accent/40 tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                  <h3 id={`proc-${p.slug}`} className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                    {p.titulo}
                  </h3>
                </div>

                <div className="revela mx-auto max-w-4xl">
                  <BeforeAfter
                    antes={primera}
                    despues={ultima}
                    altAntes={`${p.titulo}: ${primera.label}`}
                    altDespues={`${p.titulo}: ${ultima.label}`}
                    etiquetaAntes={primera.label.split(" / ")[0]}
                    etiquetaDespues={ultima.label}
                  />
                </div>

                <ol className="scroll-fino -mx-4 mt-10 flex snap-x gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:grid-cols-[repeat(auto-fit,minmax(0,1fr))] md:overflow-visible md:px-0">
                  {p.etapas.map((e) => (
                    <li key={e.n} className="revela w-[72%] shrink-0 snap-start sm:w-[45%] md:w-auto">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-border bg-cover" style={lqipFondo(e)}>
                        <PictureFill img={e} alt={`${p.titulo}: ${e.label}`} sizes="(min-width: 768px) 25vw, 70vw" />
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <span className="grid h-7 w-7 place-items-center rounded-full border border-accent/50 text-xs font-semibold text-accent-soft">{e.n}</span>
                        <h4 className="font-display text-base font-bold">{e.label}</h4>
                      </div>
                      {e.nota && <p className="mt-2 text-sm leading-relaxed text-muted">{e.nota}</p>}
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
