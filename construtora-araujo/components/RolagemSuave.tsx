"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/rolagem";

gsap.registerPlugin(ScrollTrigger);

/**
 * Lenis só no desktop com mouse. No touch (celular, tablet) fica o scroll
 * nativo: é mais rápido, não briga com a barra do navegador e o scrub do
 * hero continua liso porque é desenhado em canvas.
 */
export function RolagemSuave() {
  useEffect(() => {
    const mouse = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const toque = "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const reduzido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!mouse || toque || reduzido) return;

    // Lenis só é baixado no desktop
    let lenis: Lenis | null = null;
    let cancelado = false;
    const tick = (t: number) => lenis?.raf(t * 1000);
    import("lenis").then(({ default: L }) => {
      if (cancelado) return;
      lenis = new L({ lerp: 0.12, anchors: { offset: -64 } });
      setLenis(lenis);
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(tick);
      gsap.ticker.lagSmoothing(0);
    });

    return () => {
      cancelado = true;
      gsap.ticker.remove(tick);
      lenis?.destroy();
      setLenis(null);
    };
  }, []);

  return null;
}
