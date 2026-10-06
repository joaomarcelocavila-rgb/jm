import type { Metadata, Viewport } from "next";
import { Inter_Tight, JetBrains_Mono, Saira } from "next/font/google";
import "./globals.css";
import { RolagemSuave } from "@/components/RolagemSuave";
import { schemaEmpresa } from "@/lib/schema";
import { site } from "@/lib/site";

// Só os pesos usados, com display: swap
const saira = Saira({ subsets: ["latin"], weight: ["500", "600"], display: "swap", variable: "--font-saira" });
const interTight = Inter_Tight({ subsets: ["latin"], weight: ["400"], display: "swap", variable: "--font-inter-tight" });
const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
  variable: "--font-jetbrains",
  preload: false,
});

const titulo = "Construtora Araújo | Construção e Reforma na Zona Leste de SP";
const descricao =
  "Construção, reforma e acabamento desde 2005 na Zona Leste de São Paulo. Orçamento pelo WhatsApp (11) 97626-5083.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: titulo, template: "%s | Construtora Araújo" },
  description: descricao,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: site.nome,
    title: titulo,
    description: descricao,
    images: [{ url: "/hero/araujo-hero-poster.jpg", width: 1600, height: 900, alt: "Construtora Araújo" }],
  },
  twitter: { card: "summary_large_image", title: titulo, description: descricao, images: ["/hero/araujo-hero-poster.jpg"] },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F4EFE6",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${saira.variable} ${interTight.variable} ${jetbrains.variable}`}>
      <body>
        <a
          href="#conteudo"
          className="so-leitor focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-tinta focus:px-4 focus:py-3 focus:text-papel"
        >
          Pular para o conteúdo
        </a>
        <RolagemSuave />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaEmpresa()) }}
        />
      </body>
    </html>
  );
}
