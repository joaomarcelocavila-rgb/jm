"use client";

import { useEffect, useState } from "react";
import { IconeWhatsApp } from "./IconeWhatsApp";
import { whatsappUrl } from "@/lib/site";

/**
 * Celular: barra fixa embaixo. Desktop: botão redondo no canto.
 * Aparece depois do hero e some quando o contato/rodapé entra na tela.
 */
export function WhatsAppFlutuante() {
  const [passouHero, setPassouHero] = useState(false);
  const [rodape, setRodape] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("topo");
    const contato = document.getElementById("contato");
    const obs: IntersectionObserver[] = [];

    if (hero) {
      // passou do hero quando o fim dele sai pelo topo
      const o = new IntersectionObserver(([e]) => setPassouHero(!e.isIntersecting && e.boundingClientRect.top < 0), {
        rootMargin: "0px 0px -100% 0px",
      });
      o.observe(hero);
      obs.push(o);
    } else {
      setPassouHero(true); // páginas internas não têm hero
    }
    if (contato) {
      const o = new IntersectionObserver(([e]) => setRodape(e.isIntersecting));
      o.observe(contato);
      obs.push(o);
    }
    return () => obs.forEach((o) => o.disconnect());
  }, []);

  const visivel = passouHero && !rodape;

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-40 border-t border-tinta/10 bg-papel px-5 pb-[max(12px,env(safe-area-inset-bottom))] pt-3 transition-transform duration-300 md:hidden ${
          visivel ? "translate-y-0" : "translate-y-full"
        }`}
        aria-hidden={!visivel}
      >
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener"
          tabIndex={visivel ? 0 : -1}
          className="botao botao-laranja w-full min-h-[52px]"
        >
          <IconeWhatsApp />
          Orçamento no WhatsApp
        </a>
      </div>

      <a
        href={whatsappUrl()}
        target="_blank"
        rel="noopener"
        aria-label="Orçamento no WhatsApp"
        tabIndex={visivel ? 0 : -1}
        aria-hidden={!visivel}
        className={`fixed bottom-6 right-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-laranja text-white transition-[opacity,transform,background-color] duration-300 hover:bg-[#e84a12] md:flex ${
          visivel ? "opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
      >
        <IconeWhatsApp className="h-6 w-6" />
      </a>
    </>
  );
}
