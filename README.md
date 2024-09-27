# NightOwl

NightOwl is a Next.js-based web application for a late-night delivery service. It allows users to browse products, add items to their cart, and place orders for delivery within a specified service area, with a focus on providing essential services during off-hours.

## Unique Features

- **Dynamic Store Hours**: Real-time store status updates based on configurable operating hours.
- **Automatic Order Top-Up**: Automatically adds a top-up amount to meet the minimum order value.
- **Countdown to Store Opening**: Displays a countdown timer when the store is closed, showing when it will open next.
- **Flexible Service Area**: Configurable service area using geolocation coordinates.
- **Local Business Integration**: Supports partnerships with local businesses, showcasing community involvement.

## Core Features

- Product browsing with category filtering
- Cart management
- Address verification and serviceability check
- Secure payment processing with Stripe
- Responsive design for mobile and desktop

## Technologies Used

- [Next.js](https://nextjs.org/) - React framework for server-side rendering and static site generation
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Stripe](https://stripe.com/) - Payment processing
- Custom UI components (based on shadcn/ui)

## Getting Started

1. Clone the repository:
   ```
   git clone https://github.com/your-username/nightowl.git
   cd nightowl
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```

4. Run the development server:
   ```
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

- `app/`: Next.js app directory containing pages and layouts
- `components/`: Reusable React components
- `context/`: React context providers for state management
- `config/`: Configuration files for store settings
- `utils/`: Utility functions and helpers
- `public/`: Static assets
- `types/`: TypeScript type definitions

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the [MIT License](LICENSE).
