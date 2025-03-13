
import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Hero from '@/components/Hero';
import ProductSection from '@/components/ProductSection';
import CartSidebar from '@/components/cart/CartSidebar';
import { Product } from '@/context/CartContext';

// Mock data for stands and products
const mockData = {
  stands: [
    {
      id: 'stand1',
      name: 'Mexicana',
      description: 'Comida mexicana tradicional feita com ingredientes frescos e temperos autênticos.',
      products: [
        {
          id: 'p1',
          name: 'Burrito de Frango',
          price: 22.90,
          description: 'Tortilla de trigo recheada com frango desfiado, arroz, feijão, guacamole e pico de gallo.',
          standId: 'stand1',
          standName: 'Mexicana',
          image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p2',
          name: 'Nachos Supremos',
          price: 24.90,
          description: 'Tortilhas crocantes cobertas com queijo derretido, carne moída, guacamole, creme azedo e jalapeños.',
          standId: 'stand1',
          standName: 'Mexicana',
          image: 'https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p3',
          name: 'Quesadilla',
          price: 19.90,
          description: 'Tortilla de trigo recheada com queijo derretido, frango e pimentões.',
          standId: 'stand1',
          standName: 'Mexicana',
          image: 'https://images.unsplash.com/photo-1618040996337-56904b7fb9b5?q=80&w=400&auto=format&fit=crop'
        }
      ] as Product[]
    },
    {
      id: 'stand2',
      name: 'Lanches',
      description: 'Os mais deliciosos lanches e hambúrgueres para matar sua fome entre as aulas.',
      products: [
        {
          id: 'p4',
          name: 'Hambúrguer Artesanal',
          price: 26.90,
          description: 'Pão brioche, 150g de blend bovino, queijo cheddar, bacon crocante, alface e tomate.',
          standId: 'stand2',
          standName: 'Lanches',
          image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p5',
          name: 'Batata Frita',
          price: 12.90,
          description: 'Porção de batatas fritas crocantes com sal e orégano.',
          standId: 'stand2',
          standName: 'Lanches',
          image: 'https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p6',
          name: 'Hot Dog Especial',
          price: 18.90,
          description: 'Pão de hot dog, salsicha, purê de batata, vinagrete, batata palha, ketchup, mostarda e maionese.',
          standId: 'stand2',
          standName: 'Lanches',
          image: 'https://images.unsplash.com/photo-1612392062631-94ad2dbfcb5b?q=80&w=400&auto=format&fit=crop'
        }
      ] as Product[]
    },
    {
      id: 'stand3',
      name: 'Cafeteria',
      description: 'Cafés especiais, bebidas e lanches rápidos para os intervalos entre as aulas.',
      products: [
        {
          id: 'p7',
          name: 'Café Expresso',
          price: 5.90,
          description: 'Café expresso tradicional, forte e encorpado.',
          standId: 'stand3',
          standName: 'Cafeteria',
          image: 'https://images.unsplash.com/photo-1509042239860-f0b0a4d39cbb?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p8',
          name: 'Cappuccino',
          price: 8.90,
          description: 'Café expresso, leite vaporizado e espuma de leite.',
          standId: 'stand3',
          standName: 'Cafeteria',
          image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p9',
          name: 'Bolo de Chocolate',
          price: 6.90,
          description: 'Fatia de bolo de chocolate com cobertura ganache.',
          standId: 'stand3',
          standName: 'Cafeteria',
          image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?q=80&w=400&auto=format&fit=crop'
        }
      ] as Product[]
    },
    {
      id: 'stand4',
      name: 'Açaí',
      description: 'Deliciosas sobremesas com açaí e diversas opções de complementos.',
      products: [
        {
          id: 'p10',
          name: 'Açaí Tradicional (300ml)',
          price: 14.90,
          description: 'Açaí cremoso com granola, banana e leite condensado.',
          standId: 'stand4',
          standName: 'Açaí',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p11',
          name: 'Açaí com Morango (500ml)',
          price: 19.90,
          description: 'Açaí cremoso com morangos frescos, leite em pó e leite condensado.',
          standId: 'stand4',
          standName: 'Açaí',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop'
        },
        {
          id: 'p12',
          name: 'Mix de Frutas (400ml)',
          price: 16.90,
          description: 'Açaí cremoso com mix de frutas da estação, granola e mel.',
          standId: 'stand4',
          standName: 'Açaí',
          image: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?q=80&w=400&auto=format&fit=crop'
        }
      ] as Product[]
    }
  ]
};

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <ProductSection stands={mockData.stands} />
      <Footer />
      <CartSidebar />
    </div>
  );
};

export default Index;
