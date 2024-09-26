export const LOW_STOCK_THRESHOLD = 10;
export const SHOW_OUT_OF_STOCK_ITEMS = false;

export const storeConfig = {
  serviceInfo: {
    deliveryTime: '30-45 minutes (usually quicker)',
    serviceArea: [
      { lat: -43.81720801191725, lng: 172.9486885312724 },
      { lat: -43.819168899909535, lng: 172.95331266245057 },
      { lat: -43.81757149299629, lng: 172.96350149594895 },
      { lat: -43.81639861282265, lng: 172.96633333991605 },
      { lat: -43.81378741836043, lng: 172.96811648655432 },
      { lat: -43.81166806579325, lng: 172.96979471338983 },
      { lat: -43.80988922925288, lng: 172.9749870149301 },
      { lat: -43.81284109889333, lng: 172.9815405784605 },
      { lat: -43.80941120070302, lng: 172.9877168800944 },
      { lat: -43.80396579825658, lng: 172.98856214623441 },
      { lat: -43.80067372203656, lng: 172.97818459073756 },
      { lat: -43.794773500703045, lng: 172.98231963864106 },
      { lat: -43.79431919193002, lng: 172.98069554776106 },
      { lat: -43.7926918269366, lng: 172.97776116219637 },
      { lat: -43.79049602753887, lng: 172.97634685532876 },
      { lat: -43.79038231723703, lng: 172.9737783792396 },
      { lat: -43.791555196873475, lng: 172.9728872986828 },
      { lat: -43.79159224419078, lng: 172.970266327994 },
      { lat: -43.79140297600367, lng: 172.96738293792208 },
      { lat: -43.793786078901135, lng: 172.96811677039898 },
      { lat: -43.79729993737763, lng: 172.9638182498553 },
      { lat: -43.798091350165514, lng: 172.96468616768732 },
      { lat: -43.79888320762746, lng: 172.9650327475402 },
      { lat: -43.79900952555007, lng: 172.96654044954204 },
      { lat: -43.80009699173065, lng: 172.96758393466536 },
      { lat: -43.80302672273154, lng: 172.96700430461158 },
      { lat: -43.80444888626435, lng: 172.96543862685553 },
      { lat: -43.8064155759915, lng: 172.96607642147853 },
      { lat: -43.80762994757374, lng: 172.96526637623964 },
      { lat: -43.807880905089796, lng: 172.96439703637145 },
      { lat: -43.8085495758888, lng: 172.9614960837959 },
      { lat: -43.812147003698286, lng: 172.95865898451973 },
      { lat: -43.81189644494383, lng: 172.95628018320798 },
      { lat: -43.81352741319826, lng: 172.95494866679007 },
      { lat: -43.81482526882946, lng: 172.95140830128366 },
      { lat: -43.81478363342541, lng: 172.9497841321542 },
      { lat: -43.814992690340546, lng: 172.9483351669678 },
      { lat: -43.81720801191725, lng: 172.9486885312724 }
    ],
    minOrderValue: 10,
    deliveryCharge: 10
  },
  hours: {
    monday: { open: '07:30', close: '17:40' },
    tuesday: { open: '15:08', close: '23:00' },
    wednesday: { open: '08:00', close: '23:00' },
    thursday: { open: '14:37', close: '21:40' },
    friday: { open: '08:08', close: '00:00' },
    saturday: { open: '05:46', close: '22:30' },
    sunday: { open: '14:00', close: '20:12' },
  },
};

// Add this new configuration object
export const siteInfo = {
  name: 'NightOwl',
  title: 'NightOwl - Late Night Delivery Service',
  shortDescription: 'NightOwl is a delivery only service.',
  longDescription: 'NightOwl is your reliable solution for groceries, household essentials, and more when traditional stores are closed. We partner with local shops to provide you access to the products you need outside regular business hours. Our service operates during peak demand periods, expanding as we grow to meet your needs.<br>Getting started is easy. Simply add your details (name, address, and phone number) to check if we can service your area. With NightOwl, you are just a few steps away from having essential items delivered when you need them most,',
  supportEmail: 'support@nightowl.com',
  supportPhone: '(0800) 123-4567',
  socialMedia: {
    facebook: 'https://facebook.com/nightowl',
    twitter: 'https://twitter.com/nightowl',
    instagram: 'https://instagram.com/nightowl',
  },
};

export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  image: string | null;
  inventory: number;
  visible: boolean;
  category_id: string;
  category_name: string;
  supplier: string | null;
  description?: string;
}
