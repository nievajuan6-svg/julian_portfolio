"use client";

import { useState } from "react";

type Estado = "reposo" | "enviando" | "ok" | "error";

export function CopiarEmail({ email }: { email: string }) {
  const [copiado, setCopiado] = useState(false);
  return (
    <button
      type="button"
      className="inline-block cursor-pointer py-2 underline underline-offset-4 hover:text-text"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setCopiado(true);
          setTimeout(() => setCopiado(false), 2000);
        } catch {
          /* sin permiso de portapapeles: quedan las otras opciones */
        }
      }}
    >
      {copiado ? "¡Email copiado!" : "Copiar email"}
      <span role="status" className="sr-only">
        {copiado ? "Email copiado al portapapeles" : ""}
      </span>
    </button>
  );
}

const campo =
  "w-full rounded-xs border border-border bg-surface/70 px-4 py-3.5 text-text placeholder:text-muted/70 transition-colors focus:border-accent focus:outline-none focus-visible:outline-none";

export function FormularioContacto({ formspreeId }: { formspreeId: string }) {
  const [estado, setEstado] = useState<Estado>("reposo");

  async function enviar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setEstado("enviando");
    try {
      const r = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });
      if (!r.ok) throw new Error();
      form.reset();
      setEstado("ok");
    } catch {
      setEstado("error");
    }
  }

  if (estado === "ok")
    return (
      <div role="status" className="rounded-xs border border-accent/40 bg-surface/70 p-8 text-center">
        <p className="font-display text-2xl font-bold">¡Mensaje enviado!</p>
        <p className="mt-2 text-muted">Gracias por escribir. Te respondo a la brevedad.</p>
      </div>
    );

  return (
    <form onSubmit={enviar} className="grid gap-4" aria-label="Formulario de contacto">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm text-muted">
          Nombre
          <input name="nombre" required autoComplete="name" className={campo} placeholder="Tu nombre" />
        </label>
        <label className="grid gap-2 text-sm text-muted">
          Email
          <input name="email" type="email" required autoComplete="email" className={campo} placeholder="tu@email.com" />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-muted">
        Mensaje
        <textarea name="mensaje" required rows={5} className={`${campo} resize-y`} placeholder="Contame sobre tu proyecto o vacante…" />
      </label>
      {/* Trampa antispam: los humanos no lo ven */}
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={estado === "enviando"} className="btn btn-primario disabled:opacity-60">
          {estado === "enviando" ? "Enviando…" : "Enviar mensaje"}
        </button>
        {estado === "error" && (
          <p role="alert" className="text-sm text-red-400">
            No se pudo enviar. Probá de nuevo o escribime por email.
          </p>
        )}
      </div>
    </form>
  );
}
