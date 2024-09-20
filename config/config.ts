export const LOW_STOCK_THRESHOLD = 10;
export const SHOW_OUT_OF_STOCK_ITEMS = true;

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
    friday: { open: '21:50', close: '00:00' }, // Open until midnight
    saturday: { open: '05:00', close: '00:00' }, // Open until midnight
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

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  inventory: number;
  visible: boolean;
}
