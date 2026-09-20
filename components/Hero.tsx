import type { Imagen } from "@/lib/obras";
import { lqipFondo, PictureFill } from "./Picture";

type Props = { nombre: string; subtitulo: string; imagen: Imagen | null };

/** Portada minimalista: solo la ilustración. El nombre vive en la barra superior. */
export function Hero({ nombre, subtitulo, imagen }: Props) {
  return (
    <section id="inicio" className="relative isolate min-h-[72svh] md:min-h-[100svh] overflow-hidden">
      <h1 className="sr-only">
        {nombre} — {subtitulo}
      </h1>
      <div className="absolute inset-0 -z-10 bg-bg">
        {imagen ? (
          <div className="hero-img absolute inset-0 origin-center bg-cover bg-center" style={lqipFondo(imagen)}>
            <PictureFill img={imagen} alt="" sizes="100vw" priority className="object-[24%_center] md:object-center" />
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
        {/* Velo suave arriba (para leer la barra) y abajo (fundido hacia la galería) */}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(10_12_16/0.6)_0%,transparent_22%,transparent_70%,#0a0c10_100%)]" />
      </div>
    </section>
  );
}
