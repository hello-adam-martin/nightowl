export const storeConfig = {
  serviceInfo: {
    deliveryTime: '30-45 minutes (usually quicker)',
    serviceArea: 'Akaroa Township',
    minOrderValue: 10,
    deliveryCharge: 10
  },
  hours: {
    monday: { open: '08:00', close: '23:00' },
    tuesday: { open: '08:00', close: '23:00' },
    wednesday: { open: '08:00', close: '23:00' },
    thursday: { open: '16:00', close: '21:40' },
    friday: { open: '16:00', close: '00:00' }, // Open until midnight
    saturday: { open: '09:00', close: '00:00' }, // Open until midnight
    sunday: { open: '09:00', close: '22:00' },
  },
};

// Add this new configuration object
export const siteInfo = {
  name: 'NightOwl',
  shortDescription: 'NightOwl is a delivery only service.',
  longDescription: 'NightOwl is your convenient delivery service, offering groceries, household essentials, and more whenever you need them. With quick and reliable deliveries, we are here to make sure you have what you need, when you need it.',
  supportEmail: 'support@nightowl.com',
  supportPhone: '(0800) 123-4567',
  socialMedia: {
    facebook: 'https://facebook.com/nightowl',
    twitter: 'https://twitter.com/nightowl',
    instagram: 'https://instagram.com/nightowl',
  },
};

export const categories = [
  { id: 'all', name: 'All Items' },
  { id: 'health', name: 'Health & Wellness' },
  { id: 'food', name: 'Food & Beverages' },
  { id: 'household', name: 'Household Essentials' },
  { id: 'personal', name: 'Personal Care' },
  { id: 'pet', name: 'Pet Supplies' },
  { id: 'tech', name: 'Tech Accessories' },
  { id: 'tobacco', name: 'Tobacco & Alcohol' },
  { id: 'seasonal', name: 'Seasonal Items' },
  { id: 'convenience', name: 'Convenience Items' }
];

export const products = [
  // Health & Wellness
  { id: 1, name: 'Pain Reliever', category: 'health', price: 5.99, image: null },
  { id: 2, name: 'Cold & Flu Medicine', category: 'health', price: 8.99, image: null },
  { id: 3, name: 'Allergy Medication', category: 'health', price: 12.99, image: null },
  { id: 4, name: 'First Aid Kit', category: 'health', price: 15.99, image: null },
  { id: 5, name: 'Bandages', category: 'health', price: 3.99, image: null },

  // Food & Beverages
  { id: 6, name: 'Ready-to-eat Sandwich', category: 'food', price: 4.99, image: null },
  { id: 7, name: 'Microwaveable Meal', category: 'food', price: 5.99, image: null },
  { id: 8, name: 'Energy Drink', category: 'food', price: 2.99, image: null },
  { id: 9, name: 'Bottled Water', category: 'food', price: 1.99, image: null },
  { id: 10, name: 'Chips', category: 'food', price: 3.49, image: null },
  { id: 11, name: 'Energy Bars', category: 'food', price: 2.49, image: null },
  { id: 12, name: 'Baby Formula', category: 'food', price: 17.99, image: null },

  // Household Essentials
  { id: 13, name: 'All-purpose Cleaner', category: 'household', price: 4.99, image: null },
  { id: 14, name: 'Paper Towels', category: 'household', price: 3.99, image: null },
  { id: 15, name: 'Trash Bags', category: 'household', price: 5.99, image: null },
  { id: 16, name: 'AA Batteries', category: 'household', price: 7.99, image: 'aabatteries.jpeg' },
  { id: 17, name: 'Light Bulbs', category: 'household', price: 4.99, image: null },
  { id: 18, name: 'Multi-tool', category: 'household', price: 12.99, image: null },
  { id: 99, name: 'Lighter', category: 'household', price: 5.99, image: null },

  // Personal Care
  { id: 19, name: 'Toothpaste', category: 'personal', price: 3.99, image: null },
  { id: 20, name: 'Deodorant', category: 'personal', price: 4.99, image: null },
  { id: 21, name: 'Feminine Hygiene Products', category: 'personal', price: 6.99, image: null },
  { id: 22, name: 'Diapers', category: 'personal', price: 12.99, image: null },
  { id: 23, name: 'Baby Wipes', category: 'personal', price: 3.99, image: null },
  { id: 24, name: 'Condoms', category: 'personal', price: 9.99, image: null },
  { id: 25, name: 'Lip Balm', category: 'personal', price: 2.99, image: null },

  // Pet Supplies
  { id: 26, name: 'Dog Food (Small Bag)', category: 'pet', price: 8.99, image: null },
  { id: 27, name: 'Cat Food (Small Bag)', category: 'pet', price: 7.99, image: null },
  { id: 28, name: 'Cat Litter', category: 'pet', price: 9.99, image: null },

  // Tech Accessories
  { id: 29, name: 'Phone Charger', category: 'tech', price: 14.99, image: null },
  { id: 30, name: 'Portable Power Bank', category: 'tech', price: 24.99, image: null },

  // Tobacco & Alcohol
  { id: 31, name: 'Cigarettes', category: 'tobacco', price: 8.99, image: null },
  { id: 32, name: 'Beer 6-pack', category: 'tobacco', price: 9.99, image: null },
  { id: 33, name: 'Wine Bottle', category: 'tobacco', price: 12.99, image: null },

  // Seasonal Items
  { id: 34, name: 'Sunscreen', category: 'seasonal', price: 8.99, image: null },
  { id: 35, name: 'Hand Warmers', category: 'seasonal', price: 3.99, image: null },

  // Convenience Items
  { id: 36, name: 'Gift Card', category: 'convenience', price: 25.00, image: null },
  { id: 37, name: 'Stamps', category: 'convenience', price: 11.00, image: null },
  { id: 38, name: 'Pen', category: 'convenience', price: 1.99, image: null },
  { id: 39, name: 'Notepad', category: 'convenience', price: 2.99, image: null }
];
