
import React from 'react';
import { Plus, AlertCircle } from 'lucide-react';
import { useCart, Product } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    if (product.stock !== undefined && product.stock <= 0) {
      return; // Não permite adicionar ao carrinho se não houver estoque
    }
    addItem(product, 1);
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
      </div>
    </div>
  );
};

export default ProductCard;
