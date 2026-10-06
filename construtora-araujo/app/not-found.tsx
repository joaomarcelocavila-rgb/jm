import Link from "next/link";
import { Header } from "@/components/Header";

export default function NaoEncontrada() {
  return (
    <>
      <Header />
      <main id="conteudo" className="flex min-h-[100svh] items-center bg-papel">
        <div className="moldura py-32">
          <p className="mono text-marca">Erro 404</p>
          <h1 className="mt-6 max-w-[14ch] text-[clamp(44px,7vw,104px)]">Essa página não saiu do papel.</h1>
          <Link href="/" className="botao botao-laranja mt-10">
            Voltar para o início
          </Link>
        </div>
      </main>
    </>
  );
}
