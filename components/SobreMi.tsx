import { sitio } from "@/contenido/sitio";
import { asset } from "@/lib/obras";

export function SobreMi({ cv }: { cv: boolean }) {
  return (
    <section id="sobre-mi" className="seccion">
      <div className="contenedor grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 className="titulo-seccion revela">Sobre mí</h2>
          <div className="revela mt-8 space-y-4 leading-relaxed text-muted">
            {sitio.sobreMi.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          {cv && (
            <a href={asset("cv/julian-piaggio-cv.pdf")} download className="btn btn-primario mt-10">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                <path d="M12 4v11m0 0l-5-5m5 5l5-5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Descargar CV en PDF
            </a>
          )}
        </div>

        <div className="space-y-14">
          <div className="revela">
            <h3 className="etiqueta mb-5">Herramientas y software</h3>
            <ul className="flex flex-wrap gap-2.5">
              {sitio.herramientas.map((h) => (
                <li key={h} className="chip">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="revela">
            <h3 className="etiqueta mb-5">Habilidades</h3>
            <ul className="grid gap-px overflow-hidden rounded-xs border border-border bg-border sm:grid-cols-2">
              {sitio.habilidades.map((h) => (
                <li key={h} className="bg-surface px-5 py-5 font-display text-base font-medium leading-snug">
                  {h}
                </li>
              ))}
            </ul>
          </div>

          <div className="revela">
            <h3 className="etiqueta mb-6">Experiencia destacada</h3>
            <ol className="relative space-y-8 border-l border-border pl-8">
              {sitio.experiencia.map((e, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[2.25rem] top-2 h-2 w-2 bg-accent" aria-hidden />
                  <p className="text-sm tabular-nums text-accent-soft">{e.anio}</p>
                  <p className="mt-1 font-display text-xl font-bold">{e.titulo}</p>
                  <p className="mt-1 text-muted">{e.detalle}</p>
                </li>
              ))}
            </ol>
          </div>

          <div className="revela">
            <h3 className="etiqueta mb-4">Formación</h3>
            <p className="text-lg text-muted">{sitio.formacion}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
