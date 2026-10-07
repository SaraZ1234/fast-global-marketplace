import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SellerStoreProvider } from "@/lib/sellerStore";

export const metadata: Metadata = {
  title: {
    default: "FAST Global Marketplace — The Global B2B & B2C Wholesale Marketplace",
    template: "%s — FAST Global Marketplace",
  },
  description:
    "Buy directly from verified manufacturers, exporters, wholesalers, distributors, and trusted suppliers across multiple industries.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="font-body text-ink antialiased">
        <SellerStoreProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </SellerStoreProvider>
      </body>
    </html>
  );
}

