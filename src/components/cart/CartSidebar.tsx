
import React from 'react';
import { X, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/context/CartContext';
import CartItem from './CartItem';
import { formatCurrency } from '@/lib/pixUtils';
import { Button } from '@/components/ui/button';

const CartSidebar: React.FC = () => {
  const { items, isCartOpen, totalItems, totalPrice, closeCart, clearCart } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    closeCart();
    navigate('/payment');
  };

  return (
    <>
      {/* Backdrop */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 animate-fade-in"
          onClick={closeCart}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isCartOpen ? 'translate-x-0 animate-slide-in-right' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center">
              <ShoppingBag className="h-5 w-5 text-ifacens-primary mr-2" />
              <h2 className="text-lg font-semibold">
                Seu Pedido
                {totalItems > 0 && (
                  <span className="ml-2 text-sm font-normal text-gray-500">
                    ({totalItems} {totalItems === 1 ? 'item' : 'itens'})
                  </span>
                )}
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar carrinho"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <ShoppingBag className="h-12 w-12 text-gray-300 mb-4" />
                <p className="text-gray-500 mb-2">Seu carrinho está vazio</p>
                <p className="text-sm text-gray-400">
                  Adicione alguns itens para continuar
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {items.map((item) => (
                  <CartItem
                    key={item.product.id}
                    id={item.product.id}
                    name={item.product.name}
                    price={item.product.price}
                    quantity={item.quantity}
                    standName={item.product.standName}
                    image={item.product.image}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-gray-500">Subtotal</span>
                <span className="font-medium">{formatCurrency(totalPrice)}</span>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleCheckout}
                  className="w-full bg-ifacens-primary hover:bg-ifacens-primary/90 text-white"
                >
                  Finalizar Pedido
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
                
                <button
                  onClick={clearCart}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Limpar Carrinho
                </button>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default CartSidebar;
