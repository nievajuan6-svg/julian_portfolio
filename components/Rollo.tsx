import { asset, type Imagen } from "@/lib/obras";

/** Carrusel tipo rollo fotográfico: fotos chicas, todas del mismo tamaño, que corren solas (CSS puro). */
export function Rollo({ fotos }: { fotos: Imagen[] }) {
  // Cada mitad del rollo tiene al menos 8 marcos; la segunda copia hace el bucle sin corte.
  const mitad = Array.from({ length: Math.max(8, fotos.length) }, (_, i) => fotos[i % fotos.length]);
  const duracion = `${mitad.length * 4}s`;
  return (
    <div className="rollo" aria-label="Fotos" role="group" style={{ ["--rollo-dur" as string]: duracion }}>
      <div className="rollo-pista">
        {[0, 1].map((copia) => (
          <ul key={copia} className="rollo-tira" aria-hidden={copia === 1 || undefined}>
            {mitad.map((f, i) => (
              <li key={i} className="rollo-marco">
                <picture>
                  <source type="image/avif" srcSet={f.anchos.map((w) => `${asset(`${f.dir}/${w}.avif`)} ${w}w`).join(", ")} sizes="112px" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={asset(`${f.dir}/${f.anchos[f.anchos.length - 1]}.webp`)}
                    alt=""
                    width={f.ancho}
                    height={f.alto}
                    loading="lazy"
                    decoding="async"
                    style={{ backgroundImage: `url(${f.lqip})` }}
                  />
                </picture>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
