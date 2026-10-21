import type { Metadata, Viewport } from "next";
import {
  Cormorant_Garamond,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["400", "500", "600", "700"],
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "StayOrganiFit · Private Athletic Club & OutfitDiario",
  description:
    "Planificación privada de alto rendimiento por Tempos (08:00-09:10) en Eurofitness Estació del Nord sincronizada con OutfitDiario.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "StayOrganiFit",
  },
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
};

export const viewport: Viewport = {
  themeColor: "#09090B",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${jakarta.variable} ${mono.variable} dark`}
    >
      <body className="font-sans antialiased min-h-screen bg-[#09090B] text-[#F5F3EF] selection:bg-[#C8A97E]/25 selection:text-[#DFC6A2]">
        {children}
      </body>
    </html>
  );
}
