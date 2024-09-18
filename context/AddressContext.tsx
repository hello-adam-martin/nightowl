"use client";

import React, { createContext, useState, useContext } from 'react';

type AddressContextType = {
  address: string;
  setAddress: (address: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  isServiceable: boolean | null;
  setIsServiceable: (isServiceable: boolean | null) => void;
  isAddressValid: boolean;
  setIsAddressValid: (isAddressValid: boolean) => void;
  isVerified: boolean;
  setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
  customerName: string;
  setCustomerName: React.Dispatch<React.SetStateAction<string>>;
};

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState('');

  return (
    <AddressContext.Provider value={{ 
      address, 
      setAddress, 
      phoneNumber, 
      setPhoneNumber, 
      isServiceable, 
      setIsServiceable,
      isAddressValid,
      setIsAddressValid,
      isVerified,
      setIsVerified,
      customerName,
      setCustomerName
    }}>
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (context === undefined) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};