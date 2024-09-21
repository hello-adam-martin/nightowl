'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import CartButton from './CartButton'
import { storeConfig } from '../config/config'
import { useCart } from '../context/CartContext'

const formatHour = (time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const displayHours = hours % 12 || 12;
  return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
};

const formatHours = (hours: { open: string; close: string } | undefined) => {
  if (!hours) return 'Closed today';
  return `${formatHour(hours.open)} - ${formatHour(hours.close)}`;
};

interface TopBarProps {
  currentPage: "home" | "about" | "delivery-area";
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopBar({ currentPage, isCartOpen, setIsCartOpen }: TopBarProps) {
  const { cart } = useCart()
  const [storeStatus, setStoreStatus] = useState('CLOSED')
  const [todayHours, setTodayHours] = useState<{ open: string; close: string } | undefined>(undefined)

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date()
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof storeConfig.hours
      const currentHour = now.getHours()
      const currentMinute = now.getMinutes()
      const hours = storeConfig.hours[currentDay]
      
      setTodayHours(hours)
      
      if (!hours) {
        setStoreStatus('CLOSED')
        return
      }

      const [openHour, openMinute] = hours.open.split(':').map(Number)
      const [closeHour, closeMinute] = hours.close.split(':').map(Number)
      
      const currentTime = currentHour * 60 + currentMinute
      const openTime = openHour * 60 + openMinute
      let closeTime = closeHour * 60 + closeMinute
      
      // Handle cases where closing time is past midnight
      if (closeTime <= openTime) {
        closeTime += 24 * 60
      }

      if (currentTime >= openTime && currentTime < closeTime) {
        setStoreStatus('OPEN')
      } else if (currentTime < openTime) {
        if (openTime - currentTime <= 30) {
          setStoreStatus('OPENING SOON')
        } else {
          setStoreStatus('OPENING LATER TODAY')
        }
      } else {
        setStoreStatus('CLOSED')
      }
    }

    checkStoreStatus() // Check immediately on mount
    
    // Update every second
    const timer = setInterval(checkStoreStatus, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center w-1/3">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={30} height={30} />
            <h1 className="text-xl font-bold ml-2 cursor-pointer">NightOwl</h1>
          </Link>
          <div className="text-sm text-gray-600 w-1/3 text-center">
            <p className={`font-bold ${
              storeStatus === 'OPEN' ? 'text-green-600' : 
              storeStatus === 'OPENING LATER TODAY' ? 'text-yellow-600' :
              storeStatus === 'OPENING SOON' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {storeStatus}
            </p>
            <p>Hours: {formatHours(todayHours)}</p>
          </div>
          <div className="flex items-center space-x-4 w-1/3 justify-end">
            {currentPage === 'home' && (
              <Link href="/about">
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