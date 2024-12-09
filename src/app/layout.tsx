import './globals.css';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const cabinetGrotesk = localFont({
  src: '../../public/fonts/CabinetGrotesk-Variable.woff2',
});

export const metadata: Metadata = {
  title: 'SMK Negeri 2 Depok Sleman | STEMBAYO',
  description: 'SMK Negeri 2 Depok Sleman | STEMBAYO',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${cabinetGrotesk.className} bg-[#f0e3ca]`}>{children}</body>
    </html>
  );
}
