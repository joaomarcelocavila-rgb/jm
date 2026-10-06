import { mostrarPendencias } from "@/lib/site";

/** Etiqueta visível de dado pendente. Some quando mostrarPendencias = false. */
export function Pendente({ texto = "[CONFIRMAR]", className = "" }: { texto?: string; className?: string }) {
  if (!mostrarPendencias) return null;
  return (
    <span className={`pendente ${className}`} title="Dado a confirmar com o cliente">
      {texto}
    </span>
  );
}
