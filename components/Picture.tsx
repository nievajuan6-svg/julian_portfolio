import { asset, type Imagen } from "@/lib/obras";

type Base = { img: Imagen; alt: string; sizes: string; priority?: boolean; eager?: boolean; className?: string };

const srcSet = (img: Imagen, formato: "avif" | "webp") =>
  img.anchos.map((w) => `${asset(`${img.dir}/${w}.${formato}`)} ${w}w`).join(", ");

/** Fondo borroso (LQIP) que se ve mientras carga la imagen real. */
export const lqipFondo = (img: Imagen) => ({ backgroundImage: `url(${img.lqip})` });

function Fuentes({ img, sizes }: { img: Imagen; sizes: string }) {
  return (
    <>
      <source type="image/avif" srcSet={srcSet(img, "avif")} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(img, "webp")} sizes={sizes} />
    </>
  );
}
const fallback = (img: Imagen) => asset(`${img.dir}/${img.anchos.find((w) => w >= 960) ?? img.anchos[img.anchos.length - 1]}.webp`);

/** Imagen a su proporción real (sin saltos de layout), con blur-up. */
export function Picture({ img, alt, sizes, priority, eager, className = "" }: Base) {
  return (
    <span className={`block bg-cover bg-center ${className}`} style={{ ...lqipFondo(img), aspectRatio: `${img.ancho} / ${img.alto}` }}>
      <picture>
        <Fuentes img={img} sizes={sizes} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={fallback(img)}
          alt={alt}
          width={img.ancho}
          height={img.alto}
          loading={priority || eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={priority ? "high" : undefined}
          className="block h-auto w-full"
        />
      </picture>
    </span>
  );
}

/** Imagen que rellena a su contenedor (hero, tiras, comparador). El padre debe ser `relative`. */
export function PictureFill({ img, alt, sizes, priority, eager, className = "" }: Base) {
  return (
    <picture>
      <Fuentes img={img} sizes={sizes} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={fallback(img)}
        alt={alt}
        width={img.ancho}
        height={img.alto}
        loading={priority || eager ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : undefined}
        className={`absolute inset-0 h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
