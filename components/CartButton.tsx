import React from 'react'
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'

interface CartButtonProps {
  isCartOpen: boolean;
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  itemCount: number;  // Change this from totalItems to itemCount
}

const CartButton: React.FC<CartButtonProps> = React.memo(({ isCartOpen, setIsCartOpen, itemCount }) => {
  
  return (
    <Button onClick={() => setIsCartOpen(!isCartOpen)} variant="outline" className="relative">
      <ShoppingCart className="h-4 w-4 mr-2" />
      Cart
      {itemCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {itemCount}
        </span>
      )}
    </Button>
  )
});

CartButton.displayName = 'CartButton';

export default CartButton;