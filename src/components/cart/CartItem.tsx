
import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  standName: string;
  image?: string;
}

const CartItem: React.FC<CartItemProps> = ({
  id,
  name,
  price,
  quantity,
  standName,
  image
}) => {
  const { updateQuantity, removeItem } = useCart();

  const increaseQuantity = () => {
    updateQuantity(id, quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    } else {
      removeItem(id);
    }
  };

  const handleRemove = () => {
    removeItem(id);
  };

  return (
    <div className="flex py-4 border-b border-gray-200 last:border-b-0 animate-fade-in">
      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
        <img
          src={image || '/placeholder.svg'}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-1">
        <div className="flex justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-800">{name}</h4>
            <p className="text-xs text-gray-500">{standName}</p>
          </div>
          <p className="text-sm font-medium text-gray-800">
            {formatCurrency(price * quantity)}
          </p>
        </div>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={decreaseQuantity}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Diminuir quantidade"
            >
              <Minus className="h-3 w-3" />
            </button>
            
            <span className="text-sm text-gray-800 w-6 text-center">
              {quantity}
            </span>
            
            <button
              onClick={increaseQuantity}
              className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              aria-label="Aumentar quantidade"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>
          
          <button
            onClick={handleRemove}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Remover item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
