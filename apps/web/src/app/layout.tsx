import type { Metadata } from 'next';
import { Bowlby_One, Inter, JetBrains_Mono, Doto } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const bowlby = Bowlby_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const doto = Doto({
  subsets: ['latin'],
  variable: '--font-pixel',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Catch 'n Save — Sua coleção Pokémon, com valor em tempo real.",
  description:
    'Organize sua coleção Pokémon TCG, acompanhe a valorização das suas cartas e encontre colecionadores perto de você.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      suppressHydrationWarning
      className={`${bowlby.variable} ${inter.variable} ${jetbrainsMono.variable} ${doto.variable}`}
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
