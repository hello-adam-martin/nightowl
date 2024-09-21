export const LOW_STOCK_THRESHOLD = 10;
export const SHOW_OUT_OF_STOCK_ITEMS = true;

export const storeConfig = {
  serviceInfo: {
    deliveryTime: '30-45 minutes (usually quicker)',
    serviceArea: [
      { lat: -43.79766940765112, lng: 172.96398227508365 },
      { lat: -43.817437006348506, lng: 172.94562088651645 },
      { lat: -43.82053879407215, lng: 172.96333877661004 },
      { lat: -43.81464260126724, lng: 172.98003006050743 },
      { lat: -43.81050846182929, lng: 172.98443674119318 },
      { lat: -43.803337709593436, lng: 172.98200671966424 },
      { lat: -43.79742160076273, lng: 172.97797267730726 },
      { lat: -43.79485054364922, lng: 172.9650980740346 },
      { lat: -43.79766940765112, lng: 172.96398227508365 }
    ],
    minOrderValue: 10,
    deliveryCharge: 10
  },
  hours: {
    monday: { open: '08:00', close: '23:00' },
    tuesday: { open: '08:00', close: '23:00' },
    wednesday: { open: '08:00', close: '23:00' },
    thursday: { open: '16:00', close: '21:40' },
    friday: { open: '21:50', close: '00:00' }, // Open until midnight
    saturday: { open: '05:46', close: '20:30' }, // Open until midnight
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
