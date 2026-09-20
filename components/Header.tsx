"use client";

import { useEffect, useState } from "react";

type Enlace = { id: string; label: string };

export function Header({ nombre, enlaces }: { nombre: string; enlaces: Enlace[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [abierto, setAbierto] = useState(false);
  const [activa, setActiva] = useState("inicio");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => e.isIntersecting && setActiva(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    enlaces.forEach((l) => {
      const el = document.getElementById(l.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [enlaces]);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-abierto", abierto);
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("menu-abierto");
    };
  }, [abierto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || abierto ? "border-b border-border/70 bg-bg/75 backdrop-blur-xl" : "border-b border-transparent"
      }`}
    >
      <div className="contenedor flex h-14 items-center justify-between">
        <a href="#inicio" className="font-display text-sm font-medium tracking-wide" onClick={() => setAbierto(false)}>
          {nombre}
        </a>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {enlaces.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  aria-current={activa === l.id ? "true" : undefined}
                  className={`relative px-3 py-2 text-[13px] transition-colors hover:text-text ${
                    activa === l.id ? "text-text" : "text-muted"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute inset-x-3 -bottom-px h-px bg-accent-soft transition-opacity duration-300 ${
                      activa === l.id ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-xs border border-border md:hidden"
          aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={abierto}
          aria-controls="menu-movil"
          onClick={() => setAbierto((v) => !v)}
        >
          <span className="relative block h-3 w-5">
            <span className={`absolute inset-x-0 h-0.5 rounded bg-text transition-all duration-300 ${abierto ? "top-1 rotate-45" : "top-0"}`} />
            <span className={`absolute inset-x-0 h-0.5 rounded bg-text transition-all duration-300 ${abierto ? "top-1 -rotate-45" : "top-[10px]"}`} />
          </span>
        </button>
      </div>

      <div
        id="menu-movil"
        className={`fixed inset-x-0 top-14 h-[calc(100dvh-3.5rem)] bg-bg/95 backdrop-blur-2xl transition-opacity duration-300 md:hidden ${
          abierto ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!abierto}
        inert={!abierto}
      >
        <ul className="contenedor flex h-full flex-col justify-center gap-2 pb-16">
          {enlaces.map((l, i) => (
            <li key={l.id} style={{ transitionDelay: abierto ? `${i * 50}ms` : "0ms" }} className={`transition-all duration-500 ${abierto ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
              <a href={`#${l.id}`} onClick={() => setAbierto(false)} className="block border-b border-border/60 py-4 font-display text-3xl font-medium tracking-tight">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
