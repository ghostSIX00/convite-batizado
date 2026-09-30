import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Pinyon_Script } from "next/font/google";
import { EVENT } from "@/lib/config";
import "./globals.css";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});
const script = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(EVENT.siteUrl),
  title: EVENT.titulo,
  description: EVENT.descricao,
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: EVENT.titulo,
    title: EVENT.titulo,
    description: EVENT.descricao,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Convite de batizado de Anthony Gael" }],
  },
  twitter: {
    card: "summary_large_image",
    title: EVENT.titulo,
    description: EVENT.descricao,
    images: ["/og.jpg"],
  },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#EDF4FB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${serif.variable} ${script.variable}`}>
      <body>{children}</body>
    </html>
  );
}
