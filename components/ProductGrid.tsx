'use client';

import React, { useMemo } from 'react'
import { useAddress } from '../context/AddressContext'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { Product } from '@/config/config'

interface ProductGridProps {
  products: Product[];
  isStoreOpen: boolean;
}

export default React.memo(function ProductGrid({
  products,
  isStoreOpen,
}: ProductGridProps) {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { isServiceable, isVerified } = useAddress();

  const getItemQuantity = (id: number) => {
    const item = cart.find(item => item.id === id.toString());
    return item ? item.quantity : 0;
  };

  const handleUpdateQuantity = (product: Product, increment: boolean) => {
    const currentQuantity = getItemQuantity(product.id);
    const newQuantity = increment ? currentQuantity + 1 : Math.max(0, currentQuantity - 1);
    
    if (increment && newQuantity > product.inventory) {
      // Don't allow increasing quantity beyond available inventory
      return;
    }
    
    if (newQuantity === 0) {
      removeFromCart(product.id.toString());
    } else {
      updateQuantity(product.id.toString(), newQuantity);
    }
  };

  // Filter out products with empty categories, zero inventory, or not visible
  const validProducts = useMemo(() => 
    products.filter(product => 
      product.category && 
      product.category.trim() !== '' && 
      product.inventory > 0 && 
      product.visible
    ),
    [products]
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {validProducts.map((product) => (
        <Card key={product.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{product.name}</CardTitle>
              <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
                {product.category}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative w-full aspect-square mb-2">
              <Image 
                src={product.image ? `/product-images/${product.image}` : "/images/placeholder.png"}
                alt={product.name} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="rounded-md" 
                style={{ objectFit: 'cover' }}
              />
            </div>
            <p>Price: ${product.price.toFixed(2)}</p>
          </CardContent>
          <CardFooter>
            {isStoreOpen && isVerified && isServiceable ? (
              <div className="w-full flex justify-end">
                {getItemQuantity(product.id) > 0 ? (
                  <div className="flex items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(product, false)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{getItemQuantity(product.id)}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(product, true)}
                      disabled={getItemQuantity(product.id) >= product.inventory}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => {
                    addToCart({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1 });
                  }}>
                    Add to Cart
                  </Button>
                )}
              </div>
            ) : null}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
})
