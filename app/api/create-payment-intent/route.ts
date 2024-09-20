import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest available API version
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  const { amount, customerInfo, cartItems } = await req.json()

  try {
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'nzd',
    })

    // Create order and update inventory using a Supabase function
    const { data: orderData, error: orderError } = await supabase.rpc('create_order_and_items', {
      p_customer_name: customerInfo.name,
      p_phone: customerInfo.phone,
      p_address: customerInfo.address,
      p_total: amount / 100, // Convert cents to dollars
      p_delivery_charge: 10, // Assuming fixed delivery charge
      p_status: 'pending',
      p_stripe_payment_intent_id: paymentIntent.id,
      p_cart_items: cartItems
    })

    if (orderError) {
      throw orderError
    }

    return NextResponse.json({ 
      clientSecret: paymentIntent.client_secret,
      orderId: orderData.order_id
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json({ error: 'An error occurred while processing your order' }, { status: 500 })
  }
}