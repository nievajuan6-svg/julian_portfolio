import { sitio } from "@/contenido/sitio";
import { CopiarEmail, FormularioContacto } from "./ContactoAcciones";

export function Contacto() {
  const redes = sitio.redes.filter((r) => r.url);
  return (
    <section id="contacto" className="seccion relative isolate overflow-hidden border-t border-border/60">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 60% at 50% 100%, rgb(59 130 246 / .22), transparent 70%)" }}
        aria-hidden
      />
      <div className="contenedor">
        <div className="revela max-w-4xl">
          {sitio.disponible && (
            <p className="chip mb-8 border-accent/30">
              <span className="punto-vivo h-2 w-2 rounded-full bg-green-400" aria-hidden />
              {sitio.textoDisponible}
            </p>
          )}
          <h2 className="titulo-seccion">¿Hablamos sobre tu próximo proyecto o vacante?</h2>
          <a
            href={`mailto:${sitio.email}?subject=${encodeURIComponent("Consulta desde tu portfolio")}`}
            className="mt-10 block break-all font-display text-[clamp(1.5rem,1rem+3vw,3.25rem)] font-bold tracking-tight text-accent-soft underline decoration-accent/40 decoration-2 underline-offset-8 transition-colors hover:text-text hover:decoration-accent"
          >
            {sitio.email}
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <CopiarEmail email={sitio.email} />
            {redes.map((r) => (
              <a key={r.nombre} href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">
                {r.nombre}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {sitio.formspreeId && (
          <div className="revela mt-16 max-w-2xl">
            <FormularioContacto formspreeId={sitio.formspreeId} />
          </div>
        )}
      </div>
    </section>
  );
}
