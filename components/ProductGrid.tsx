'use client';

import { useState, useMemo, useEffect } from 'react';
import { useCart } from '../context/CartContext'
import { useAddress } from '../context/AddressContext'
import { LOW_STOCK_THRESHOLD, SHOW_OUT_OF_STOCK_ITEMS } from '@/config/config'
import { Product } from '@/types/product'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Minus, Search, X, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation';

interface ProductGridProps {
  isStoreOpen: boolean;
}

const ProductGrid: React.FC<ProductGridProps> = ({ isStoreOpen }) => {
  const { cart, addToCart, removeFromCart, updateQuantity } = useCart();
  const { isServiceable, isVerified } = useAddress();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
    
    // Add this line to force a refresh of the component
    router.refresh();
  }, [router]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      (SHOW_OUT_OF_STOCK_ITEMS || product.inventory > 0) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedCategory === 'all' || product.category_name === selectedCategory)
    );
  }, [products, searchTerm, selectedCategory]);

  const availableCategories = useMemo(() => {
    const searchFilteredProducts = products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const categorySet = new Set(searchFilteredProducts.map(product => product.category_name));
    return ['all', ...Array.from(categorySet)];
  }, [products, searchTerm]);

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

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <span className="ml-2 text-lg text-gray-600">Loading products...</span>
      </div>
    );
  }

  // Update this section to always show the search input
  return (
    <div>
      <div className="mb-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <div className="bg-gray-100 p-2 rounded-lg">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
              <TabsList className="h-10 flex items-center flex-wrap mb-2 sm:mb-0 sm:flex-nowrap sm:mr-4 w-full sm:w-auto overflow-x-auto">
                {availableCategories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="px-3 py-1 text-sm font-medium transition-colors whitespace-nowrap
                               data-[state=active]:bg-white data-[state=active]:text-blue-600
                               data-[state=active]:shadow-sm hover:bg-gray-200 rounded"
                  >
                    {category === 'all' ? 'All' : category}
                  </TabsTrigger>
                ))}
              </TabsList>
              <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 pr-8 py-1 w-full h-10 text-sm bg-white rounded"
                />
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                {searchTerm && (
                  <Button 
                    onClick={clearSearch}
                    variant="ghost" 
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 p-1 h-6 w-6"
                    aria-label="Clear search"
                  >
                    <X size={12} />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product: Product) => (
            <Card key={product.id} className={isOutOfStock(product.inventory) ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex flex-col">
                  <div className="flex justify-between items-start">
                    <CardTitle>{product.name}</CardTitle>
                    <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs font-semibold rounded-full">
                      {product.category_id}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {product.description?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="p-4 flex flex-col">
                <div className="relative w-full mb-2 h-[200px] sm:h-auto sm:aspect-square">
                  <Image 
                    src={product.image ? `/product-images/${product.image}` : "/NightOwl.png"}
                    alt={product.name} 
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className={`rounded-md object-cover ${!product.image ? 'placeholder-image' : ''}`}
                  />
                </div>
                <div className="flex flex-col justify-between flex-grow">
                  <div>
                    <div className="flex justify-between items-center">
                      <p>Price: ${product.price.toFixed(2)}</p>
                      <div>
                        {isLowStock(product.inventory) && (
                          <p className="text-yellow-600 text-sm">Low stock</p>
                        )}
                        {isOutOfStock(product.inventory) && (
                          <p className="text-red-600 text-sm font-semibold">Out of stock</p>
                        )}
                      </div>
                    </div>
                    {product.supplier && (
                      <p className="text-sm text-gray-600">Supplied By: {product.supplier}</p>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                {isStoreOpen ? (
                  isVerified && isServiceable ? (
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
                  ) : (
                    <p className="text-sm text-yellow-600 italic">Address required for ordering.</p>
                  )
                ) : null}
              </CardFooter>
            </Card>
          ))
        ) : (
          <div>No products available</div> // Always show this message if no products match
        )}
      </div>

      {isStoreOpen && !isVerified && (
        <div className="mt-6 p-4 bg-yellow-100 border border-yellow-400 rounded-md">
          <p className="text-center text-yellow-700">
            Please provide your address to start shopping.
          </p>
        </div>
      )}
    </div>
  )
}

export default ProductGrid;
