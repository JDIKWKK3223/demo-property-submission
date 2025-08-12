import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // make sure this is here

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = { title: "Submit Commission & Specials" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} page-bg`}>
        {children}
      </body>
    </html>
  );
}
