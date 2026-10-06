"use client";

import type Lenis from "lenis";

/** Instância única do Lenis (só existe no desktop com mouse). */
let lenis: Lenis | null = null;

export function setLenis(l: Lenis | null) {
  lenis = l;
}
export function getLenis() {
  return lenis;
}

/** Trava a rolagem da página (menu aberto, lightbox) */
export function travarRolagem(travar: boolean) {
  if (lenis) {
    if (travar) lenis.stop();
    else lenis.start();
  }
  document.documentElement.style.overflow = travar ? "hidden" : "";
}

/** Rola até um elemento, usando o Lenis quando ele existe */
export function rolarPara(seletor: string) {
  const alvo = document.querySelector<HTMLElement>(seletor);
  if (!alvo) return;
  const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (lenis) lenis.scrollTo(alvo, { offset: -64, immediate: reduzido });
  else alvo.scrollIntoView({ behavior: reduzido ? "auto" : "smooth", block: "start" });
}
