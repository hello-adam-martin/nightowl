import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import ClientProviders from './ClientProviders'
import Footer from '@/components/Footer'
import TopBar from '@/components/TopBar'
import dynamic from 'next/dynamic';
import { siteInfo, storeConfig } from "@/config/config"; // Import siteInfo
import MaintenanceMode from '@/components/MaintenanceMode'; // Import MaintenanceMode
import { MAINTENANCE_MODE } from "@/config/config"; // Import MAINTENANCE_MODE

// Dynamically import the Cart component with SSR disabled
const Cart = dynamic(() => import('@/components/Cart'), { ssr: false });

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
  title: siteInfo.title,
  description: siteInfo.longDescription,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Check if the application is in maintenance mode
  if (MAINTENANCE_MODE) {
    return <MaintenanceMode />; // Render MaintenanceMode if in maintenance
  }

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ClientProviders>
          <div className="flex flex-col min-h-screen">
            <TopBar />
            <main className="flex-grow pt-16">
              {children}
            </main>
            <Footer />
            <Cart deliveryCharge={storeConfig.serviceInfo.deliveryCharge} />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
