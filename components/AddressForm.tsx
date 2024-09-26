import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit } from 'lucide-react'
import { useAddress } from '../context/AddressContext';
import { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { User, Phone, MapPin } from 'lucide-react'

interface AddressFormProps {
  setAddressEntered: (value: boolean) => void;
  checkServiceability: (address: string) => Promise<void>;
  setAddressChanged: (value: boolean) => void;
  setPhoneNumberEntered: (value: boolean) => void;
  serviceInfo: {
    deliveryTime: string;
    minOrderValue: number;
    deliveryCharge: number;
  };
}

const AddressForm: React.FC<AddressFormProps> = ({
  setAddressEntered,
  checkServiceability,
  setAddressChanged,
  setPhoneNumberEntered,
}) => {
  const { 
    address, 
    setAddress, 
    phoneNumber, 
    setPhoneNumber, 
    isServiceable, 
    setIsServiceable,
    isVerified,
    setIsVerified,
    customerName,
    setCustomerName
  } = useAddress();

  const [isEditing, setIsEditing] = useState(!isVerified);
  const lastCheckedAddress = useRef('');
  const addressInputRef = useRef<HTMLInputElement>(null);
  const [isAddressValid, setIsAddressValid] = useState(true);

  const initializeAutocomplete = useCallback(() => {
    console.log('Initializing autocomplete');
    if (!window.google) {
      console.error('Google Maps JavaScript API not loaded');
      return;
    }

    if (addressInputRef.current) {
      const autocompleteInstance = new google.maps.places.Autocomplete(addressInputRef.current, {
        componentRestrictions: { country: "NZ" },
        fields: ["address_components", "formatted_address"],
      });

      autocompleteInstance.addListener("place_changed", () => {
        const place = autocompleteInstance.getPlace();
        if (place.formatted_address) {
          console.log('Place selected:', place.formatted_address);
          setAddress(place.formatted_address);
          setAddressChanged(true);
          setIsVerified(false);
        }
      });

      console.log('Autocomplete initialized');
    } else {
      console.error('Address input ref not available');
    }
  }, [setAddress, setAddressChanged, setIsVerified]);

  useEffect(() => {
    console.log('Effect running, isEditing:', isEditing);

    if (!isEditing) return; // Only initialize when editing

    console.log('Loading Google Maps API');
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: "weekly",
      libraries: ["places"]
    });

    loader.load().then(() => {
      console.log('Google Maps API loaded');
      initializeAutocomplete();
    }).catch(error => {
      console.error('Error loading Google Maps API:', error);
    });

    // Capture the current ref value
    const currentInputRef = addressInputRef.current;

    // Cleanup function
    return () => {
      if (window.google && window.google.maps && window.google.maps.event && currentInputRef) {
        console.log('Cleaning up autocomplete');
        window.google.maps.event.clearInstanceListeners(currentInputRef);
      }
    };
  }, [isEditing, initializeAutocomplete]);

  useEffect(() => {
    if (isServiceable === false) {
      setIsAddressValid(false);
      setIsEditing(true);
      setIsVerified(false);
    } else {
      setIsAddressValid(true);
    }
  }, [isServiceable, setIsVerified]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddressEntered(true);
    setAddressChanged(false);
    setIsVerified(true);
    
    // Only check serviceability if the address has changed
    if (address !== lastCheckedAddress.current) {
      await checkServiceability(address);
      lastCheckedAddress.current = address;
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsServiceable(null);
    setAddressChanged(true);
    setIsVerified(false);
  }

  const formatPhoneNumber = (number: string): string => {
    const digits = number.replace(/\D/g, '');
    if (digits.startsWith('02')) {
      return digits.replace(/(\d{3})(\d{4})(\d*)/, '$1 $2 $3').trim();
    } else {
      return digits.replace(/(\d{2})(\d{3})(\d*)/, '$1 $2 $3').trim();
    }
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedNumber = formatPhoneNumber(e.target.value);
    setPhoneNumber(formattedNumber);
    setPhoneNumberEntered(formattedNumber.trim() !== '');
  }

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {  // Add this function
    setCustomerName(e.target.value);
  }

  const handleEdit = () => {
    console.log('Edit button clicked, current isEditing:', isEditing);
    setIsEditing(true);
    console.log('setIsEditing(true) called');
    setIsVerified(false);
  };

  console.log('Rendering AddressForm, isEditing:', isEditing);

  return (
    <Card className={`border-2 ${isVerified ? 'border-gray-300' : 'border-blue-500'} shadow-lg p-4 sm:p-6`}>
      <CardHeader>
        <CardTitle className={`text-xl sm:text-2xl font-bold ${isVerified ? 'text-gray-600' : 'text-blue-600'}`}>
          {isVerified ? 'Delivery Details' : 'Get Started'}
        </CardTitle>
        {!isVerified && (
          <CardDescription className="text-sm sm:text-base text-gray-700">
            NightOwl is a delivery-only service. Please enter your name, address, and phone number to get started.
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isServiceable !== null && (
          <div className={`mb-4 p-4 border rounded-md ${
            isServiceable 
              ? 'bg-green-100 border-green-400 text-green-700' 
              : 'bg-red-100 border-red-400 text-red-700'
          }`}>
            <span className="font-medium">
              {isServiceable 
                ? 'Great news! We can deliver to you. Start shopping below.' 
                : 'We are sorry but your address is not within our delivery area.'}
            </span>
          </div>
        )}
        {(!isVerified || isEditing) && (
          <form onSubmit={handleSubmit}>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-4">
                <Label htmlFor="customerDetails">Name, Address, and Phone Number</Label>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Input
                    id="customerName"
                    placeholder="Name"
                    value={customerName}
                    onChange={handleCustomerNameChange}
                    className="bg-blue-50"
                  />
                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    className="bg-blue-50"
                  />
                </div>
                <Input
                  id="address"
                  placeholder="Full Address"
                  value={address}
                  onChange={handleAddressChange}
                  className={`sm:col-span-2 bg-blue-50 ${!isAddressValid ? 'border-red-500' : ''}`}
                  ref={addressInputRef}
                />
                {!isAddressValid && (
                  <p className="text-red-500 text-sm">Please enter a valid address within our delivery area.</p>
                )}
                <Button 
                  type="submit" 
                  disabled={address.trim() === '' || phoneNumber.trim() === '' || customerName.trim() === ''}
                  className="w-full bg-blue-500 text-white"
                >
                  Check Details
                </Button>
              </div>
            </div>
          </form>
        )}
        {isVerified && !isEditing && (
          <>
            <div className="bg-gray-50 p-3 rounded-lg shadow-sm mb-4">
              <div className="space-y-1">
                <div className="flex items-center">
                  <User className="text-blue-500 mr-2" size={14} />
                  <p className="text-sm">{customerName}</p>
                </div>
                <div className="flex items-center">
                  <Phone className="text-blue-500 mr-2" size={14} />
                  <p className="text-sm">{phoneNumber}</p>
                </div>
                <div className="flex items-start">
                  <MapPin className="text-blue-500 mr-2 mt-0.5" size={14} />
                  <p className="text-sm">{address}</p>
                </div>
              </div>
            </div>
            <Button 
              onClick={handleEdit} 
              variant="outline"
              className="w-full mt-4 px-6 py-3 text-blue-600 border-blue-600 hover:bg-blue-50 transition-colors duration-300 flex items-center justify-center"
            >
              <Edit className="mr-2 h-5 w-5" />
              Change Details
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default AddressForm
