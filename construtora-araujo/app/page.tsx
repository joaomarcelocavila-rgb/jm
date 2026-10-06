import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Numeros } from "@/components/Numeros";
import { Servicos } from "@/components/Servicos";
import { ComoTrabalhamos } from "@/components/ComoTrabalhamos";
import { Depoimentos } from "@/components/Depoimentos";
import { OndeAtendemos } from "@/components/OndeAtendemos";
import { Perguntas } from "@/components/Perguntas";
import { Contato } from "@/components/Contato";
import { WhatsAppFlutuante } from "@/components/WhatsAppFlutuante";

export default function Home() {
  return (
    <>
      <Header />
      <main id="conteudo">
        <Hero />
        <Numeros />
        <Servicos />
        <ComoTrabalhamos />
        <Depoimentos />
        <OndeAtendemos />
        <Perguntas />
      </main>
      <Contato />
      <WhatsAppFlutuante />
    </>
  );
}
