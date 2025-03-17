
import React, { createContext, useContext, useState, useEffect } from 'react';

// Type definitions
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  standId: string;
  standName: string;
  image?: string;
  stock?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  isCartOpen: boolean;
  totalItems: number;
  totalPrice: number;
  currentStandId: string | null;
  currentStandName: string | null;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  closeCart: () => void;
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Provider component
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentStandId, setCurrentStandId] = useState<string | null>(null);
  const [currentStandName, setCurrentStandName] = useState<string | null>(null);
  
  // Calculate total items and price
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ifacens-cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setItems(parsedCart);
        
        // Restaurar informações da barraca atual se houver itens no carrinho
        if (parsedCart.length > 0) {
          setCurrentStandId(parsedCart[0].product.standId);
          setCurrentStandName(parsedCart[0].product.standName);
        }
      } catch (error) {
        console.error('Falha ao analisar dados do carrinho:', error);
        localStorage.removeItem('ifacens-cart');
      }
    }
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem('ifacens-cart', JSON.stringify(items));
    } else {
      localStorage.removeItem('ifacens-cart');
      setCurrentStandId(null);
      setCurrentStandName(null);
    }
  }, [items]);

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    // Verificar se já existe um produto de outra barraca no carrinho
    if (items.length > 0 && currentStandId && product.standId !== currentStandId) {
      // Mostrar confirmação para o usuário sobre a troca de barraca
      if (window.confirm(
        `Você já tem itens da barraca "${currentStandName}" na sua sacola.\n\nAdicionar este item da barraca "${product.standName}" substituirá todos os itens atuais.\n\nDeseja continuar?`
      )) {
        // Limpar o carrinho e adicionar o novo item
        setItems([{ product, quantity }]);
        setCurrentStandId(product.standId);
        setCurrentStandName(product.standName);
        setIsCartOpen(true);
      }
      return;
    }

    // Se o carrinho estiver vazio, definir a barraca atual
    if (items.length === 0) {
      setCurrentStandId(product.standId);
      setCurrentStandName(product.standName);
    }

    // Verificar estoque disponível
    const stockAvailable = product.stock !== undefined ? product.stock : Infinity;
    
    setItems(currentItems => {
      // Verificar se o produto já existe no carrinho
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Calcular nova quantidade
        const newQuantity = currentItems[existingItemIndex].quantity + quantity;
        
        // Verificar estoque
        if (newQuantity > stockAvailable) {
          return currentItems;
        }
        
        // Atualizar quantidade do item existente
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity = newQuantity;
        return updatedItems;
      } else {
        // Verificar estoque para novos itens
        if (quantity > stockAvailable) {
          return currentItems;
        }
        
        // Adicionar novo item
        return [...currentItems, { product, quantity }];
      }
    });

    // Abrir carrinho ao adicionar itens

  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.product.id === productId);
      if (itemToRemove) {
      }
      return currentItems.filter(item => item.product.id !== productId);
    });
  };

  // Update item quantity
  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }

    setItems(currentItems => {
      const itemIndex = currentItems.findIndex(item => item.product.id === productId);
      
      if (itemIndex === -1) return currentItems;
      
      // Verificar estoque disponível
      const stockAvailable = currentItems[itemIndex].product.stock !== undefined 
        ? currentItems[itemIndex].product.stock 
        : Infinity;
        
      if (quantity > stockAvailable) {
        return currentItems;
      }
      
      return currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      );
    });
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    setCurrentStandId(null);
    setCurrentStandName(null);
  };

  // Toggle cart visibility
  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Close cart
  const closeCart = () => {
    setIsCartOpen(false);
  };

  // Context value
  const value: CartContextType = {
    items,
    isCartOpen,
    totalItems,
    totalPrice,
    currentStandId,
    currentStandName,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    closeCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};
