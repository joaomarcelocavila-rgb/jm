/**
 * [PEDIR AO CLIENTE] Logo oficial em SVG (/public/brand/logo-araujo.svg).
 * Este é um logo provisório, montado com o símbolo do "A" e o nome em Saira,
 * nas cores da marca. Quando o arquivo oficial chegar, troque o conteúdo de
 * <Logo> por <img src="/brand/logo-araujo.svg" ...> (e a versão branca no rodapé).
 */

type Props = {
  /** "cor" = azul e ciano da marca; "branco" = tudo branco, para fundo azul */
  variante?: "cor" | "branco";
  /** Esconde o nome e deixa só o símbolo (header depois de rolar) */
  soSimbolo?: boolean;
  className?: string;
};

export function SimboloA({ variante = "cor", className = "" }: { variante?: "cor" | "branco"; className?: string }) {
  const azul = variante === "branco" ? "#fff" : "#0960B8";
  const ciano = variante === "branco" ? "#fff" : "#19C0DA";
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className={className}>
      <path d="M4 37 L17.5 3 H22.5 L13 37 Z" fill={azul} />
      <path d="M22.5 3 L36 37 H27.5 L19.6 12.2 Z" fill={ciano} />
      <path d="M12.2 26 H27 L28.6 31 H10.8 Z" fill={azul} />
    </svg>
  );
}

export function Logo({ variante = "cor", soSimbolo = false, className = "" }: Props) {
  const branco = variante === "branco";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <SimboloA variante={variante} className="h-9 w-9 shrink-0" />
      <span
        className={`flex flex-col gap-[3px] leading-none transition-[opacity,transform] duration-300 ${
          soSimbolo ? "pointer-events-none -translate-x-2 opacity-0" : "opacity-100"
        }`}
      >
        <span
          className="font-titulo text-[13px] font-medium tracking-[0.01em]"
          style={{ color: branco ? "#fff" : "#19C0DA" }}
        >
          Construtora
        </span>
        <span
          className="font-titulo text-[22px] font-semibold tracking-[-0.01em]"
          style={{ color: branco ? "#fff" : "#0960B8" }}
        >
          ARAÚJO
        </span>
      </span>
    </span>
  );
}
