
import React, { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import CartSidebar from '@/components/cart/CartSidebar';
import { getStands, getProductsByStand, Stand } from '@/services/supabaseService';
import { Product } from '@/context/CartContext';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [stands, setStands] = useState<Array<{
    id: string;
    name: string;
    description: string;
    products: Product[];
  }>>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Buscar todas as barracas
        const standsData = await getStands();
        
        // Para cada barraca, buscar seus produtos
        const standsWithProducts = await Promise.all(
          standsData.map(async (stand) => {
            const products = await getProductsByStand(stand.id);
            return {
              id: stand.id,
              name: stand.name,
              description: stand.description || 'Descrição não disponível',
              products
            };
          })
        );
        
        setStands(standsWithProducts);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProductSection stands={stands} loading={loading} />
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Index;
