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
 * mostra um bloco cinza liso no lugar.
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
        // [PEDIR AO CLIENTE] sem foto ainda: só o bloco cinza
        <div className="absolute inset-0" role="img" aria-label={alt} />
      )}
      {legenda ? (
        <span className="mono absolute bottom-0 left-0 bg-papel px-2.5 py-1.5 text-tinta">{legenda}</span>
      ) : null}
    </div>
  );
}
