import { sitio } from "@/contenido/sitio";

export function Footer({ enlaces }: { enlaces: { id: string; label: string }[] }) {
  return (
    <footer className="border-t border-border/60 py-10">
      <div className="contenedor flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Navegación rápida">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {enlaces.map((l) => (
              <li key={l.id}>
                <a href={`#${l.id}`} className="transition-colors hover:text-text">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {sitio.nombre}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
