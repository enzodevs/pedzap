
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';

const FloatingCartButton = () => {
  const { totalItems, totalPrice, toggleCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30">
      <button
        onClick={toggleCart}
        className="bg-ifacens-primary text-white py-2 px-4 rounded-full shadow-lg flex items-center space-x-2 hover:bg-ifacens-primary/90 transition-all"
      >
        <div className="relative">
          <ShoppingBag className="h-5 w-5" />
          <span className="absolute -top-2 -right-2 bg-white text-ifacens-primary text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <span className="text-sm font-medium">Ver Sacola</span>
        <span className="text-sm font-bold">{formatCurrency(totalPrice)}</span>
      </button>
    </div>
  );
};

export default FloatingCartButton;
