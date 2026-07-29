import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
