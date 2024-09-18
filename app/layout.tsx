import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { CartProvider } from '../context/CartContext';
import { AddressProvider } from '../context/AddressContext';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "NightOwl - Late Night Delivery Service",
  description: "Your go-to late-night delivery service for groceries, household essentials, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AddressProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AddressProvider>
      </body>
    </html>
  );
}
