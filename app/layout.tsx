import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import ThemeSwitch from "@/components/ThemeSwitch";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Concours-Camer | Concours et admissions au Cameroun",
  description: "Retrouvez les concours, admissions, établissements d’enseignement supérieur et actualités officielles au Cameroun.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try { const theme = localStorage.getItem('concours-camer-theme'); if (theme === 'light') document.documentElement.dataset.theme = 'light'; } catch {}` }} />
      </head>
      <body
        className={`${outfit.variable} ${inter.variable} font-body antialiased`}
      >
        {children}
        <ThemeSwitch />
      </body>
    </html>
  );
}
