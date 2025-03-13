
import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, AlertCircle } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [showOptions, setShowOptions] = useState(false);

  const hasOptions = product.name.toLowerCase().includes('combo');

  const increaseQuantity = () => {
    const maxStock = product.stock || 100;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    } else {
      toast.warning(`Limite de estoque atingido (${maxStock})`);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (product.stock !== undefined && product.stock <= 0) {
      return; // Não permite adicionar ao carrinho se não houver estoque
    }
    
    addItem(product, quantity);
    setQuantity(1);
    setShowOptions(false);
    toast.success(`${product.name} adicionado ao carrinho`);
  };

  // Use a default image if none is provided
  const imageUrl = product.image || '/placeholder.svg';
  
  const outOfStock = product.stock !== undefined && product.stock <= 0;

  return (
    <div className={`bg-white rounded-lg overflow-hidden shadow-md transition-shadow duration-300 ${
      outOfStock ? 'opacity-70' : 'hover:shadow-lg'
    }`}>
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl}
          alt={product.name}
          className={`w-full h-full object-cover ${outOfStock ? '' : 'transition-transform duration-300 hover:scale-105'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        <div className="absolute bottom-2 right-2 bg-white px-2 py-1 rounded-md font-medium text-ifacens-primary">
          {formatCurrency(product.price)}
        </div>
        
        {outOfStock && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-xs font-medium flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Sem estoque
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
        
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-500">{product.standName}</span>
          
          {hasOptions ? (
            <Popover open={showOptions} onOpenChange={setShowOptions}>
              <PopoverTrigger asChild>
                <button 
                  className={`${
                    outOfStock 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-ifacens-primary hover:bg-ifacens-primary/90'
                  } text-white p-2 rounded-full transition-colors`}
                  disabled={outOfStock}
                >
                  <ShoppingCart className="h-4 w-4" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-4" side="top">
                <div className="space-y-4">
                  <div className="text-sm font-medium">Escolha suas opções</div>
                  <div className="space-y-2">
                    {/* Aqui pode-se adicionar opções específicas para combos */}
                    <div className="flex justify-between text-sm">
                      <span>Bebida:</span>
                      <select className="border rounded px-2 py-1 text-sm">
                        <option>Coca-Cola</option>
                        <option>Pepsi</option>
                        <option>Guaraná</option>
                      </select>
                    </div>
                    {product.name.toLowerCase().includes('x-tudo') && (
                      <div className="flex justify-between text-sm">
                        <span>Ponto da carne:</span>
                        <select className="border rounded px-2 py-1 text-sm">
                          <option>Ao ponto</option>
                          <option>Bem passado</option>
                          <option>Mal passado</option>
                        </select>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={decreaseQuantity}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <button
                      onClick={handleAddToCart}
                      className="bg-ifacens-primary text-white px-3 py-1 rounded-md text-sm"
                    >
                      Adicionar
                    </button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <div className="flex items-center space-x-2">
              <button
                onClick={decreaseQuantity}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={outOfStock || quantity <= 1}
              >
                <Minus className="h-3 w-3" />
              </button>
              <span className="w-6 text-center text-sm">{quantity}</span>
              <button
                onClick={increaseQuantity}
                className="p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                disabled={outOfStock}
              >
                <Plus className="h-3 w-3" />
              </button>
              <button 
                onClick={handleAddToCart}
                className={`${
                  outOfStock 
                    ? 'bg-gray-300 cursor-not-allowed' 
                    : 'bg-ifacens-primary hover:bg-ifacens-primary/90'
                } text-white p-2 rounded-full transition-colors`}
                disabled={outOfStock}
                aria-label={
                  outOfStock 
                    ? `${product.name} fora de estoque` 
                    : `Adicionar ${product.name} ao carrinho`
                }
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
