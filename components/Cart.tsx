import React, { useState, useMemo, useEffect } from 'react'
import { X, AlertCircle, ShoppingCart, Trash2, CheckCircle, Clock } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { CartItem } from '@/types/cart'
import { useCart } from '../context/CartContext'
import { storeConfig, products } from '@/config/config'
import { useAddress } from '../context/AddressContext'; // Add this import

interface CartProps {
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  cart: CartItem[];
  updateQuantity: (id: string, increment: boolean) => void;
  removeFromCart: (id: string) => void;
  deliveryCharge: number;
  isAddressValid: boolean;
  getTotalPrice: () => number;
  isStoreOpen: boolean;
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm({ total, onSuccess, isMinOrderMet, isAddressValid, customerInfo, cartItems }: { 
  total: number; 
  onSuccess: () => void; 
  isMinOrderMet: boolean; 
  isAddressValid: boolean;
  customerInfo: {
    name: string;
    phone: string;
    address: string;
  };
  cartItems: CartItem[];
}) {
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

    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        amount: amountInCents,
        customerInfo: customerInfo,
        cartItems: cartItems
      }),
    });

    const { clientSecret, error: backendError } = await response.json();

    if (backendError) {
      setError(backendError.message);
      setProcessing(false);
      return;
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
        disabled={!stripe || processing || !isMinOrderMet || !isAddressValid}
      >
        {processing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  )
}

// New component for the minimum order message
const MinOrderMessage = ({ minOrderValue, currentSubtotal }: { minOrderValue: number, currentSubtotal: number }) => (
  <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4 rounded">
    <div className="flex items-center">
      <AlertCircle className="flex-shrink-0 mr-2" size={20} />
      <div>
        <p className="font-bold">Minimum order not met</p>
        <p>
          Add ${(minOrderValue - currentSubtotal).toFixed(2)} more to your order to meet the ${minOrderValue.toFixed(2)} minimum.
        </p>
      </div>
    </div>
  </div>
)

// New component for the invalid address message
const InvalidAddressMessage = () => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
    <div className="flex items-center">
      <AlertCircle className="flex-shrink-0 mr-2" size={20} />
      <div>
        <p className="font-bold">Invalid Address</p>
        <p>
          Your current address is not serviceable. Please update your address to continue.
        </p>
      </div>
    </div>
  </div>
)

