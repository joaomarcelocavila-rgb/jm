/**
 * Cota de planta técnica: linha fina com traços nas pontas e um rótulo.
 * Textura, não informação: sempre aria-hidden e em #0960B8 a 30%.
 */
export function Cota({
  orientacao = "h",
  rotulo,
  className = "",
}: {
  orientacao?: "h" | "v";
  rotulo?: string;
  className?: string;
}) {
  const cor = "rgb(9 96 184 / 0.3)";
  if (orientacao === "v") {
    return (
      <div aria-hidden="true" className={`pointer-events-none flex flex-col items-center ${className}`}>
        <span className="h-px w-3" style={{ background: cor }} />
        <span className="w-px flex-1" style={{ background: cor }} />
        {rotulo ? (
          <span className="mono my-2 [writing-mode:vertical-rl]" style={{ color: cor }}>
            {rotulo}
          </span>
        ) : null}
        <span className="w-px flex-1" style={{ background: cor }} />
        <span className="h-px w-3" style={{ background: cor }} />
      </div>
    );
  }
  return (
    <div aria-hidden="true" className={`pointer-events-none flex items-center ${className}`}>
      <span className="h-3 w-px" style={{ background: cor }} />
      <span className="h-px flex-1" style={{ background: cor }} />
      {rotulo ? (
        <span className="mono mx-2" style={{ color: cor }}>
          {rotulo}
        </span>
      ) : null}
      <span className="h-px flex-1" style={{ background: cor }} />
      <span className="h-3 w-px" style={{ background: cor }} />
    </div>
  );
}
