import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Send, Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { createOrder } from '@/services/supabaseService';
import { 
  formatCurrency, 
  generateWhatsAppLink, 
  formatValueForPix, 
  createPixCode,
  generateTransactionId
} from '@/lib/pixUtils';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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

  // Generate PIX code and transaction ID when component mounts
  useEffect(() => {
    const generatePix = async () => {
      setError(null);
      setLoading(true);

      try {
        const formattedValue = formatValueForPix(totalPrice);

        const pixCode = createPixCode(
          'b1936613-2fa8-4307-a08d-8ddfd05b3c75', // Chave PIX fixa
          'iFacens',                              // Nome do comerciante fixo
          'Sorocaba',                             // Cidade fixa
          formattedValue                          // Valor dinâmico
        );

        // Generate a transaction ID to include in the WhatsApp message
        const transactionId = generateTransactionId();

        setBrcode(pixCode);
        setTxid(transactionId);
        console.log('Código PIX gerado:', pixCode, 'TXID:', transactionId);
      } catch (error) {
        console.error('Erro ao gerar código PIX:', error);
        setError('Erro ao gerar o código PIX. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    generatePix();
  }, [totalPrice]);

  // Generate WhatsApp link with order information
  const whatsappLink =
    items.length > 0 && txid
      ? generateWhatsAppLink(
          customerName,
          items.map(item => ({
            name: item.product.name,
            quantity: item.quantity,
            price: item.product.price,
            description: item.product.description // Include description with customizations
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
    <>
      <Header />
      <div className="min-h-screen bg-white pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-xl">
          <button
            onClick={() => navigate('/payment')}
            className="flex items-center text-ifacens-primary hover:underline mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          
          <Card className="border-t-4 border-t-ifacens-primary shadow-lg overflow-hidden">
            <CardHeader className="pb-2 bg-white">
              <CardTitle className="text-2xl font-bold text-center text-ifacens-primary">
                Pagamento via PIX
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4 bg-gradient-to-b from-blue-50 to-white">
              {loading || savingOrder ? (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 animate-spin text-ifacens-primary mx-auto mb-4" />
                  <p className="text-gray-600 font-medium">
                    {savingOrder ? 'Registrando seu pedido...' : 'Gerando código PIX...'}
                  </p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
                    <p className="font-medium">{error}</p>
                  </div>
                  <Button 
                    onClick={handleBackToHome}
                    className="bg-ifacens-primary hover:bg-ifacens-primary/90"
                  >
                    Voltar ao Início
                  </Button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                      <h2 className="font-bold text-ifacens-primary mb-3 flex items-center">
                        <div className="bg-ifacens-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</div>
                        Resumo do Pedido
                      </h2>
                      <div className="space-y-2">
                        <p className="text-gray-700 mb-1 flex justify-between">
                          <span className="font-medium">Nome:</span> 
                          <span>{customerName}</span>
                        </p>
                        <p className="text-gray-700 mb-1 flex flex-col sm:flex-row sm:justify-between">
                          <span className="font-medium">ID da Transação:</span> 
                          <code className="font-mono text-xs bg-gray-100 p-1 px-2 rounded mt-1 sm:mt-0 overflow-auto max-w-full sm:max-w-[200px] block sm:inline-block whitespace-nowrap">{txid}</code>
                        </p>
                        <p className="text-gray-700 flex justify-between font-bold text-lg pt-2 border-t border-blue-100 mt-2">
                          <span>Total:</span> 
                          <span className="text-ifacens-primary">{formatCurrency(totalPrice)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                      <h2 className="font-bold text-ifacens-primary mb-3 flex items-center">
                        <div className="bg-ifacens-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</div>
                        Código PIX
                      </h2>
                      
                      <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-full p-3 shadow-md">
                          <img src="https://logospng.org/download/pix/logo-pix-icone-512.png" alt="Ícone Pix" width="48" height="48" />
                        </div>
                      </div>
                      
                      {brcode && (
                        <>
                          <div className="relative mb-3 group cursor-pointer" onClick={copyPixCode}>
                            <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                              <p className="text-sm break-all font-mono blur-sm group-hover:blur-none transition-all duration-300">
                                {brcode}
                              </p>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center group-hover:opacity-0 transition-opacity">
                              <div className="bg-white/90 px-4 py-2 rounded-full text-sm font-medium text-ifacens-primary border border-ifacens-primary/20 shadow-sm">
                                Clique para revelar o código
                              </div>
                            </div>
                          </div>
                          <Button
                            onClick={copyPixCode}
                            className="w-full bg-white border border-ifacens-primary text-ifacens-primary hover:bg-ifacens-primary/5 transition-colors flex items-center justify-center"
                            variant="outline"
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
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-8">
                    <div className="bg-white p-5 rounded-lg border border-blue-100 shadow-sm">
                      <h2 className="font-bold text-ifacens-primary mb-3 flex items-center">
                        <div className="bg-ifacens-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</div>
                        Instruções
                      </h2>
                      <ol className="list-decimal list-inside space-y-3 text-gray-700 pl-4">
                        <li>Copie o código PIX acima</li>
                        <li>Abra o aplicativo do seu banco</li>
                        <li>Escolha a opção <strong>PIX Copia e Cola</strong></li>
                        <li>Cole o código e confirme o pagamento</li>
                        <li>Clique no botão do WhatsApp abaixo e envie o comprovante</li>
                      </ol>
                    </div>
                  </div>
                  
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[#25D366] hover:bg-[#20BD5C] text-white py-3 px-4 rounded-md flex items-center justify-center font-medium shadow-md transition-colors mb-4"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar Comprovante via WhatsApp
                  </a>
                  
                  <Button 
                    onClick={handleBackToHome}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Finalizar e Voltar ao Início
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PaymentScreen;