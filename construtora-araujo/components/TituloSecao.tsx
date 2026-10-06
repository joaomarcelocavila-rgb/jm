/** Numeração de prancha técnica: "01 — O QUE FAZEMOS" */
export function RotuloSecao({ numero, texto, className = "" }: { numero: string; texto: string; className?: string }) {
  return (
    <p className={`mono flex items-center gap-3 ${className}`}>
      <span>{numero}</span>
      <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-50" />
      <span>{texto}</span>
    </p>
  );
}
