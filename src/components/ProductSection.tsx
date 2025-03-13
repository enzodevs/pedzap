
import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { Product } from '@/context/CartContext';

interface ProductSectionProps {
  stands: Array<{
    id: string;
    name: string;
    description: string;
    products: Product[];
  }>;
}

const ProductSection: React.FC<ProductSectionProps> = ({ stands }) => {
  const [activeStand, setActiveStand] = useState<string | null>(
    stands.length > 0 ? stands[0].id : null
  );

  const activeStandData = stands.find(stand => stand.id === activeStand);

  return (
    <section id="stands" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-title">Nossas Barracas</h2>
          <p className="section-subtitle">
            Escolha entre as melhores opções de comida na faculdade
          </p>
        </div>

        {/* Stands Navigation */}
        <div className="flex overflow-x-auto pb-4 mb-8 hide-scrollbar">
          <div className="flex space-x-2 mx-auto">
            {stands.map(stand => (
              <button
                key={stand.id}
                onClick={() => setActiveStand(stand.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  activeStand === stand.id
                    ? 'bg-ifacens-primary text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {stand.name}
              </button>
            ))}
          </div>
        </div>

        {/* Active Stand Description */}
        {activeStandData && (
          <div className="bg-white rounded-lg p-6 mb-8 text-center max-w-2xl mx-auto shadow-sm">
            <h3 className="text-xl font-semibold text-ifacens-primary mb-2">
              {activeStandData.name}
            </h3>
            <p className="text-gray-600">
              {activeStandData.description}
            </p>
          </div>
        )}

        {/* Products Grid */}
        {activeStandData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeStandData.products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductSection;
