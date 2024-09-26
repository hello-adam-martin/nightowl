'use client'

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import CartButton from './CartButton'
import { checkStoreStatus, StoreStatus } from '@/utils/storeStatus';
import { formatTime24to12 } from '@/utils/timeFormatting';
import { usePathname } from 'next/navigation'

export default function TopBar() {
  const { cart, isCartOpen, setIsCartOpen } = useCart();
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({
    isOpen: false,
    nextOpeningDay: '',
    nextOpeningTime: '',
    closingTime: '',
    timeUntilOpen: '',
    secondsUntilOpen: 0
  })

  const pathname = usePathname()

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  useEffect(() => {
    const updateStoreStatus = () => {
      setStoreStatus(checkStoreStatus());
    }

    updateStoreStatus();
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
          <div className="flex-1">
            <Link href="/" className="flex items-center flex-shrink-0">
              <Image src="/NightOwl.png" alt="NightOwl Logo" width={30} height={30} />
              <h1 className="text-xl font-bold ml-2 cursor-pointer">NightOwl</h1>
            </Link>
          </div>
          <div className="flex-1 text-xs sm:text-sm text-gray-600 text-center">
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
          <div className="flex-1 flex items-center justify-end space-x-4">
            {pathname === '/' && (
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