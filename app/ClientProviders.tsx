'use client'

import { CartProvider } from '../context/CartContext';
import { AddressProvider } from '../context/AddressContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export default function ClientProviders({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <AddressProvider>
        <CartProvider>
          {children}
        </CartProvider>
      </AddressProvider>
    </QueryClientProvider>
  );
}