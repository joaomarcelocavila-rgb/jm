import ScrollHero from "./components/ScrollHero.jsx";

export default function App() {
  return (
    <main>
      <ScrollHero />
      {/* Conteúdo seguinte da página. Fica aqui só para a rolagem continuar depois da abertura. */}
      <section id="contato" className="flex min-h-screen items-center justify-center bg-night px-6 py-24 text-center">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-frost/60">Próxima seção</p>
          <h2 className="mt-4 text-[clamp(2rem,4vw,3.5rem)] font-medium leading-[1.05] tracking-[-0.03em] text-frost">
            O resto do site continua aqui.
          </h2>
        </div>
      </section>
    </main>
  );
}
