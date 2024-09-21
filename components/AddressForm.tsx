import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
import { useAddress } from '../context/AddressContext';
import { useState, useEffect } from 'react';

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
  serviceInfo,
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

  const [rememberAddress, setRememberAddress] = useState(false);

  useEffect(() => {
    const savedAddress = localStorage.getItem('savedAddress');
    if (savedAddress) {
      const parsedAddress = JSON.parse(savedAddress);
      setAddress(parsedAddress.address);
      setPhoneNumber(parsedAddress.phoneNumber);
      setCustomerName(parsedAddress.customerName);
      setRememberAddress(true);
      setAddressEntered(true);
      setIsVerified(true);
      checkServiceability(parsedAddress.address);
    }
  }, [setAddress, setPhoneNumber, setCustomerName, setAddressEntered, setIsVerified, checkServiceability]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddressEntered(true);
    setAddressChanged(false);
    setIsVerified(true);
    await checkServiceability(address);
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAddress = e.target.value;
    setAddress(newAddress);
    setIsServiceable(null);
    setAddressChanged(true);
    setIsVerified(false);
  }

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value)
    setPhoneNumberEntered(e.target.value.trim() !== '')
  }

  const handleCustomerNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {  // Add this function
    setCustomerName(e.target.value);
  }

  const handleRememberAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newRememberAddress = e.target.checked;
    setRememberAddress(newRememberAddress);
    
    if (newRememberAddress) {
      localStorage.setItem('savedAddress', JSON.stringify({ address, phoneNumber, customerName }));
    } else {
      localStorage.removeItem('savedAddress');
    }
  }

  return (
    <Card className={`border-2 ${isVerified ? 'border-gray-300' : 'border-blue-500'} shadow-lg p-4 sm:p-6`}>
      <CardHeader>
        <CardTitle className={`text-xl sm:text-2xl font-bold ${isVerified ? 'text-gray-600' : 'text-blue-600'}`}>Get Started</CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-700">NightOwl is a delivery-only service. Please enter your name, address, and phone number to get started.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="customerDetails">Name, Address, and Phone Number</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <Input
                  id="customerName"
                  placeholder="Name"
                  value={customerName}
                  onChange={handleCustomerNameChange}
                  className={`${isVerified ? 'bg-gray-100' : 'bg-blue-50'}`}
                />
                <Input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  className={`${isVerified ? 'bg-gray-100' : 'bg-blue-50'}`}
                />
                <Input
                  id="address"
                  placeholder="Full Address"
                  value={address}
                  onChange={handleAddressChange}
                  className={`sm:col-span-2 ${isVerified ? 'bg-gray-100' : 'bg-blue-50'}`}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isVerified || address.trim() === '' || phoneNumber.trim() === '' || customerName.trim() === ''}
                className={`w-full mt-4 ${isVerified ? (isServiceable ? 'bg-gray-300 text-gray-600' : 'bg-red-500 text-white') : 'bg-blue-500 text-white'}`}
              >
                {isVerified 
                  ? (isServiceable 
                    ? "Address Verified" 
                    : "Not Serviceable")
                  : "Check Details"
                }
              </Button>
            </div>
          </div>
        </form>
        {isVerified && (
          <div className="mt-4 p-4 rounded-md border">
            {isServiceable === true && (
              <div>
                <div className="flex items-center text-green-600">
                  <Check className="mr-2 h-5 w-5" />
                  <span className="font-medium">Great news! We can deliver to you. Start shopping below.</span>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <input
                    type="checkbox"
                    id="rememberAddress"
                    checked={rememberAddress}
                    onChange={handleRememberAddressChange}
                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  />
                  <label
                    htmlFor="rememberAddress"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Remember my address
                  </label>
                </div>
              </div>
            )}
            {isServiceable === false && (
              <div className="flex items-center text-red-600">
                <X className="mr-2 h-5 w-5" />
                <span className="font-medium">We are sorry but we cannot deliver to your address at this time.</span>
              </div>
            )}
            {isServiceable === null && (
              <div className="flex items-center text-yellow-600">
                <span className="font-medium">Checking serviceability...</span>
              </div>
            )}
          </div>
        )}
        <div className="mt-4 p-4 bg-blue-50 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Service Information</h3>
          <ul className="list-disc list-inside text-sm">
            <li>Estimated delivery time: {serviceInfo.deliveryTime}</li>
            <li>Service area: Akaroa</li>
            <li>Minimum order value: ${serviceInfo.minOrderValue.toFixed(2)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddressForm
