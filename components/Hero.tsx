import type { Imagen } from "@/lib/obras";
import { lqipFondo, PictureFill } from "./Picture";

type Props = { nombre: string; subtitulo: string; disponible: boolean; textoDisponible: string; imagen: Imagen | null };

export function Hero({ nombre, subtitulo, disponible, textoDisponible, imagen }: Props) {
  const [nom, ...ape] = nombre.toUpperCase().split(" ");
  return (
    <section id="inicio" className="relative isolate flex min-h-[100svh] items-end overflow-hidden pb-16 pt-32 md:items-center md:pb-24">
      {/* Fondo */}
      <div className="absolute inset-0 -z-10 bg-bg">
        {imagen ? (
          <div className="hero-img absolute inset-0 origin-center bg-cover bg-center" style={lqipFondo(imagen)}>
            <PictureFill img={imagen} alt="" sizes="100vw" priority />
          </div>
        ) : (
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(60% 55% at 78% 30%, rgb(59 130 246 / .38), transparent 70%), radial-gradient(45% 45% at 15% 85%, rgb(125 211 252 / .18), transparent 70%), radial-gradient(70% 60% at 50% 110%, #111827, transparent 70%)",
            }}
          />
        )}
        {/* Degradados para que el texto se lea y el dibujo respire */}
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgb(10_12_16/0.88)_0%,rgb(17_24_39/0.55)_45%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_12_16/0.55)_0%,transparent_30%,transparent_55%,#0a0c10_100%)]" />
      </div>

      <div className="contenedor">
        {disponible && (
          <p className="entrada chip mb-8 border-accent/30" style={{ "--d": 0 } as React.CSSProperties}>
            <span className="punto-vivo h-2 w-2 rounded-full bg-green-400" aria-hidden />
            {textoDisponible}
          </p>
        )}

        <h1 className="font-display text-(length:--text-hero) font-bold leading-[0.88] tracking-[-0.045em]">
          <span className="entrada block" style={{ "--d": 1 } as React.CSSProperties}>
            {nom}
          </span>
          <span
            className="entrada block bg-gradient-to-r from-text via-accent-soft to-accent bg-clip-text text-transparent"
            style={{ "--d": 2 } as React.CSSProperties}
          >
            {ape.join(" ")}
          </span>
        </h1>

        <p className="entrada mt-8 max-w-xl text-lg leading-relaxed text-muted md:text-xl" style={{ "--d": 3 } as React.CSSProperties}>
          {subtitulo}
        </p>

        <div className="entrada mt-10 flex flex-wrap gap-3" style={{ "--d": 4 } as React.CSSProperties}>
          <a href="#galeria" className="btn btn-primario">
            Ver galería
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
              <path d="M12 5v14m0 0l-6-6m6 6l6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a href="#contacto" className="btn btn-fantasma">
            Contactarme
          </a>
        </div>
      </div>
    </section>
  );
}
