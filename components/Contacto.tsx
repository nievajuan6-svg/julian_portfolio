import { sitio } from "@/contenido/sitio";
import { portfolio } from "@/lib/obras";
import { CopiarEmail, FormularioContacto } from "./ContactoAcciones";
import { Rollo } from "./Rollo";

export function Contacto() {
  const redes = sitio.redes.filter((r) => r.url);
  const { fotos } = portfolio;
  // El botón principal abre Gmail web con el mensaje armado. Debajo, alternativas: la app de correo del dispositivo (mailto), Outlook, Yahoo o copiar.
  const asunto = encodeURIComponent("Consulta desde tu portfolio");
  const cuerpo = encodeURIComponent("Hola Julián,\n\nTe escribo por…\n");
  const para = encodeURIComponent(sitio.email);
  const mailto = `mailto:${sitio.email}?subject=${asunto}&body=${cuerpo}`;
  const whatsapp = `https://wa.me/${sitio.whatsapp}?text=${encodeURIComponent("Hola Julián, te escribo desde tu portfolio.")}`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=${para}&su=${asunto}&body=${cuerpo}`;
  const yahoo = `https://compose.mail.yahoo.com/?to=${para}&subject=${asunto}&body=${cuerpo}`;
  const outlook = `https://outlook.live.com/mail/0/deeplink/compose?to=${para}&subject=${asunto}&body=${cuerpo}`;
  return (
    <section id="contacto" className="seccion relative isolate overflow-hidden border-t border-border/60">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "radial-gradient(50% 60% at 50% 100%, rgb(59 130 246 / .22), transparent 70%)" }}
        aria-hidden
      />
      <div className="contenedor">
        <div className={fotos.length ? "grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16" : ""}>
        <div className="revela max-w-4xl">
          <h2 className="titulo-seccion">Contacto</h2>
          {sitio.disponible && (
            <p className="chip mt-6 border-accent/30">
              <span className="punto-vivo h-2 w-2 rounded-full bg-green-400" aria-hidden />
              {sitio.textoDisponible}
            </p>
          )}
          <a
            href={mailto}
            className="mt-8 block break-all font-display text-[clamp(1.25rem,1rem+1.8vw,2.25rem)] font-medium tracking-tight text-accent-soft underline decoration-accent/40 underline-offset-8 transition-colors hover:text-text hover:decoration-accent"
          >
            {sitio.email}
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={gmail} target="_blank" rel="noopener noreferrer" className="btn btn-primario">
              Enviar mail
            </a>
            {sitio.whatsapp && (
              <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">
                WhatsApp
              </a>
            )}
            {redes.map((r) => (
              <a key={r.nombre} href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-fantasma">
                {r.nombre}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
                  <path d="M7 17L17 7M9 7h8v8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            ))}
          </div>
          <div className="mt-5 text-sm text-muted">
            <p>¿Usás otro correo? Elegí cómo escribirme:</p>
            <ul className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1">
              <li>
                <a href={mailto} className="inline-block py-2 underline underline-offset-4 hover:text-text">
                  Mi app de correo
                </a>
              </li>
              <li>
                <a href={outlook} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline underline-offset-4 hover:text-text">
                  Outlook
                </a>
              </li>
              <li>
                <a href={yahoo} target="_blank" rel="noopener noreferrer" className="inline-block py-2 underline underline-offset-4 hover:text-text">
                  Yahoo
                </a>
              </li>
              <li>
                <CopiarEmail email={sitio.email} />
              </li>
            </ul>
          </div>
        </div>
        {fotos.length > 0 && (
          <div className="revela">
            <Rollo fotos={fotos} />
          </div>
        )}
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
