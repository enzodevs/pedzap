
import React from 'react';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';
import { useNavigate } from 'react-router-dom';

const FloatingCartButton = () => {
  const { totalItems, totalPrice, toggleCart } = useCart();
  const navigate = useNavigate();

  if (totalItems === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <button
        onClick={toggleCart}
        className="bg-ifacens-primary text-white py-3 px-5 rounded-full shadow-lg flex items-center space-x-3 hover:bg-ifacens-primary/90 transition-all"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6" />
          <span className="absolute -top-2 -right-2 bg-white text-ifacens-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {totalItems}
          </span>
        </div>
        <span className="font-medium">Ver Carrinho</span>
        <span className="font-bold">{formatCurrency(totalPrice)}</span>
      </button>
    </div>
  );
};

export default FloatingCartButton;
