import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AgriSmart AI - Pertanian Presisi",
  description: "Platform AI untuk monitoring dan manajemen pertanian presisi dengan rover dan drone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
