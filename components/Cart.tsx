import React, { useState, useMemo } from 'react'
import { X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CartItem } from '@/types/cart' // Import CartItem type
import { useCart } from '../context/CartContext';

// ... existing imports and type definitions ...

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cart: CartItem[]; // Use CartItem type here
  updateQuantity: (id: string, increment: boolean) => void;
  removeFromCart: (id: string) => void;
  deliveryCharge: number;
  isAddressValid: boolean;
  getTotalPrice: () => number;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ total, onSuccess, isCartEmpty }: { total: number; onSuccess: () => void; isCartEmpty: boolean }) {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setProcessing(true)

    if (!stripe || !elements) {
      return
    }

    // Convert total to cents and round to avoid floating point issues
    const amountInCents = Math.round(total * 100)

    const { error: backendError, clientSecret } = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountInCents }), // amount in cents
    }).then(res => res.json())

    if (backendError) {
      setError(backendError.message)
      setProcessing(false)
      return
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setError('Card element not found');
      setProcessing(false);
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    })

    if (error) {
      setError(error.message || 'An error occurred')
    } else if (paymentIntent.status === 'succeeded') {
      onSuccess()
    }

    setProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button 
        className="w-full mt-4" 
        type="submit"
        disabled={!stripe || processing || isCartEmpty} // Disable if cart is empty
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}

export default function Cart({
  isCartOpen,
  setIsCartOpen,
  deliveryCharge,
}: CartProps) {
  const { cart, removeFromCart, updateQuantity } = useCart();
  
  // Calculate subtotal and total number of items
  const { subtotal, totalItems } = useMemo(() => {
    return cart.reduce((acc, item) => ({
      subtotal: acc.subtotal + item.price * item.quantity,
      totalItems: acc.totalItems + item.quantity
    }), { subtotal: 0, totalItems: 0 });
  }, [cart]);

  const total = subtotal + deliveryCharge;

  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePaymentSuccess = () => {
    setPaymentSuccess(true)
    // Here you would typically clear the cart, update order status, etc.
  }

  const handleUpdateQuantity = (id: string, increment: boolean) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      const currentQuantity = item.quantity;
      const newQuantity = increment ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
      
      updateQuantity(id, newQuantity);
    } else {
      console.log(`Item with id ${id} not found in cart`);
    }
  };

  return (
    <>
      {/* Dark overlay */}
      {isCartOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}
      
      {/* Cart component */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-96 bg-white shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto z-50`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Cart ({totalItems} items)</h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {cart.length === 0 ? (
            <p className="text-center text-gray-500 my-8">Your cart is empty</p>
          ) : (
            <div className="flex-grow overflow-y-auto mb-6">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4 pb-4 border-b">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-gray-600">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center">
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, false)} 
                      className="px-2 py-1 bg-gray-200 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                    <button 
                      onClick={() => handleUpdateQuantity(item.id, true)} 
                      className="px-2 py-1 bg-gray-200 rounded-r"
                    >
                      +
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="ml-4 text-red-500 hover:text-red-700">
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-auto">
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-semibold">${deliveryCharge.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {!paymentSuccess ? (
              <Elements stripe={stripePromise}>
                <CheckoutForm 
                  total={total} 
                  onSuccess={handlePaymentSuccess} 
                  isCartEmpty={cart.length === 0} // Pass isCartEmpty prop
                />
              </Elements>
            ) : (
              <div className="text-green-500 font-bold text-center">
                Payment successful! Thank you for your order.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}