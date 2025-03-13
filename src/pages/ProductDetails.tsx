
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCart, Product } from '@/context/CartContext';
import { formatCurrency } from '@/lib/pixUtils';
import Header from '@/components/layout/Header';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<{
    drink?: string;
    extras: string[];
    meatPoint?: string;
    size?: string;
  }>({
    extras: [],
  });

  // Recuperar o produto da localização ou buscar dos serviços
  useEffect(() => {
    if (location.state?.product) {
      setProduct(location.state.product);
      setTotalPrice(location.state.product.price);
    } else {
      // Aqui você poderia buscar o produto pelo ID de uma API
      console.error('Produto não encontrado');
      navigate('/');
    }
  }, [id, location.state, navigate]);

  const isCombo = product?.name.toLowerCase().includes('combo');
  const isXTudo = product?.name.toLowerCase().includes('x-tudo');
  const isBurger = product?.name.toLowerCase().includes('x-');

  const increaseQuantity = () => {
    const maxStock = product?.stock || 100;
    if (quantity < maxStock) {
      setQuantity(prev => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleDrinkChange = (value: string) => {
    setSelectedOptions(prev => ({ ...prev, drink: value }));
  };

  const handleMeatPointChange = (value: string) => {
    setSelectedOptions(prev => ({ ...prev, meatPoint: value }));
  };

  const handleSizeChange = (value: string) => {
    setSelectedOptions(prev => ({ ...prev, size: value }));
  };

  const toggleExtra = (extra: string) => {
    setSelectedOptions(prev => {
      const extras = [...prev.extras];
      if (extras.includes(extra)) {
        return { ...prev, extras: extras.filter(e => e !== extra) };
      } else {
        return { ...prev, extras: [...extras, extra] };
      }
    });
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;
    
    let total = product.price;
    
    // Adicionar preço dos extras
    selectedOptions.extras.forEach(extra => {
      if (extra === 'Bacon extra') total += 3;
      if (extra === 'Queijo extra') total += 2;
      if (extra === 'Cebola caramelizada') total += 2.5;
      if (extra === 'Molho especial') total += 1.5;
    });
    
    return total * quantity;
  };

  // Calcular o preço total sempre que as opções ou quantidade mudarem
  useEffect(() => {
    setTotalPrice(calculateTotalPrice());
  }, [selectedOptions, quantity]);

  const handleAddToCart = () => {
    if (!product) return;
    
    // Criar descrição das opções selecionadas
    const optionsDescription = [];
    if (selectedOptions.drink) optionsDescription.push(`Bebida: ${selectedOptions.drink}`);
    if (selectedOptions.meatPoint) optionsDescription.push(`Ponto da carne: ${selectedOptions.meatPoint}`);
    if (selectedOptions.size) optionsDescription.push(`Tamanho: ${selectedOptions.size}`);
    if (selectedOptions.extras.length > 0) optionsDescription.push(`Extras: ${selectedOptions.extras.join(', ')}`);
    
    // Garantir que o preço unitário nunca seja zero
    const unitPrice = totalPrice / quantity || product.price;
    
    // Criar produto customizado
    const customProduct: Product = {
      ...product,
      description: optionsDescription.length > 0 
        ? `${product.description} (${optionsDescription.join(' | ')})` 
        : product.description,
      price: unitPrice, // Preço unitário com os extras
    };
    
    // Adicionar ao carrinho
    addItem(customProduct, quantity);
    
    // Voltar para a página inicial
    navigate('/');
  };

  if (!product) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-20 pb-24 container mx-auto px-4">
        {/* Botão voltar */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-ifacens-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Voltar</span>
        </button>
        
        <div className="bg-white rounded-xl overflow-hidden shadow-md">
          {/* Imagem do produto */}
          <div className="h-64 w-full overflow-hidden">
            <img 
              src={product.image || '/placeholder.svg'} 
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="p-6">
            {/* Informações do produto */}
            <div className="mb-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
                <div className="text-xl font-bold text-ifacens-primary">
                  {formatCurrency(product.price)}
                </div>
              </div>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-sm text-gray-500">{product.standName}</p>
            </div>
            
            {/* Opções do produto */}
            <div className="space-y-6">
              {/* Opção de bebida para combos */}
              {isCombo && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Escolha sua bebida:</h3>
                  <RadioGroup 
                    defaultValue="Coca-cola"
                    onValueChange={handleDrinkChange}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Coca-cola" id="coca-cola" />
                      <label htmlFor="coca-cola" className="text-sm">Coca-cola</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Pepsi" id="pepsi" />
                      <label htmlFor="pepsi" className="text-sm">Pepsi</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Guaraná" id="guarana" />
                      <label htmlFor="guarana" className="text-sm">Guaraná</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Água mineral" id="agua" />
                      <label htmlFor="agua" className="text-sm">Água mineral</label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {/* Ponto da carne para hamburgueres */}
              {isBurger && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Ponto da carne:</h3>
                  <RadioGroup 
                    defaultValue="Ao ponto"
                    onValueChange={handleMeatPointChange}
                    className="grid grid-cols-1 gap-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Mal passado" id="mal-passado" />
                      <label htmlFor="mal-passado" className="text-sm">Mal passado</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Ao ponto" id="ao-ponto" />
                      <label htmlFor="ao-ponto" className="text-sm">Ao ponto</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="Bem passado" id="bem-passado" />
                      <label htmlFor="bem-passado" className="text-sm">Bem passado</label>
                    </div>
                  </RadioGroup>
                </div>
              )}
              
              {/* Extras para hamburgueres */}
              {isBurger && (
                <div>
                  <h3 className="text-lg font-medium mb-3">Extras:</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="bacon-extra" 
                        checked={selectedOptions.extras.includes('Bacon extra')}
                        onCheckedChange={() => toggleExtra('Bacon extra')}
                      />
                      <label htmlFor="bacon-extra" className="text-sm flex justify-between w-full">
                        <span>Bacon extra</span>
                        <span className="text-ifacens-primary font-medium">+ R$ 3,00</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="queijo-extra" 
                        checked={selectedOptions.extras.includes('Queijo extra')}
                        onCheckedChange={() => toggleExtra('Queijo extra')}
                      />
                      <label htmlFor="queijo-extra" className="text-sm flex justify-between w-full">
                        <span>Queijo extra</span>
                        <span className="text-ifacens-primary font-medium">+ R$ 2,00</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="cebola-caramelizada" 
                        checked={selectedOptions.extras.includes('Cebola caramelizada')}
                        onCheckedChange={() => toggleExtra('Cebola caramelizada')}
                      />
                      <label htmlFor="cebola-caramelizada" className="text-sm flex justify-between w-full">
                        <span>Cebola caramelizada</span>
                        <span className="text-ifacens-primary font-medium">+ R$ 2,50</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="molho-especial" 
                        checked={selectedOptions.extras.includes('Molho especial')}
                        onCheckedChange={() => toggleExtra('Molho especial')}
                      />
                      <label htmlFor="molho-especial" className="text-sm flex justify-between w-full">
                        <span>Molho especial</span>
                        <span className="text-ifacens-primary font-medium">+ R$ 1,50</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Quantidade e preço total */}
            <div className="flex justify-between items-center mt-8 border-t pt-4">
              <div className="flex items-center space-x-3">
                <button
                  onClick={decreaseQuantity}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="text-xl font-medium w-8 text-center">{quantity}</span>
                <button
                  onClick={increaseQuantity}
                  className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="text-xl font-bold text-ifacens-primary">
                {formatCurrency(totalPrice)}
              </div>
            </div>
            
            {/* Botão de adicionar ao carrinho */}
            <div className="mt-6">
              <Button
                onClick={handleAddToCart}
                className="w-full bg-ifacens-primary hover:bg-ifacens-primary/90 text-white py-4 text-lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Adicionar ao Pedido
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
