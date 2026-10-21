import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "StayOrganiFit · Eurofitness Estació del Nord & OutfitDiario",
  description:
    "Sistema futurista de entrenamiento por Tempos (08:00-09:10) para Eurofitness Estació del Nord + Básquet Nocturno + Conexión en vivo con OutfitDiario.",
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
  themeColor: "#050811",
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
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} dark`}
    >
      <body className="font-sans antialiased selection:bg-cyber-cyan/30 selection:text-cyber-cyan min-h-screen">
        {children}
      </body>
    </html>
  );
}
