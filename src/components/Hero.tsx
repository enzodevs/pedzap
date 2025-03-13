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
    <section className="hero-gradient min-h-screen flex items-center pt-16 pb-8">
      <div className="container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block px-4 py-1 rounded-full bg-ifacens-primary/10 text-ifacens-primary font-medium text-sm mb-6 animate-fade-in">
            Cardápio iFacens
          </span>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-fade-in">
            Seu tempo é <span className="text-ifacens-primary">precioso demais</span> para filas
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 mb-10 animate-fade-in">
            Sabemos como é frustrante perder o intervalo em filas e chegar atrasado na aula.
            As barracas têm a melhor comida pelo melhor preço, mas o tempo de espera não vale a pena.
            Agora você pode pedir antecipadamente e aproveitar cada minuto do seu intervalo.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
            <button 
              onClick={scrollToStands}
              className="btn-primary flex items-center justify-center gap-2"
            >
              Explorar Barracas
              <ArrowDown className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
