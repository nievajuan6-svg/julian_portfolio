import { sitio } from "@/contenido/sitio";
import { asset, portfolio } from "@/lib/obras";
import { Contacto } from "@/components/Contacto";
import { Footer } from "@/components/Footer";
import { Galeria } from "@/components/Galeria";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Proceso } from "@/components/Proceso";
import { SobreMi } from "@/components/SobreMi";

export default function Home() {
  const { obras, categorias, proceso, hero, cv } = portfolio;
  const imagenHero = hero ?? null;

  const enlaces = [
    { id: "inicio", label: "Inicio" },
    { id: "galeria", label: "Galería" },
    ...(proceso.length ? [{ id: "proceso", label: "Proceso" }] : []),
    { id: "sobre-mi", label: "Sobre mí" },
    { id: "contacto", label: "Contacto" },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        name: sitio.nombre,
        jobTitle: "Ilustrador digital",
        url: sitio.url,
        email: sitio.email,
        sameAs: sitio.redes.filter((r) => r.url).map((r) => r.url),
      },
      ...obras.slice(0, 12).map((o) => ({
        "@type": "VisualArtwork",
        name: o.titulo,
        artform: "Ilustración digital",
        creator: { "@type": "Person", name: sitio.nombre },
        ...(o.anio ? { dateCreated: o.anio } : {}),
        image: `${sitio.url}${asset(`${o.dir}/${o.anchos[o.anchos.length - 1]}.webp`)}`,
      })),
    ],
  };

  return (
    <>
      <a href="#galeria" className="sr-only z-[70] rounded-full bg-accent px-4 py-2 font-semibold text-[#050a18] focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Saltar al contenido
      </a>
      <Header nombre={sitio.nombre} enlaces={enlaces} />
      <main>
        <Hero
          nombre={sitio.nombre}
          subtitulo={sitio.subtitulo}
          disponible={sitio.disponible}
          textoDisponible={sitio.textoDisponible}
          imagen={imagenHero}
        />

        <section id="galeria" className="seccion">
          <div className="contenedor">
            <header className="revela mb-12 max-w-2xl">
              <p className="etiqueta mb-4">Galería</p>
              <h2 className="titulo-seccion">Obras seleccionadas</h2>
            </header>
            <Galeria obras={obras} categorias={categorias} />
          </div>
        </section>

        {proceso.length > 0 && <Proceso procesos={proceso} />}
        <SobreMi cv={cv} />
        <Contacto />
      </main>
      <Footer enlaces={enlaces} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
