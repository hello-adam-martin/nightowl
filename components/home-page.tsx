'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Search, X, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import AddressForm from './AddressForm'
import ProductGrid from './ProductGrid'
import Cart from './Cart'
import { storeConfig, products, siteInfo } from '../config/config'
import Link from 'next/link'
import { useAddress } from '../context/AddressContext';
import { useCart } from '../context/CartContext'; // Make sure this import is present
import ClosedStoreNotice from './ClosedStoreNotice'
import TopBar from './TopBar'

const formatHour = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

export function HomePage() {
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  const [timeUntilOpen, setTimeUntilOpen] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addressEntered, setAddressEntered] = useState(false)
  const [addressChanged, setAddressChanged] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [phoneNumberEntered, setPhoneNumberEntered] = useState(false)
  const { isServiceable, setIsServiceable } = useAddress();
  const { cart: cartFromContext, updateCart } = useCart(); // Get updateCart function
  const [nextOpeningTime, setNextOpeningTime] = useState('')
  const [isLoading, setIsLoading] = useState(true) // Add this state
  const [currentDay, setCurrentDay] = useState<keyof typeof storeConfig.hours>('monday')

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
    const checkStoreStatus = () => {
      const now = new Date()
      setCurrentDay(now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof storeConfig.hours)
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const { open, close } = storeConfig.hours[currentDay]
      
      const [openHour, openMinute] = open.split(':').map(Number)
      const [closeHour, closeMinute] = close.split(':').map(Number)
      
      const isOpen = (openHour < closeHour || (openHour === closeHour && openMinute < closeMinute)) 
        ? (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) &&
          (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute))
        : (currentHour > openHour || (currentHour === openHour && currentMinute >= openMinute)) ||
          (currentHour < closeHour || (currentHour === closeHour && currentMinute < closeMinute))
      
      setIsStoreOpen(isOpen)

      if (!isOpen) {
        const openingTime = new Date(now)
        openingTime.setHours(openHour, openMinute, 0, 0)
        if (currentHour > closeHour || (currentHour === closeHour && currentMinute >= closeMinute)) {
          openingTime.setDate(openingTime.getDate() + 1)
        }
        const timeDiff = openingTime.getTime() - now.getTime()
        const hoursUntilOpen = Math.floor(timeDiff / (1000 * 60 * 60))
        const minutesUntilOpen = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
        const secondsUntilOpen = Math.floor((timeDiff % (1000 * 60)) / 1000)
        setTimeUntilOpen(`${hoursUntilOpen}h ${minutesUntilOpen}m ${secondsUntilOpen}s`)
        setNextOpeningTime(formatHour(open))
      }

      setIsLoading(false)
    }

    checkStoreStatus() // Check immediately on mount
    const timer = setInterval(checkStoreStatus, 1000) // Update every second

    return () => clearInterval(timer)
  }, [currentDay])

  const removeFromCart = (id: string) => {
    updateCart(cartFromContext.filter(item => item.id !== id));
  }

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeFromCart(id);
    } else {
      updateCart(cartFromContext.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ));
    }
  }

  const getItemQuantity = (id: string) => {
    const item = cartFromContext.find(item => item.id === id);
    return item ? item.quantity : 0;
  }

  const getTotalPrice = () => {
    return cartFromContext.reduce((total, item) => total + item.price * item.quantity, 0);
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
      <TopBar 
        currentPage="home" 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main content */}
      <div className="pt-20 p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Welcome section */}
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Welcome to NightOwl</h2>
            <div className="max-w-2xl mx-auto">
              <p className="text-gray-600 mb-6">
                {siteInfo.longDescription}
              </p>
              <Link href="/about">
                <Button variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
          ) : isStoreOpen ? (
            <AddressForm
              setAddressEntered={setAddressEntered}
              checkServiceability={checkServiceability}
              setAddressChanged={setAddressChanged}
              setPhoneNumberEntered={setPhoneNumberEntered}
              serviceInfo={storeConfig.serviceInfo}
            />
          ) : (
            <ClosedStoreNotice
              timeUntilOpen={timeUntilOpen}
              nextOpeningTime={nextOpeningTime}
            />
          )}

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
              cart={cartFromContext}
              isAddressValid={isAddressValid}
              updateQuantity={(id: string, increment: boolean) => 
                updateQuantity(id, getItemQuantity(id) + (increment ? 1 : -1))
              }
              removeFromCart={removeFromCart}
              getTotalPrice={getTotalPrice}
              deliveryCharge={storeConfig.serviceInfo.deliveryCharge}
            />
          </div>
        </div>
      </div>
    </div>
  )
}