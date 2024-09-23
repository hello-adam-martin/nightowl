'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import CartButton from './CartButton'
import { useCart } from '../context/CartContext'
import { checkStoreStatus, StoreStatus } from '@/utils/storeStatus';
import { formatTime24to12 } from '@/utils/timeFormatting'; // Add this import

interface TopBarProps {
  currentPage: "home" | "about" | "delivery-area";
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopBar({ currentPage, isCartOpen, setIsCartOpen }: TopBarProps) {
  const { cart } = useCart()
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({
    isOpen: false,
    nextOpeningDay: '',
    nextOpeningTime: '',
    closingTime: '', // Add this line
    timeUntilOpen: '',
    secondsUntilOpen: 0
  })

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  useEffect(() => {
    const updateStoreStatus = () => {
      setStoreStatus(checkStoreStatus());
    }

    updateStoreStatus(); // Check immediately on mount
    
    // Update every second
    const timer = setInterval(updateStoreStatus, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusDisplay = () => {
    if (storeStatus.isOpen) return 'OPEN';
    if (storeStatus.nextOpeningDay === 'today') {
      return storeStatus.secondsUntilOpen <= 1800 ? 'OPENING SOON' : 'OPENING LATER TODAY';
    }
    return 'CLOSED';
  };

  const statusDisplay = getStatusDisplay();
  const formattedNextOpeningTime = formatTime24to12(storeStatus.nextOpeningTime);
  const formattedClosingTime = formatTime24to12(storeStatus.closingTime);

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={30} height={30} />
            <h1 className="text-xl font-bold ml-2 cursor-pointer">NightOwl</h1>
          </Link>
          <div className="text-xs sm:text-sm text-gray-600 flex-grow text-center mx-2">
            <p className={`font-bold ${
              statusDisplay === 'OPEN' ? 'text-green-600' : 
              statusDisplay === 'OPENING LATER TODAY' ? 'text-yellow-600' :
              statusDisplay === 'OPENING SOON' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {statusDisplay}
            </p>
            <p className="truncate">
              {storeStatus.isOpen 
                ? `Closes at ${formattedClosingTime}` 
                : `Opens ${storeStatus.nextOpeningDay} at ${formattedNextOpeningTime}`}
            </p>
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            {currentPage === 'home' && (
              <Link href="/about" className="hidden sm:inline-block">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            )}
            <CartButton 
              isCartOpen={isCartOpen} 
              setIsCartOpen={setIsCartOpen} 
              itemCount={getTotalItems()}
            />
          </div>
        </div>
      </div>
    </div>
  )
}