// app/layout.tsx (The only change is the import line)

import type { Metadata } from "next";
// --- CORRECTED IMPORT: Use 'next/font/google' instead of '@next/font/google' ---
import { VT323 } from "next/font/google"; 
import "./globals.css";

// 2. Load the font
const vt323 = VT323({ 
  weight: "400", 
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Terminal Site",
  description: "A minimal terminal-style website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Apply font class to the <body> tag
    <html lang="en">
      <body className={vt323.className}>{children}</body> 
    </html>
  );
}