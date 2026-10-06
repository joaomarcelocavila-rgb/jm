import Image from "next/image";

type Props = {
  src: string | null;
  alt: string;
  /** largura / altura */
  proporcao: number;
  legenda?: string;
  sizes: string;
  className?: string;
  preload?: boolean;
};

/**
 * Foto real da obra. Enquanto o cliente não manda a foto (src = null),
 * mostra um placeholder cinza com a legenda "foto da obra" e marcas de corte.
 * Nunca use banco de imagem aqui.
 */
export function FotoObra({ src, alt, proporcao, legenda, sizes, className = "", preload }: Props) {
  return (
    <div
      className={`relative overflow-hidden rounded-obra bg-placeholder ${className}`}
      style={{ aspectRatio: String(proporcao) }}
    >
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} className="object-cover" preload={preload} />
      ) : (
        <div className="absolute inset-0" role="img" aria-label={`${alt}: foto da obra (em breve)`}>
          {/* marcas de corte nos cantos */}
          <span className="absolute left-3 top-3 h-3 w-3 border-l border-t border-tinta/30" />
          <span className="absolute right-3 top-3 h-3 w-3 border-r border-t border-tinta/30" />
          <span className="absolute bottom-3 left-3 h-3 w-3 border-b border-l border-tinta/30" />
          <span className="absolute bottom-3 right-3 h-3 w-3 border-b border-r border-tinta/30" />
          <span className="mono absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-tinta/70">
            foto da obra
          </span>
        </div>
      )}
      {legenda ? (
        <span className="mono absolute bottom-0 left-0 bg-papel px-2.5 py-1.5 text-tinta">{legenda}</span>
      ) : null}
    </div>
  );
}
