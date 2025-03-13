
import React from 'react';
import { ArrowDown } from 'lucide-react';

const Hero = () => {
  const scrollToStands = () => {
    const standsSection = document.getElementById('stands');
    if (standsSection) {
      standsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="hero-gradient min-h-screen flex items-center pt-20 pb-12">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-ifacens-primary/10 text-ifacens-primary font-medium text-sm mb-6 animate-fade-in">
            Cardápio Digital
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Comida deliciosa <span className="text-ifacens-primary">sem filas</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 animate-fade-in">
            Encomende sua comida favorita das barracas da faculdade diretamente do seu celular.
            Rápido, fácil e sem complicações.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <button 
              onClick={scrollToStands}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Ver Cardápio
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
          
          <div className="relative h-64 md:h-96 glass-card rounded-xl overflow-hidden shadow-xl mx-auto max-w-4xl animate-fade-in">
            <div className="absolute inset-0 bg-gradient-to-r from-ifacens-primary to-ifacens-secondary opacity-10"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-2xl md:text-3xl font-bold text-ifacens-primary">
                iFacens
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
