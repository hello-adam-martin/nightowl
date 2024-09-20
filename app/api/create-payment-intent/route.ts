import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'
import { NextResponse } from 'next/server'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest available API version
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  const { amount, customerInfo, cartItems } = await req.json()

  // Get the user ID from the session (if authenticated)
  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id || null  // Will be null for guest checkouts

  try {
    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    })

    // Insert order into database
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        customer_name: customerInfo.name,
        phone: customerInfo.phone,
        address: customerInfo.address,
        total: amount / 100, // Convert cents to dollars
        delivery_charge: 10, // Assuming fixed delivery charge
        status: 'pending',
        stripe_payment_intent_id: paymentIntent.id,
        user_id: userId
      })
      .select()

    if (orderError) throw orderError

    // Insert order items
    const orderItems = cartItems.map((item: { id: string; quantity: number; price: number }) => ({
      order_id: order![0].id,
      product_id: parseInt(item.id),
      quantity: item.quantity,
      price: item.price,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 })
  }
}