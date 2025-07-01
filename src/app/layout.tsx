import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/contexts/CartContext";
import ChatAssistant from "@/components/ChatAssistant";
import CartDrawer from "@/components/CartDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Peptide Therapeutics - Premium Quality Peptides",
  description: "Discover high-quality therapeutic peptides for healing, muscle growth, weight loss, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          {children}
          <ChatAssistant />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
