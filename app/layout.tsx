import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JetBrains_Mono, Neucha } from 'next/font/google';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const jetBrainsMono = JetBrains_Mono({ subsets: ['latin', 'cyrillic'] });
const neucha = Neucha({ 
  weight: '400',
  subsets: ['latin', 'cyrillic'],
  variable: '--font-neucha',
});

export const metadata: Metadata = {
  title: "Исторатор",
  description: "Генератор персонализированных историй",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${jetBrainsMono.className} ${neucha.variable}`}>
      <body>{children}</body>
    </html>
  );
}
