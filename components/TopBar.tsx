'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import CartButton from './CartButton'
import { storeConfig } from '../config/config'
import { useCart } from '../context/CartContext'
import React from 'react';

const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

interface TopBarProps {
  currentPage: 'home' | 'about';
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function TopBar({ currentPage, isCartOpen, setIsCartOpen }: TopBarProps) {
  const { cart } = useCart()

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
      <div className="max-w-7xl mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center w-1/3">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={30} height={30} />
            <h1 className="text-xl font-bold ml-2">NightOwl</h1>
          </div>
          <p className="text-sm text-gray-600 w-1/3 text-center">
            Open {formatHour(storeConfig.openingHour)} - {formatHour(storeConfig.closingHour)}
          </p>
          <div className="flex items-center space-x-4 w-1/3 justify-end">
            {currentPage === 'home' ? (
              <Link href="/about">
                <Button variant="outline" size="sm">
                  Learn More
                </Button>
              </Link>
            ) : (
              <Link href="/">
                <Button variant="outline" size="sm">
                  Back to Home
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