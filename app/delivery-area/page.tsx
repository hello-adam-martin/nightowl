'use client';

import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Polygon, Autocomplete, Marker } from '@react-google-maps/api';
import { storeConfig } from '@/config/config';
import TopBar from '@/components/TopBar';
import Cart from '@/components/Cart';
import { useCart } from '@/context/CartContext';
import { useAddress } from '@/context/AddressContext';
import { Libraries } from '@react-google-maps/api';
import { Check, X } from 'lucide-react';

interface LatLng {
  lat: number;
  lng: number;
}

const libraries: Libraries = ["places", "geometry"];

const DeliveryAreaPage = () => {
  const [address, setAddress] = useState('');
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(null);
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { cart, updateQuantity: contextUpdateQuantity, removeFromCart } = useCart();

  const { isServiceable: isAddressValid } = useAddress();

  const center = useMemo(() => ({
    lat: -43.8031,
    lng: 172.9665,
  }), []);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries: libraries,
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const checkServiceability = useCallback((position: LatLng) => {
    const polygon = new google.maps.Polygon({ paths: storeConfig.serviceInfo.serviceArea });
    const isInside = google.maps.geometry.poly.containsLocation(
      new google.maps.LatLng(position.lat, position.lng),
      polygon
    );
    setIsServiceable(isInside);
  }, []);

  const onPlaceChanged = useCallback(() => {
    const autocomplete = autocompleteRef.current;
    if (autocomplete !== null) {
      const place = autocomplete.getPlace();
      setAddress(place.formatted_address || '');
      const newPosition = {
        lat: place.geometry?.location?.lat() ?? 0,
        lng: place.geometry?.location?.lng() ?? 0,
      };
      setMarkerPosition(newPosition);
      checkServiceability(newPosition);
      
      if (map) {
        map.panTo(newPosition);
        map.setZoom(15);
      }
    }
  }, [map, checkServiceability]);

  const autocompleteOptions = useMemo(() => ({
    componentRestrictions: { country: "nz" },
    fields: ["address_components", "geometry", "formatted_address"],
    types: ["address"],
  }), []);

  useEffect(() => {
    const checkStoreStatus = () => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() as keyof typeof storeConfig.hours;
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const hours = storeConfig.hours[currentDay];
      
      if (!hours) {
        setIsStoreOpen(false);
        return;
      }

      const [openHour, openMinute] = hours.open.split(':').map(Number);
      const [closeHour, closeMinute] = hours.close.split(':').map(Number);
      
      const currentTime = currentHour * 60 + currentMinute;
      const openTime = openHour * 60 + openMinute;
      let closeTime = closeHour * 60 + closeMinute;
      
      if (closeTime <= openTime) {
        closeTime += 24 * 60;
      }

      setIsStoreOpen(currentTime >= openTime && currentTime < closeTime);
    };

    checkStoreStatus();
    const timer = setInterval(checkStoreStatus, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateQuantity = useCallback((id: string, increment: boolean) => {
    const item = cart.find(item => item.id === id);
    if (item) {
      contextUpdateQuantity(id, increment ? item.quantity + 1 : item.quantity - 1);
    }
  }, [cart, contextUpdateQuantity]);

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <TopBar 
        currentPage="delivery-area" 
        isCartOpen={isCartOpen} 
        setIsCartOpen={setIsCartOpen}
      />

      <div className="pt-20 p-8">
        <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-6">Delivery Area</h2>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <GoogleMap
                mapContainerStyle={{ width: '100%', height: '400px' }}
                center={center}
                zoom={13}
                onLoad={onMapLoad}
              >
                <Polygon
                  paths={storeConfig.serviceInfo.serviceArea}
                  options={{
                    fillColor: "lightblue",
                    fillOpacity: 0.3,
                    strokeColor: "blue",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                  }}
                />
                {markerPosition && (
                  <Marker
                    position={markerPosition}
                    title="Selected Location"
                  />
                )}
              </GoogleMap>
            </div>

            <div className="md:w-1/3">
              <h3 className="text-xl font-semibold mb-4">Check Your Address</h3>
              <Autocomplete
                onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                onPlaceChanged={onPlaceChanged}
                options={autocompleteOptions}
              >
                <input
                  type="text"
                  placeholder="Enter your address"
                  className="w-full p-2 border rounded"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </Autocomplete>
              {address && isServiceable !== null && (
                <div className="mt-4 p-4 rounded-md border">
                  {isServiceable ? (
                    <div className="flex items-center text-green-600">
                      <Check className="mr-2 h-5 w-5" />
                      <span className="font-medium">Great news! We can deliver to you.</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600">
                      <X className="mr-2 h-5 w-5" />
                      <span className="font-medium">We are sorry but your address is not within our delivery area.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Cart
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        isStoreOpen={isStoreOpen}
        cart={cart}
        isAddressValid={isAddressValid ?? false}
        updateQuantity={updateQuantity}
        removeFromCart={removeFromCart}
        getTotalPrice={getTotalPrice}
        deliveryCharge={storeConfig.serviceInfo.deliveryCharge}
      />
    </div>
  );
};

export default DeliveryAreaPage;