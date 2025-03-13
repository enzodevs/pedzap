
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, toggleCart } = useCart();

  // Track scroll position to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      )}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/" 
          className="relative flex items-center"
          onClick={closeMenu}
        >
          <span className="text-2xl font-bold text-ifacens-primary">
            iFacens
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-ifacens-primary transition-colors"
          >
            Início
          </Link>
          <a 
            href="#stands" 
            className="text-gray-700 hover:text-ifacens-primary transition-colors"
          >
            Barracas
          </a>
          <button
            onClick={toggleCart}
            className="relative text-gray-700 hover:text-ifacens-primary transition-colors"
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-ifacens-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </nav>

        {/* Mobile Navigation Button */}
        <div className="flex items-center space-x-4 md:hidden">
          <button
            onClick={toggleCart}
            className="relative text-gray-700 p-1"
            aria-label="Carrinho de compras"
          >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-ifacens-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
          <button
            onClick={toggleMenu}
            className="text-gray-700 p-1"
            aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={cn(
          "fixed inset-0 bg-white z-40 pt-20 px-4 transition-all duration-300 transform md:hidden",
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <nav className="flex flex-col space-y-8 items-center text-lg">
          <Link 
            to="/" 
            className="text-gray-700 hover:text-ifacens-primary transition-colors"
            onClick={closeMenu}
          >
            Início
          </Link>
          <a 
            href="#stands" 
            className="text-gray-700 hover:text-ifacens-primary transition-colors"
            onClick={closeMenu}
          >
            Barracas
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
