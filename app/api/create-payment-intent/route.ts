import { NextResponse } from 'next/server';
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in the environment variables');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-06-20',
});

export async function POST(req: Request) {
  try {
    const { amount, customerInfo, cartItems } = await req.json();

    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Create or update a customer
    let customer;
    const existingCustomers = await stripe.customers.search({
      query: `phone:'${customerInfo.phone}'`,
      limit: 1,
    });

    if (existingCustomers.data.length > 0) {
      customer = existingCustomers.data[0];
      // Update customer information
      customer = await stripe.customers.update(customer.id, {
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address,
        },
        shipping: {
          name: customerInfo.name,
          address: {
            line1: customerInfo.address,
          },
        },
      });
    } else {
      // Create a new customer
      customer = await stripe.customers.create({
        name: customerInfo.name,
        phone: customerInfo.phone,
        address: {
          line1: customerInfo.address,
        },
        shipping: {
          name: customerInfo.name,
          address: {
            line1: customerInfo.address,
          },
        },
      });
    }

    // Format cart items for Stripe metadata
    const formattedItems = cartItems.map((item: { name: string; quantity: number; price: number }, index: number) => 
      `${index + 1}. ${item.name} x${item.quantity} ($${(item.price * item.quantity).toFixed(2)})`
    ).join(', ');

    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'nzd',
      customer: customer.id,
      shipping: {
        name: customerInfo.name,
        address: {
          line1: customerInfo.address,
        },
      },
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        orderItems: formattedItems, // Add this line to include order items
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}