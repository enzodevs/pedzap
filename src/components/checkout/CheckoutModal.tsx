
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const { items, totalPrice } = useCart();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!name.trim()) {
      setNameError('Por favor, informe seu nome.');
      return;
    }
    
    onConfirm(name);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in"
        onClick={onClose}
      ></div>
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto animate-scale-up"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-lg font-semibold">Resumo do Pedido</h2>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Fechar modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="p-4">
            <h3 className="font-medium mb-2">Itens do Pedido</h3>
            <div className="max-h-48 overflow-y-auto mb-4">
              {items.map(item => (
                <div 
                  key={item.product.id}
                  className="flex justify-between py-2 border-b border-gray-100 last:border-b-0"
                >
                  <div>
                    <span className="text-sm font-medium">{item.product.name}</span>
                    <p className="text-xs text-gray-500">
                      {item.quantity} x {formatCurrency(item.product.price)}
                    </p>
                  </div>
                  <span className="text-sm">
                    {formatCurrency(item.quantity * item.product.price)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between font-semibold mb-6">
              <span>Total</span>
              <span>{formatCurrency(totalPrice)}</span>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Seu Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    if (e.target.value.trim()) setNameError('');
                  }}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ifacens-primary/50 ${
                    nameError ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite seu nome completo"
                />
                {nameError && (
                  <p className="mt-1 text-sm text-red-500">{nameError}</p>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Ir para Pagamento
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CheckoutModal;
