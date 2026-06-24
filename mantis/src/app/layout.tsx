import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/carrito/CartDrawer";
import { CartProvider } from "@/hooks/useCart";
import { WishlistProvider } from "@/hooks/useWishlist";
import { RecentlyViewedProvider } from "@/hooks/useRecentlyViewed";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-jost",
});

export const metadata: Metadata = {
  title: "MANTIS — Joyas Bañadas en Oro",
  description: "Pulseras, collares y dijes bañados en oro 18k. Pequeños detalles, grandes momentos.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <Nav />
              {children}
              <Footer />
              <CartDrawer />
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}