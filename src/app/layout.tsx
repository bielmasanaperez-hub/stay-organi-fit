import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "StayOrganiFit · Eurofitness & OutfitDiario",
  description:
    "Organizador diario de entrenamientos por tiempos (08:00-09:10) en Eurofitness Estació del Nord conectado con OutfitDiario.",
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
  themeColor: "#11161f",
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
    <html lang="es" className={`${inter.variable} dark`}>
      <body className="font-sans antialiased min-h-screen bg-[#11161f] text-slate-100">
        {children}
      </body>
    </html>
  );
}
