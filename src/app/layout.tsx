import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import StoreChrome from "@/components/layout/StoreChrome";
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

const OG_IMAGE = "https://mantisjoyas.cl/og-image.jpg"

export const metadata: Metadata = {
  title: "MANTIS — Joyas Bañadas en Oro",
  description: "Pulseras, collares y dijes bañados en oro 18k. Pequeños detalles, grandes momentos.",
  openGraph: {
    title: "MANTIS — Joyas Bañadas en Oro",
    description: "Pulseras, collares y dijes bañados en oro 18k. Pequeños detalles, grandes momentos.",
    url: "https://mantisjoyas.cl",
    siteName: "MANTIS",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "MANTIS Joyas" }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MANTIS — Joyas Bañadas en Oro",
    description: "Pulseras, collares y dijes bañados en oro 18k.",
    images: [OG_IMAGE],
  },
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${cormorant.variable} ${jost.variable}`}>
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
            </Script>
          </>
        )}
        <CartProvider>
          <WishlistProvider>
            <RecentlyViewedProvider>
              <StoreChrome>{children}</StoreChrome>
            </RecentlyViewedProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
