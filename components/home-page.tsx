'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import AddressForm from './AddressForm'
import ProductGrid from './ProductGrid'
import Cart from './Cart'
import CartButton from './CartButton'
import Image from 'next/image'
import { storeConfig, products, siteInfo } from '../config/config'
import Link from 'next/link'
import { useAddress } from '../context/AddressContext';
import { useCart } from '../context/CartContext'; // Make sure this import is present

type CartItem = {
  id: string;  // Change this from number to string
  name: string;
  price: number;
  quantity: number;
}

const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

export function HomePage() {
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  const [timeUntilOpen, setTimeUntilOpen] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addressEntered, setAddressEntered] = useState(false)
  const [addressChanged, setAddressChanged] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [phoneNumberEntered, setPhoneNumberEntered] = useState(false)
  const { isServiceable, setIsServiceable } = useAddress();
  const { cart: cartFromContext } = useCart(); // Use the cart from the CartContext

  const checkServiceability = useCallback(async () => {
    setIsServiceable(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const isWithinServiceArea = Math.random() < 0.7;
      setIsServiceable(isWithinServiceArea);
    } catch (error) {
      setIsServiceable(false);
    }
  }, [setIsServiceable]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      const currentHour = now.getHours()
      const isOpen = currentHour >= storeConfig.openingHour && currentHour < storeConfig.closingHour
      setIsStoreOpen(isOpen)

      if (!isOpen) {
        const openingTime = new Date(now)
        openingTime.setHours(storeConfig.openingHour, 0, 0, 0)
        if (currentHour >= storeConfig.closingHour) {
          openingTime.setDate(openingTime.getDate() + 1)
        }
        const timeDiff = openingTime.getTime() - now.getTime()
        const hoursUntilOpen = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutesUntilOpen = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const secondsUntilOpen = Math.floor((timeDiff % (1000 * 60)) / 1000)
        setTimeUntilOpen(`${hoursUntilOpen}h ${minutesUntilOpen}m ${secondsUntilOpen}s`)
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const removeFromCart = (id: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id)
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      )
    }
  }

  const getItemQuantity = (id: string) => {
    const item = cart.find(item => item.id === id)
    return item ? item.quantity : 0
  }

  const getTotalItems = useMemo(() => {
    const total = cartFromContext.reduce((total, item) => total + item.quantity, 0);
    return total;
  }, [cartFromContext]); // This will recalculate whenever the cart changes


  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  const filteredProducts = products
    .filter(product => 
      (selectedCategory === 'all' || product.category === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )

  // New: Get unique categories from filtered products
  const availableCategories = useMemo(() => {
    const categorySet = new Set(filteredProducts.map(product => product.category));
    return ['all', ...Array.from(categorySet)];
  }, [filteredProducts]);

  const isAddressValid = addressEntered && (isServiceable ?? false) && !addressChanged && phoneNumberEntered

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }


  return (
    <div className="min-h-screen bg-gray-100">
      {/* Fixed top bar */}
      <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4 py-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/NightOwl.png" alt="NightOwl Logo" width={30} height={30} />
              <h1 className="text-xl font-bold ml-2">NightOwl</h1>
            </div>
            <p className="text-sm text-gray-600">
              Open {formatHour(storeConfig.openingHour)} - {formatHour(storeConfig.closingHour)}
            </p>
            <CartButton 
              isCartOpen={isCartOpen} 
              setIsCartOpen={setIsCartOpen} 
              itemCount={getTotalItems}
            />
          </div>
          {!isStoreOpen && timeUntilOpen && (
            <p className="text-sm text-red-600 mt-1 text-center font-semibold">
              Store is Currently Closed. Opens in {timeUntilOpen}
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="pt-20 p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Welcome message */}
          <h2 className="text-2xl font-bold text-center mb-4">Welcome</h2>
          {/* Compact introduction */}
          <p className="text-sm text-gray-600 mb-4 text-center">
            {siteInfo.longDescription}
          </p>
          {/* Updated button text */}
          <div className="text-center mb-6">
            <Link href="/about">
              <Button variant="outline" size="sm">
                Learn More
              </Button>
            </Link>
          </div>

          <AddressForm
            addressEntered={addressEntered}
            setAddressEntered={setAddressEntered}
            checkServiceability={checkServiceability}
            setAddressChanged={setAddressChanged}
            setPhoneNumberEntered={setPhoneNumberEntered}
            serviceInfo={storeConfig.serviceInfo}
          />

          <div className="relative mt-12 mb-12">
            <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>
            
            <div className="mb-6">
              <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
                <TabsList className="bg-gray-100 p-1 rounded-lg h-10 flex items-center">
                  {availableCategories.map(category => (
                    <TabsTrigger 
                      key={category} 
                      value={category}
                      className="px-3 py-1 text-sm font-medium transition-colors
                                 data-[state=active]:bg-white data-[state=active]:text-blue-600
                                 data-[state=active]:shadow-sm hover:bg-gray-200"
                    >
                      {category === 'all' ? 'All' : category}
                    </TabsTrigger>
                  ))}
                  <div className="relative ml-auto">
                    <Input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-8 py-1 w-48 h-8 text-sm bg-white"
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
                </TabsList>
              </Tabs>
            </div>

            <div>
              {availableCategories.map(category => (
                <div key={category} className={selectedCategory === category ? '' : 'hidden'}>
                  <ProductGrid
                    products={filteredProducts}
                    isStoreOpen={isStoreOpen}
                  />
                </div>
              ))}
            </div>

            <Cart
              isCartOpen={isCartOpen}
              setIsCartOpen={setIsCartOpen}
              cart={cart}
              isAddressValid={isAddressValid}
              updateQuantity={(id: string, increment: boolean) => 
                updateQuantity(id, getItemQuantity(id) + (increment ? 1 : -1))
              }
              removeFromCart={removeFromCart}
              getTotalPrice={getTotalPrice}
              deliveryCharge={storeConfig.deliveryCharge}
            />
          </div>
        </div>
      </div>
    </div>
  )
}