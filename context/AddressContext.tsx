"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AddressContextType {
  address: string;
  setAddress: (address: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phoneNumber: string) => void;
  isServiceable: boolean | null;
  setIsServiceable: (isServiceable: boolean | null) => void;
  isVerified: boolean;
  setIsVerified: (isVerified: boolean) => void;
  customerName: string;
  setCustomerName: (customerName: string) => void;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isServiceable, setIsServiceable] = useState<boolean | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [customerName, setCustomerName] = useState('');

  return (
    <AddressContext.Provider value={{
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