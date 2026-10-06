"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "./Logo";
import { IconeWhatsApp } from "./IconeWhatsApp";
import { nav, site, whatsappUrl } from "@/lib/site";
import { travarRolagem } from "@/lib/rolagem";

export function Header() {
  const [rolou, setRolou] = useState(false);
  const [aberto, setAberto] = useState(false);
  const botaoMenu = useRef<HTMLButtonElement>(null);
  const primeiroLink = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    let raf = 0;
    // Na home, o header fica transparente enquanto o vídeo do hero está na fase bege
    // e ganha fundo antes da tela azul. Nas outras páginas, logo depois de rolar.
    const medir = () => {
      raf = 0;
      const hero = document.getElementById("topo");
      const limite = hero ? (hero.offsetHeight - window.innerHeight) * 0.7 : 24;
      setRolou(window.scrollY > Math.max(24, limite));
    };
    const aoRolar = () => {
      if (!raf) raf = requestAnimationFrame(medir);
    };
    medir();
    window.addEventListener("scroll", aoRolar, { passive: true });
    window.addEventListener("resize", aoRolar);
    return () => {
      window.removeEventListener("scroll", aoRolar);
      window.removeEventListener("resize", aoRolar);
      cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => {
    if (!aberto) return;
    travarRolagem(true);
    primeiroLink.current?.focus();
    const tecla = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAberto(false);
    };
    const fecharSeGrande = () => {
      if (window.innerWidth >= 1024) setAberto(false);
    };
    window.addEventListener("keydown", tecla);
    window.addEventListener("resize", fecharSeGrande);
    return () => {
      travarRolagem(false);
      window.removeEventListener("keydown", tecla);
      window.removeEventListener("resize", fecharSeGrande);
      botaoMenu.current?.focus();
    };
  }, [aberto]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color] duration-300 ${
        rolou ? "border-b border-linha bg-papel" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="moldura flex h-16 items-center justify-between lg:h-[72px]">
        <Link href="/" className="-ml-1 flex min-h-11 items-center p-1">
          <Logo soSimbolo={rolou} />
        </Link>

        <nav aria-label="Principal" className="hidden items-center gap-8 lg:flex">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="risco text-[16px] text-tinta">
              {item.label}
            </Link>
          ))}
          <a href={whatsappUrl()} target="_blank" rel="noopener" className="botao botao-laranja min-h-11 text-[16px]">
            Orçamento no WhatsApp
          </a>
        </nav>

        <button
          ref={botaoMenu}
          type="button"
          className="-mr-2.5 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={aberto}
          aria-controls="menu-celular"
          aria-label="Abrir menu"
          onClick={() => setAberto(true)}
        >
          <span className="flex w-7 flex-col gap-[7px]" aria-hidden="true">
            <span className="h-[2px] w-full bg-tinta" />
            <span className="h-[2px] w-[70%] self-end bg-tinta" />
          </span>
        </button>
      </div>

      {/* Menu em tela cheia, celular e tablet */}
      <div
        id="menu-celular"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        hidden={!aberto}
        className="fixed inset-0 z-[60] flex h-[100dvh] flex-col bg-azul text-white lg:hidden"
      >
        <div className="moldura flex h-16 items-center justify-between">
          <Logo variante="branco" />
          <button
            type="button"
            className="-mr-2.5 flex h-11 w-11 items-center justify-center"
            aria-label="Fechar menu"
            onClick={() => setAberto(false)}
          >
            <span className="relative block h-6 w-6" aria-hidden="true">
              <span className="absolute left-0 top-1/2 h-[2px] w-full rotate-45 bg-white" />
              <span className="absolute left-0 top-1/2 h-[2px] w-full -rotate-45 bg-white" />
            </span>
          </button>
        </div>

        <nav aria-label="Menu do celular" className="moldura flex flex-1 flex-col justify-center overflow-y-auto">
          <ol className="flex flex-col">
            {nav.map((item, i) => (
              <li key={item.href} className="border-t border-white/20 last:border-b">
                <Link
                  ref={i === 0 ? primeiroLink : undefined}
                  href={item.href}
                  onClick={() => setAberto(false)}
                  className="flex items-baseline gap-4 py-4"
                >
                  <span className="mono w-6 text-ciano">0{i + 1}</span>
                  <span className="font-titulo text-[clamp(34px,10vw,56px)] font-medium leading-none tracking-[-0.02em]">
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="moldura pb-[max(20px,env(safe-area-inset-bottom))] pt-4">
          <a
            href={whatsappUrl()}
            target="_blank"
            rel="noopener"
            className="botao botao-laranja w-full min-h-14 text-[18px]"
          >
            <IconeWhatsApp />
            Orçamento no WhatsApp
          </a>
          <p className="mono mt-3 text-center text-white/70">{site.whatsapp.exibicao}</p>
        </div>
      </div>
    </header>
  );
}
