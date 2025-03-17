import React, { useState } from 'react';
import { Plus, Minus, ShoppingBag, AlertCircle } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const needsCustomization = 
    product.name.toLowerCase().includes('x-') || 
    product.name.toLowerCase().includes('combo');

  const increaseQuantity = () => {
    const maxStock = product.stock || 100;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
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
    
    if (needsCustomization) {
      // Navegar para a página de detalhes do produto se for um item que precisa de customização
      navigate(`/product/${product.id}`, { state: { product } });
      return;
    }
    
    addItem(product, quantity);
    
    // Mostrar notificação ao invés de abrir o carrinho
    toast({
      title: "Item adicionado à sacola!",
      description: `${quantity}x ${product.name} foi adicionado à sua sacola.`
    });
    
    setQuantity(1);
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
              {needsCustomization ? (
                <ShoppingBag className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;