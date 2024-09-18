import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Check, X } from 'lucide-react'
import { useAddress } from '../context/AddressContext';

type ServiceInfo = {
  deliveryTime: string;
  serviceArea: string;
  minOrderValue: number;
}

type AddressFormProps = {
  addressEntered: boolean
  setAddressEntered: (addressEntered: boolean) => void
  checkServiceability: () => Promise<void>;
  setAddressChanged: React.Dispatch<React.SetStateAction<boolean>>;
  setPhoneNumberEntered: (phoneNumberEntered: boolean) => void;
  serviceInfo: ServiceInfo;
}

const AddressForm: React.FC<AddressFormProps> = ({
  addressEntered,
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
    customerName,  // Add this line
    setCustomerName  // Add this line
  } = useAddress();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (address.trim() !== '' && phoneNumber.trim() !== '' && customerName.trim() !== '') {  // Update this line
      setAddressEntered(true);
      setIsServiceable(null);
      await checkServiceability();
      setIsVerified(true);
    }
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
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
                  placeholder="Full Name"
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
                <Button 
                  type="submit" 
                  disabled={isVerified || address.trim() === '' || phoneNumber.trim() === '' || customerName.trim() === ''}
                  className={`lg:col-span-4 ${isVerified ? 'bg-gray-300 text-gray-600' : 'bg-blue-500 text-white'}`}
                >
                  {isVerified ? "Verified" : "Verify Details"}
                </Button>
              </div>
            </div>
          </div>
        </form>
        {addressEntered && (
          <div className="mt-4 p-4 rounded-md border">
            {isServiceable === true && (
              <div className="flex items-center text-green-600">
                <Check className="mr-2 h-5 w-5" />
                <span className="font-medium">Great news! We can deliver to you. Start shopping below.</span>
              </div>
            )}
            {isServiceable === false && (
              <div className="flex items-center text-red-600">
                <X className="mr-2 h-5 w-5" />
                <span className="font-medium">We&apos;re sorry, we can&apos;t deliver to your area at this time.</span>
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
            <li>Service area: {serviceInfo.serviceArea}</li>
            <li>Minimum order value: ${serviceInfo.minOrderValue.toFixed(2)}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default AddressForm
