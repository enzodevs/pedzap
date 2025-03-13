
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

// Type definitions
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  standId: string;
  standName: string;
  image?: string;
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
  
  // Calculate total items and price
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('ifacens-cart');
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart data:', error);
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
    }
  }, [items]);

  // Add item to cart
  const addItem = (product: Product, quantity = 1) => {
    setItems(currentItems => {
      // Check if product already exists in cart
      const existingItemIndex = currentItems.findIndex(item => item.product.id === product.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedItems = [...currentItems];
        updatedItems[existingItemIndex].quantity += quantity;
        toast.success(`${product.name} atualizado no carrinho`);
        return updatedItems;
      } else {
        // Add new item
        toast.success(`${product.name} adicionado ao carrinho`);
        return [...currentItems, { product, quantity }];
      }
    });

    // Open cart when adding items
    setIsCartOpen(true);
  };

  // Remove item from cart
  const removeItem = (productId: string) => {
    setItems(currentItems => {
      const itemToRemove = currentItems.find(item => item.product.id === productId);
      if (itemToRemove) {
        toast.info(`${itemToRemove.product.name} removido do carrinho`);
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

    setItems(currentItems => 
      currentItems.map(item => 
        item.product.id === productId 
          ? { ...item, quantity } 
          : item
      )
    );
  };

  // Clear cart
  const clearCart = () => {
    setItems([]);
    toast.info('Carrinho esvaziado');
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
