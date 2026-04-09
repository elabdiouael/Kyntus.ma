import "./globals.css"; // HAAA L'CODE LI KHASS YKUN
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kyntus - Next Generation IT Solutions",
  description: "Next Generation IT Solutions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased bg-[#030712] text-white">
        {children}
      </body>
    </html>
  );
}