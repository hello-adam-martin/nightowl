'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useRef } from 'react';
import { Search, X, Loader2, Info, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import AddressForm from "@/components/AddressForm"
import ProductGrid from '@/components/ProductGrid'
import Cart from '@/components/Cart'
import { storeConfig, Product, siteInfo } from '@/config/config'
import Link from 'next/link'
import { useAddress } from '@/context/AddressContext';
import { useCart } from '@/context/CartContext';
import ClosedStoreNotice from '@/components/ClosedStoreNotice'
import TopBar from '@/components/TopBar'
import Image from 'next/image'

export function HomePage() {
  const [isStoreOpen, setIsStoreOpen] = useState(false)
  // Remove this line:
  // const [timeUntilOpen, setTimeUntilOpen] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [addressEntered, setAddressEntered] = useState(false)
  const [addressChanged, setAddressChanged] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [phoneNumberEntered, setPhoneNumberEntered] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const { isServiceable, setIsServiceable } = useAddress();
  const { cart: cartFromContext, updateCart } = useCart(); // Get updateCart function
  const [isLoading, setIsLoading] = useState(true) // Add this state
  const [currentDay, setCurrentDay] = useState<keyof typeof storeConfig.hours>('monday')

  const lastCheckedAddress = useRef('');

  const checkServiceability = useCallback(async (address: string) => {
    setIsServiceable(null);
    setIsLoading(true);

    // Only make the API call if the address has changed
    if (address !== lastCheckedAddress.current) {
      try {
        const response = await fetch(`/api/geocode?address=${encodeURIComponent(address)}`);
        const data = await response.json();

        if (data.status !== 'OK' || !data.results || data.results.length === 0) {
          throw new Error('Address not found');
        }

        const { lat, lng } = data.results[0].geometry.location;
        const isWithinServiceArea = isPointInPolygon({ lat, lng }, storeConfig.serviceInfo.serviceArea);
        setIsServiceable(isWithinServiceArea);
        lastCheckedAddress.current = address;
      } catch (error) {
        console.error('Error checking serviceability:', error);
        setIsServiceable(false);
      }
    }

    setIsLoading(false);
  }, [setIsServiceable]);

  // Function to check if a point is inside a polygon
  const isPointInPolygon = (point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]) => {
    //console.log("checking polygon");
    let isInside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i].lat, yi = polygon[i].lng;
      const xj = polygon[j].lat, yj = polygon[j].lng;

      const intersect = ((yi > point.lng) !== (yj > point.lng))
          && (point.lat < (xj - xi) * (point.lng - yi) / (yj - yi) + xi);
      if (intersect) isInside = !isInside;
    }
    //console.log("result: ",isInside)
    return isInside;
  };

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

  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      (selectedCategory === 'all' || product.category_name === selectedCategory) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, selectedCategory, searchTerm]);

  const availableCategories = useMemo(() => {
    const categorySet = new Set(products.map(product => product.category_name));
    return ['all', ...Array.from(categorySet)];
  }, [products]);

  const isAddressValid = addressEntered && (isServiceable ?? false) && !addressChanged && phoneNumberEntered

  const clearSearch = () => {
    setSearchTerm('')
    setSelectedCategory('all')
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }
        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [])

  // Split the description into paragraphs
  const descriptionParagraphs = siteInfo.longDescription.split('<br>')

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
          {/* Welcome section and Address Form / Closed Store Notice */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            {/* Welcome section */}
            <div className="md:w-1/2 flex flex-col items-center md:items-start">
              <div className="mb-6 flex items-center">
                <Image
                  src="/NightOwl.png"
                  alt="NightOwl Logo"
                  width={60}
                  height={60}
                  className="mr-4"
                />
                <h2 className="text-3xl font-bold">Welcome to NightOwl</h2>
              </div>
              <div className="text-gray-600 mb-6 text-center md:text-left">
                {descriptionParagraphs.map((paragraph, index) => (
                  <p key={index} className="mb-4 last:mb-0">{paragraph}</p>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Link href="/about" className="w-full sm:w-auto">
                  <Button 
                    variant="outline" 
                    className="w-full px-6 py-3 text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
                  >
                    <Info className="mr-2 h-5 w-5" />
                    Learn More
                  </Button>
                </Link>
                <Link href="/delivery-area" className="w-full sm:w-auto">
                  <Button 
                    variant="outline"
                    className="w-full px-6 py-3 text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
                  >
                    <MapPin className="mr-2 h-5 w-5" />
                    Check Delivery Area
                  </Button>
                </Link>
              </div>
            </div>

            {/* Address Form / Closed Store Notice */}
            <div className="md:w-1/2">
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
                <ClosedStoreNotice />
              )}
            </div>
          </div>

          {/* Products section */}
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>
            
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

            <div>
              <ProductGrid
                products={filteredProducts}
                isStoreOpen={isStoreOpen}
                // Remove this line:
                // selectedCategory={selectedCategory}
              />
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
              isStoreOpen={isStoreOpen} // Add this line
            />
          </div>
        </div>
      </div>
    </div>
  )
}