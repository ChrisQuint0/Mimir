import type { Metadata } from "next";
import { Inter, Lora } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });

export const metadata: Metadata = {
  title: "Mimir - Your Personalized Learning Journey",
  description:
    "AI-powered adaptive learning platform with personalized curricula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${lora.variable} font-sans text-foreground bg-background antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
