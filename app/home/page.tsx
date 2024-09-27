'use client'

import { useState, useEffect, Suspense } from 'react'
import { Info, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import AddressForm from "@/components/AddressForm"
import ClosedStoreNotice from '@/components/ClosedStoreNotice'
import { storeConfig, siteInfo } from '@/config/config'
import Link from 'next/link'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { checkStoreStatus, type StoreStatus } from '@/utils/storeStatus';

// Dynamically import ProductGrid with no SSR
const ProductGrid = dynamic(() => import('@/components/ProductGrid'), { ssr: false })

export default function HomePage() {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>(() => checkStoreStatus());

  useEffect(() => {
    const timer = setInterval(() => {
      setStoreStatus(checkStoreStatus());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Split the description into paragraphs
  const descriptionParagraphs = siteInfo.longDescription.split('<br>')

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="p-8">
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
              {storeStatus.isOpen ? (
                <AddressForm serviceInfo={storeConfig.serviceInfo} />
              ) : (
                <ClosedStoreNotice />
              )}
            </div>
          </div>

          {/* Products section */}
          <div className="relative">
            <h2 className="text-xl font-semibold mb-4 text-center">Products</h2>
            <Suspense fallback={<div>Loading products...</div>}>
              <ProductGrid isStoreOpen={storeStatus.isOpen} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

export const runtime = 'edge'
export const revalidate = 0