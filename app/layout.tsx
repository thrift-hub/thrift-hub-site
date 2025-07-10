import type { Metadata } from "next";
import { Inter, Lora, Playfair_Display } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ThriftHub NYC - Discover the Best Second-Hand Stores in New York",
    template: "%s | ThriftHub NYC",
  },
  description: "Your curated guide to the best thrift stores, vintage shops, and consignment boutiques in New York City. Find unique fashion and home goods.",
  keywords: ["thrift stores", "vintage shops", "consignment", "second-hand", "NYC", "New York"],
  authors: [{ name: "ThriftHub" }],
  creator: "ThriftHub",
  publisher: "ThriftHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "ThriftHub NYC",
    description: "Discover the best second-hand stores in New York City",
    url: "https://thrifthub.nyc",
    siteName: "ThriftHub NYC",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ThriftHub NYC",
    description: "Discover the best second-hand stores in New York City",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${lora.variable} ${playfair.variable}`}>
      <body className="antialiased bg-white text-gray-900 font-sans">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
