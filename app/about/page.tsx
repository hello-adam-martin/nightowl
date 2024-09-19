'use client';

import { useState, useEffect } from 'react'
import TopBar from '@/components/TopBar'
import Image from 'next/image'
import { storeConfig } from '../../config/config'
import Cart from '@/components/Cart'
import { useCart } from '@/context/CartContext'

const formatHour = (hour: number) => {
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:00 ${period}`;
};

export default function AboutPage() {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [currentDay, setCurrentDay] = useState('');

  useEffect(() => {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    setCurrentDay(days[new Date().getDay()]);
  }, []);

  const { cart, updateQuantity, removeFromCart } = useCart()

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar 
        currentPage="about" 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
      />

      {/* Main content */}
      <div className="pt-20 p-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg p-8">
          {/* Add logo here */}
          <div className="flex justify-center mb-6">
            <Image src="/NightOwl.png" alt="NightOwl Logo" width={120} height={120} />
          </div>
          
          <h2 className="text-2xl font-bold text-center mb-6">About NightOwl</h2>
          
          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Our Story</h3>
            <p className="text-gray-700">
            NightOwl was founded with a simple mission: to provide convenient service to our community. We understand that life doesn’t stop at certain hours, and neither should your access to essential items.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">What We Offer</h3>
            <p className="text-gray-700">
              We specialize in delivering a wide range of products, from snacks and beverages to household essentials, right to your doorstep during the late hours when most stores are closed.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Our Commitment</h3>
            <p className="text-gray-700">
              At NightOwl, we&apos;re committed to providing fast, reliable service with a focus on customer satisfaction. Our team works tirelessly to ensure that your late-night needs are met with efficiency and care.
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Our Service Area</h3>
            <p className="text-gray-700">
              We currently serve [list of neighborhoods or cities]. Check our delivery page to see if we deliver to your area!
            </p>
          </section>

          <section className="mb-8">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p className="text-gray-700">
              Have questions or feedback? We&apos;d love to hear from you!<br />
              Email: support@nightowl.com<br />
              Phone: (555) 123-4567
            </p>
          </section>

          <section>
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Q: What are your operating hours?</h4>
                <p className="text-gray-700 mb-2">A: Our operating hours vary by day:</p>
                <div className="space-y-1 text-sm text-gray-700">
                  {Object.entries(storeConfig.hours).map(([day, hours]) => (
                    <div key={day} className={`flex ${day === currentDay ? 'font-bold text-blue-600' : ''}`}>
                      <span className="w-24">{day.charAt(0).toUpperCase() + day.slice(1)}:</span>
                      <span>{formatHour(hours.open)} - {formatHour(hours.close)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium">Q: How fast is your delivery?</h4>
                <p className="text-gray-700">A: We aim to deliver within 30-45 minutes of order placement, depending on your location.</p>
              </div>
              <div>
                <h4 className="font-medium">Q: Do you have a minimum order amount?</h4>
                <p className="text-gray-700">A: Yes, our minimum order amount is ${storeConfig.serviceInfo.minOrderValue.toFixed(2)}.</p>
              </div>
              <div>
                <h4 className="font-medium">Q: What payment methods do you accept?</h4>
                <p className="text-gray-700">A: We accept all major credit cards, debit cards, and mobile payment options.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        cart={cart}
        isAddressValid={true} // You might want to handle this differently for the about page
        updateQuantity={(id, increment) => updateQuantity(id, (cart.find(item => item.id === id)?.quantity ?? 0) + (increment ? 1 : -1))}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        deliveryCharge={storeConfig.serviceInfo.deliveryCharge}
      />
    </div>
  )
}