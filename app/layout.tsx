import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Neucha } from 'next/font/google';

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