// Add this type definition at the top of your file
type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export default function Cart({
  isCartOpen,
  setIsCartOpen,
  deliveryCharge,
  isStoreOpen,
}: CartProps) {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  
  // Calculate subtotal and total number of items
  const { subtotal, totalItems } = useMemo(() => {
    return cart.reduce((acc, item) => ({
      subtotal: acc.subtotal + item.price * item.quantity,
      totalItems: acc.totalItems + item.quantity
    }), { subtotal: 0, totalItems: 0 });
  }, [cart]);

  const total = subtotal + deliveryCharge;
  const isMinOrderMet = subtotal >= storeConfig.serviceInfo.minOrderValue;

  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [expectedDeliveryTime, setExpectedDeliveryTime] = useState<string | null>(null)

  const { customerName, address, phoneNumber, isServiceable } = useAddress();
  const firstName = customerName.split(' ')[0];

  const handlePaymentSuccess = async () => {
    const expectedDeliveryTime = calculateExpectedDeliveryTime();
    setExpectedDeliveryTime(expectedDeliveryTime);
    setPaymentSuccess(true)
    clearCart() // Clear the cart upon successful payment

    // Generate a random order ID (you might want to replace this with a real order ID generation system)
    const orderId = Math.floor(100000 + Math.random() * 900000);

    // Prepare order information with real customer data
    const orderInfo = {
      orderId: orderId,
      customer: customerName, // Use real customer name
      phone: phoneNumber, // Use real phone number
      address: address, // Use real address
      items: cart.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: subtotal,
      deliveryCharge: deliveryCharge,
      specialInstructions: "" // You might want to add a field for special instructions in your AddressForm if needed
    }

    // Send order information to Slack
    try {
      const response = await fetch('/api/send-slack-notification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderInfo),
      })

      if (!response.ok) {
        console.error('Failed to send Slack notification')
      }
    } catch (error) {
      console.error('Error sending Slack notification:', error)
    }

    // Here you would typically update order status, send confirmation, etc.
  }

  const handleUpdateQuantity = (id: string, increment: boolean) => {
    if (!isServiceable) return; // Prevent quantity updates if address is not serviceable
    const item = cart.find(item => item.id === id);
    if (item) {
      const product = products.find(p => p.id.toString() === id);
      if (product) {
        const currentQuantity = item.quantity;
        const newQuantity = increment ? currentQuantity + 1 : Math.max(1, currentQuantity - 1);
        
        if (increment && newQuantity > product.inventory) {
          // Don't allow increasing quantity beyond available inventory
          return;
        }
        
        updateQuantity(id, newQuantity);
      }
    } else {
      console.log(`Item with id ${id} not found in cart`);
    }
  };

  const calculateExpectedDeliveryTime = () => {
    const now = new Date();
    const [minTime, maxTime] = storeConfig.serviceInfo.deliveryTime.split('-').map(t => parseInt(t));
    const averageTime = (minTime + maxTime) / 2;
    const deliveryTime = new Date(now.getTime() + averageTime * 60000);
    return deliveryTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const [nextOpeningTime, setNextOpeningTime] = useState('')
  const [timeUntilOpen, setTimeUntilOpen] = useState('')

  useEffect(() => {
    if (!isStoreOpen) {
      const updateNextOpeningTime = () => {
        const now = new Date()
        const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
        
        let daysToAdd = 0
        let nextDay = currentDay
        
        while (daysToAdd < 7) {
          const { open } = storeConfig.hours[nextDay as DayOfWeek];
          const [openHour, openMinute] = open.split(':').map(Number)
          
          const nextOpenTime = new Date(now)
          nextOpenTime.setDate(now.getDate() + daysToAdd)
          nextOpenTime.setHours(openHour, openMinute, 0, 0)
          
          if (nextOpenTime > now) {
            setNextOpeningTime(nextOpenTime.toLocaleString('en-US', { 
              weekday: 'long', 
              hour: 'numeric', 
              minute: 'numeric', 
              hour12: true 
            }))
            const timeDiff = nextOpenTime.getTime() - now.getTime()
            const hours = Math.floor(timeDiff / (1000 * 60 * 60))
            const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
            setTimeUntilOpen(`${hours}h ${minutes}m`)
            break
          }
          
          daysToAdd++
          nextDay = daysOfWeek[(daysOfWeek.indexOf(nextDay) + 1) % 7]
        }
      }

      updateNextOpeningTime()
      const intervalId = setInterval(updateNextOpeningTime, 60000) // Update every minute
      return () => clearInterval(intervalId)
    }
  }, [isStoreOpen])

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
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[28rem] lg:w-[32rem] bg-white shadow-lg transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out overflow-y-auto z-50`}>
        <div className="p-6 h-full flex flex-col">
          {/* Cart header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <ShoppingCart className="mr-2" size={24} />
              {totalItems > 0 ? `Your Cart (${totalItems} items)` : 'Your Cart'}
            </h2>
            <button onClick={() => setIsCartOpen(false)} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Divider */}
          <div className="border-b border-gray-200 mb-6"></div>

          {paymentSuccess ? (
            <div className="flex-grow flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border border-gray-200">
                <div className="flex items-center justify-center mb-6">
                  <CheckCircle className="text-green-500 w-16 h-16" />
                </div>
                <h3 className="font-bold text-2xl mb-4 text-center">Order Received!</h3>
                <div className="space-y-4">
                  <p className="text-center">Thank you for your order, {firstName}.</p>
                  <p className="text-center font-semibold">
                    We expect to deliver to you by:<br />
                    <span className="text-xl">{expectedDeliveryTime}</span>
                  </p>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    We&apos;ll do our best to meet this time, but please note that actual delivery time may vary due to unforeseen circumstances.
                  </p>
                </div>
                <Button 
                  className="mt-8 w-full"
                  onClick={() => {
                    setPaymentSuccess(false)
                    setIsCartOpen(false)
                  }}
                >
                  Close and Continue Shopping
                </Button>
              </div>
            </div>
          ) : cart.length === 0 ? (
            <div className="flex-grow flex items-center justify-center">
              <p className="text-center text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <>
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
                        disabled={!isServiceable}
                      >
                        -
                      </button>
                      <span className="px-4 py-1 bg-gray-100">{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, true)} 
                        className="px-2 py-1 bg-gray-200 rounded-r"
                        disabled={!isServiceable}
                      >
                        +
                      </button>
                      <button 
                        onClick={() => removeFromCart(item.id)} 
                        className="ml-4 text-gray-500 hover:text-red-500 transition-colors duration-200"
                        disabled={!isServiceable}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order summary and payment section */}
              <div className="mt-auto">
                {/* Order summary */}
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  <h3 className="font-bold text-lg mb-2">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Charge:</span>
                      <span className="font-semibold">${deliveryCharge.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                      <span>Total:</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Invalid address message or Minimum order message or Payment section */}
                {!isStoreOpen && cart.length > 0 ? (
                  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded flex items-start">
                    <AlertCircle className="flex-shrink-0 mr-2 mt-1" size={20} />
                    <div>
                      <p className="font-bold">Store is currently closed</p>
                      <p>We&apos;re sorry, but we are not accepting orders at this time.</p>
                      <div className="flex items-center mt-2 text-gray-600">
                        <Clock className="mr-2 h-5 w-5" />
                        <span>Open again in: {timeUntilOpen}</span>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        Next opening time: {nextOpeningTime}
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    {!isServiceable ? (
                      <InvalidAddressMessage />
                    ) : !isMinOrderMet ? (
                      <MinOrderMessage 
                        minOrderValue={storeConfig.serviceInfo.minOrderValue} 
                        currentSubtotal={subtotal}
                      />
                    ) : (
                      <div className="bg-white p-4 rounded-lg border">
                        <h3 className="font-bold text-lg mb-4">Payment</h3>
                        <Elements stripe={stripePromise}>
                          <CheckoutForm 
                            total={total} 
                            onSuccess={handlePaymentSuccess} 
                            isMinOrderMet={isMinOrderMet}
                            isAddressValid={isServiceable}
                            customerInfo={{
                              name: customerName,
                              phone: phoneNumber,
                              address: address,
                            }}
                            cartItems={cart}
                          />
                        </Elements>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}