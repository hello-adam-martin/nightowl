'use client';

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAddress } from '../context/AddressContext'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import { useCart } from '../context/CartContext'
import { LOW_STOCK_THRESHOLD } from '@/config/config'
import { SHOW_OUT_OF_STOCK_ITEMS } from '@/config/config'

async function fetchProducts() {
  const response = await fetch('/api/products');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  const data = await response.json();
  console.log('Fetched products:', data);
  return data;
}

interface Product {
  id: number;
  name: string;
  category_id: string;
  price: number;
  image: string | null;
  inventory: number;
  visible: boolean;
}

interface ProductGridProps {
  isStoreOpen: boolean;
}

function ProductGrid({ isStoreOpen }: ProductGridProps) {
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts
  });

  console.log('Products from useQuery:', products);
  console.log('isLoading:', isLoading);
  console.log('error:', error);

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
      return;
    }
    
    if (newQuantity === 0) {
      removeFromCart(product.id.toString());
    } else {
      updateQuantity(product.id.toString(), newQuantity);
    }
  };

  const isLowStock = (inventory: number) => inventory <= LOW_STOCK_THRESHOLD && inventory > 0;
  const isOutOfStock = (inventory: number) => inventory === 0;

  if (isLoading) return <div>Loading products...</div>;
  if (error) return <div>Error loading products</div>;
  if (!products || products.length === 0) return <div>No products available</div>;

  const validProducts = products.filter((product: Product) => 
    product.category_id && 
    product.category_id.trim() !== '' && 
    product.visible &&
    (SHOW_OUT_OF_STOCK_ITEMS || product.inventory > 0)
  );

  console.log('validProducts:', validProducts);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {validProducts.map((product: Product) => (
        <Card key={product.id} className={isOutOfStock(product.inventory) ? "opacity-60" : ""}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <CardTitle>{product.name}</CardTitle>
              <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
                {product.category_id}
              </span>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex flex-col h-[calc(100%-130px)]">
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
            <div className="flex-grow">
              <p>Price: ${product.price.toFixed(2)}</p>
              {isLowStock(product.inventory) && (
                <p className="text-yellow-600 text-sm mt-1">Low stock</p>
              )}
              {isOutOfStock(product.inventory) && (
                <p className="text-red-600 text-sm mt-1 font-semibold">Out of stock</p>
              )}
            </div>
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
                      disabled={isOutOfStock(product.inventory)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="mx-2">{getItemQuantity(product.id)}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleUpdateQuantity(product, true)}
                      disabled={getItemQuantity(product.id) >= product.inventory || isOutOfStock(product.inventory)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    onClick={() => {
                      addToCart({ id: product.id.toString(), name: product.name, price: product.price, quantity: 1 });
                    }}
                    disabled={isOutOfStock(product.inventory)}
                  >
                    {isOutOfStock(product.inventory) ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                )}
              </div>
            ) : null}
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

export default ProductGrid;
