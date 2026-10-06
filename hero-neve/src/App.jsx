import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollHero from "./components/ScrollHero.jsx";
import { Como, Contato, Destinos, Duvidas, Header, Historia, Incluido, Levar, Quando, Quiz, WaFloat } from "./components/Agencia.jsx";

export default function App() {
  // Recalcula as posições da rolagem depois que tudo montou (a seção de destinos fica presa e muda as alturas).
  useEffect(() => {
    ScrollTrigger.refresh();
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    document.fonts?.ready.then(onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="site">
      <Header />
      <main>
        <ScrollHero />
        <Historia />
        <Incluido />
        <Destinos />
        <Quiz />
        <Como />
        <Levar />
        <Quando />
        <Duvidas />
      </main>
      <Contato />
      <WaFloat />
    </div>
  );
}
