# How NightOwl Works

NightOwl is a Next.js-based web application for a late-night delivery service. This document explains the key components and functionality of the application.

## Project Structure

The project follows a typical Next.js structure:

- `app/`: Contains the main application pages and layouts
- `components/`: Houses reusable React components
- `context/`: Stores React context providers for state management
- `lib/`: Contains utility functions and helpers
- `public/`: Holds static assets
- `types/`: Defines TypeScript type definitions
- `config/`: Stores configuration files

## Key Components

### 1. HomePage Component

The HomePage component (`app/home/page.tsx`) is the main entry point of the application. It handles:

- Displaying the welcome section and store information
- Managing the store status (open/closed)
- Rendering the AddressForm or ClosedStoreNotice based on store status
- Displaying the ProductGrid

### 2. Cart Component

The Cart component (`components/Cart.tsx`) manages the shopping cart functionality, including:

- Displaying cart items
- Updating item quantities
- Removing items from the cart
- Handling the checkout process
- Calculating expected delivery time
- Sending order information to Slack

### 3. AddressForm Component

The AddressForm component handles user address input and validation. It works in conjunction with the AddressContext to manage address-related state across the application.

### 4. ProductGrid Component

The ProductGrid component displays the list of available products, allowing users to add items to their cart.

### 5. TopBar Component

The TopBar component (`components/TopBar.tsx`) displays the current store status and cart information.

## State Management

The application uses React Context for state management:

1. CartContext: Manages the shopping cart state.
2. AddressContext: Handles address-related state.

## API Integration

The application interacts with a backend API for various functionalities:

1. Fetching products: Uses Supabase to fetch product data (`app/api/products/route.ts`)
2. Creating payment intents for Stripe integration
3. Sending order notifications to Slack

## Styling

The application uses Tailwind CSS for styling, with custom configurations defined in `tailwind.config.ts`. Custom UI components are built using shadcn/ui, a collection of re-usable components built with Radix UI and Tailwind CSS.

## Configuration

The `config/config.ts` file contains various configuration settings for the application, including:

- Store hours
- Service area information
- Minimum order value
- Delivery charge

## Deployment

The application is designed to be deployed on platforms like Vercel, which offer seamless integration with Next.js applications.

## Summary

NightOwl leverages Next.js, React, and various modern web technologies to create a responsive and user-friendly late-night delivery service application. The modular structure, use of React contexts for state management, and integration with services like Supabase and Stripe allow for easy maintenance and scalability.
