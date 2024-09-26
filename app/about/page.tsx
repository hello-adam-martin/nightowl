'use client';

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { storeConfig } from '@/config/config'
import Cart from '@/components/Cart'
import { siteInfo } from '@/config/config'
import Link from 'next/link'
import { formatTime24to12 } from '@/utils/timeFormatting'

export default function AboutPage() {
  const [currentDay, setCurrentDay] = useState('')

  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    setCurrentDay(days[new Date().getDay()])
  }, [])

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main content */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-center mb-6">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={120} height={120} />
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left column: Main content */}
            <div className="md:w-2/3 md:border-r md:pr-8">
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">NightOwl: Essentials On Demand</h3>
                <p className="text-gray-700">
                NightOwl was born from a simple idea: essential services shouldn&apos;t be unavailable just because it&apos;s outside regular business hours. 
                Our goal is to be open for longer hours as we grow. Currently, we operate during peak off-hours demand periods, gradually expanding our availability as 
                our customer base increases. This approach allows us to provide essential services when they&apos;re most needed while ensuring sustainable operations 
                as a new business.</p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
                <p className="text-gray-700">
                  From midnight snacks to early morning necessities, we deliver a wide array of products when traditional stores have long since closed their doors.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
                <p className="text-gray-700">
                  Speed, reliability, and customer satisfaction are the pillars of our service. Our dedicated team ensures your late-night orders are handled with care and efficiency.
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Supporting Local Businesses</h3>
                <p className="text-gray-700 mb-4">
                  At NightOwl, we believe in supporting our community. That&apos;s why we&apos;ve partnered with local businesses to bring you the products you want and need:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <h4 className="text-lg font-medium">Local Supermarkets</h4>
                    </div>
                    <p className="text-gray-700">
                      We partner with local supermarkets and specialty food stores to bring you fresh produce, artisanal goods, and pantry staples.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <h4 className="text-lg font-medium">Neighborhood Pharmacies</h4>
                    </div>
                    <p className="text-gray-700">
                      For your health and personal care needs, we work with trusted local pharmacies.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 mr-2 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                      <h4 className="text-lg font-medium">Community Favourites</h4>
                    </div>
                    <p className="text-gray-700">
                      From corner bakeries to popular delis, we&apos;ve teamed up with beloved local establishments.
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
                    <div className="flex items-center mb-2">
                      <svg className="w-6 h-6 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                      </svg>
                      <h4 className="text-lg font-medium">Other Retailers</h4>
                    </div>
                    <p className="text-gray-700">
                      Local hardware stores, bookshops, and gift boutiques are part of our network, offering a diverse range of products.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium">Q: How fast is your delivery?</h4>
                    <p className="text-gray-500">We aim to deliver within 30-45 minutes of order placement, depending on your location.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Q: Do you have a minimum order amount?</h4>
                    <p className="text-gray-500">Yes, our minimum order amount is ${storeConfig.serviceInfo.minOrderValue.toFixed(2)}.</p>
                  </div>
                  <div>
                    <h4 className="font-medium">Q: What payment methods do you accept?</h4>
                    <p className="text-gray-500">We accept all major credit cards, debit cards, and mobile payment options. Online payments only.</p>
                  </div>
                </div>
              </section>
            </div>

            {/* Right column: Contact info, service area, and operating hours */}
            <div className="md:w-1/3 md:pl-8">
              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                <p className="text-gray-700">
                  Email: {siteInfo.supportEmail}<br />
                  Phone: {siteInfo.supportPhone}
                </p>
              </section>

              <section className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Our Service Area</h3>
                <p className="text-gray-700">
                  We currently serve Akaroa Township. You can enter your address on the home page or on our delivery area map to check if we can deliver to you.
                </p>
                <Link href="/delivery-area" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
                  View Delivery Area Map
                </Link>
              </section>

              <section>
                <h3 className="text-xl font-semibold mb-4">Operating Hours</h3>
                <div className="space-y-1 text-sm text-gray-700">
                  {Object.entries(storeConfig.hours).map(([day, hours]) => (
                    <div key={day} className={`flex ${day === currentDay ? 'font-bold text-blue-600' : ''}`}>
                      <span className="w-24">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                      <span>{formatTime24to12(hours.open)} - {formatTime24to12(hours.close)}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>

      <Cart
        deliveryCharge={storeConfig.serviceInfo.deliveryCharge}
      />
    </div>
  )
}