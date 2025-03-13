
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Send, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/supabaseService';
import { formatCurrency, generateTransactionId, generateWhatsAppLink, formatValueForPix, createPixCode } from '@/lib/pixUtils';
import { useToast } from '@/hooks/use-toast';

interface PaymentScreenProps {
  customerName: string;
}

const PaymentScreen: React.FC<PaymentScreenProps> = ({ customerName }) => {
  const [brcode, setBrcode] = useState<string | null>(null);
  const [txid, setTxid] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [savingOrder, setSavingOrder] = useState(false);
  const [copied, setCopied] = useState(false);
  const [orderSaved, setOrderSaved] = useState(false);
  const { items, totalPrice, currentStandId, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [error, setError] = useState<string | null>(null);

  // Generate PIX code when component mounts
  useEffect(() => {
    const generatePix = async () => {
      // Reset error state
      setError(null);
      
      try {
        // Generate transaction ID once
        const newTxid = generateTransactionId();
        setTxid(newTxid);
        
        // Format value for the API (e.g., "10.00")
        const formattedValue = formatValueForPix(totalPrice);
        
        // Define the API URL with all parameters
        const apiUrl = `https://gerarqrcodepix.com.br/api/v1?nome=iFacens&cidade=Sorocaba&saida=br&valor=${formattedValue}&txid=${newTxid}&chave=b1936613-2fa8-4307-a08d-8ddfd05b3c75`;
        
        console.log("Calling PIX API with URL:", apiUrl);
        
        try {
          // Try API call with no-cors mode
          const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
            },
            mode: 'no-cors', // This will prevent CORS errors but return an opaque response
          });
          
          console.log("PIX API response status:", response.status, response.type);
          
          // Since no-cors returns an opaque response that we can't read,
          // we'll always use our manual code generation as a fallback
          const pixCode = createPixCode(
            'b1936613-2fa8-4307-a08d-8ddfd05b3c75',
            'iFacens',
            'Sorocaba',
            formattedValue,
            newTxid
          );
          
          setBrcode(pixCode);
        } catch (apiError) {
          console.error("API call failed, using fallback:", apiError);
          
          // Create PIX code manually
          const pixCode = createPixCode(
            'b1936613-2fa8-4307-a08d-8ddfd05b3c75',
            'iFacens',
            'Sorocaba',
            formattedValue,
            newTxid
          );
          
          setBrcode(pixCode);
        }
        
        // Salvar o pedido no Supabase
        if (currentStandId && items.length > 0) {
          setSavingOrder(true);
          const orderItems = items.map(item => ({
            productId: item.product.id,
            quantity: item.quantity,
            unitPrice: item.product.price
          }));
          
          const result = await createOrder(
            customerName,
            newTxid,
            currentStandId,
            orderItems,
            totalPrice
          );
          
          setSavingOrder(false);
          
          if (result.success) {
            setOrderSaved(true);
          } else {
            console.error('Erro ao salvar pedido:', result.error);
            // Não exibimos erro para o usuário neste caso, permitimos continuar com o pagamento
          }
        }
      } catch (error) {
        console.error('Error generating PIX code:', error);
        setError('Houve um erro ao gerar o código PIX. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    // Only generate PIX if we have items and a positive total price
    if (items.length > 0 && totalPrice > 0 && currentStandId) {
      generatePix();
    } else {
      setError('Seu carrinho está vazio ou há um problema com o valor total.');
      setLoading(false);
    }
  }, [items, totalPrice, currentStandId, customerName]);

  // Generate WhatsApp link with order information
  const whatsappLink = items.length > 0 && txid 
    ? generateWhatsAppLink(
        customerName,
        items.map(item => ({
          name: item.product.name,
          quantity: item.quantity,
          price: item.product.price
        })),
        totalPrice,
        txid
      )
    : '';

  const copyPixCode = () => {
    if (brcode) {
      navigator.clipboard.writeText(brcode);
      setCopied(true);
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleBackToHome = () => {
    clearCart();
    navigate('/');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-xl">
      <button
        onClick={() => navigate('/payment')}
        className="flex items-center text-ifacens-primary hover:underline mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Voltar
      </button>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-6 text-center">Pagamento</h1>
        
        {loading || savingOrder ? (
          <div className="text-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-ifacens-primary/20 border-t-ifacens-primary rounded-full mx-auto mb-4"></div>
            <p>{savingOrder ? 'Registrando seu pedido...' : 'Gerando código PIX...'}</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={handleBackToHome}
              className="btn-primary"
            >
              Voltar ao Início
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="bg-gray-50 p-4 rounded-md">
                <h2 className="font-medium mb-2">Resumo do Pedido</h2>
                <p className="text-sm text-gray-600 mb-1">Nome: {customerName}</p>
                <p className="text-sm text-gray-600 mb-1">ID da Transação: {txid}</p>
                <p className="font-medium">Total: {formatCurrency(totalPrice)}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-medium mb-2">Código PIX</h2>
              <div className="bg-gray-50 p-4 rounded-md">
                {brcode && (
                  <>
                    <p className="text-sm break-all mb-2 bg-white p-2 rounded border">{brcode}</p>
                    <button
                      onClick={copyPixCode}
                      className="flex items-center justify-center w-full py-2 border border-ifacens-primary text-ifacens-primary rounded-md hover:bg-ifacens-primary/5 transition-colors"
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-2" />
                          Copiar Código PIX
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
            
            <div className="mb-6">
              <h2 className="font-medium mb-2">Instruções</h2>
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Copie o código PIX acima</li>
                <li>Abra o aplicativo do seu banco</li>
                <li>Escolha a opção PIX Copia e Cola</li>
                <li>Cole o código e confirme o pagamento</li>
                <li>Clique no botão do WhatsApp abaixo e envie o comprovante</li>
              </ol>
            </div>
            
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full flex items-center justify-center"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar Comprovante via WhatsApp
            </a>
            
            <button 
              onClick={handleBackToHome}
              className="w-full mt-4 text-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              Finalizar e Voltar ao Início
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentScreen;
