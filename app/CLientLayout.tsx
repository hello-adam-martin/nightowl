'use client'

import { useState } from 'react'
import TopBar from '@/components/TopBar'
import Footer from '@/components/Footer'

export default function ClientLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      <TopBar 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
      />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
