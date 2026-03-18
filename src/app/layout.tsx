import { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

export const dynamic = "force-dynamic";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "A'dan Z'ye Temin | AZT Medikal - Modern Tıbbi Çözümler",
  description: "2010'dan beri Ankara'da sağlık profesyonellerinin çözüm ortağıyız. Hemodiyaliz kateterleri, infüzyon pompaları ve tıbbi sarf malzemelerinde A'dan Z'ye güvenilir temin.",
  keywords: "medikal, tıbbi ürünler, hemodiyaliz, ankara medikal, tıbbi sarf malzemeleri, azt medikal",
  openGraph: {
    title: "A'dan Z'ye Temin | AZT Medikal",
    description: "Sağlık profesyonellerinin güvenilir çözüm ortağı. Modern medikal ürünler ve uzman kadro.",
    url: 'https://aztmedikal.com.tr',
    siteName: 'AZT Medikal',
    locale: 'tr_TR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="antialiased text-dark bg-light font-sans flex flex-col min-h-screen">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
