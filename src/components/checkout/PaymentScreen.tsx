
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
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pt-24 pb-12">
        <div className="container mx-auto px-4 max-w-xl">
          <button
            onClick={() => navigate('/payment')}
            className="flex items-center text-ifacens-primary hover:underline mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar
          </button>
          
          <Card className="border-t-4 border-t-ifacens-primary shadow-lg">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold text-center text-ifacens-primary">
                Pagamento via PIX
              </CardTitle>
            </CardHeader>
            
            <CardContent className="pt-4">
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
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <h2 className="font-bold text-ifacens-primary mb-3 flex items-center">
                        <div className="bg-ifacens-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</div>
                        Resumo do Pedido
                      </h2>
                      <div className="space-y-2">
                        <p className="text-gray-700 mb-1 flex justify-between">
                          <span>Nome:</span> 
                          <span className="font-medium">{customerName}</span>
                        </p>
                        <p className="text-gray-700 mb-1 flex justify-between">
                          <span>ID da Transação:</span> 
                          <span className="font-medium text-xs">{txid}</span>
                        </p>
                        <p className="text-gray-700 flex justify-between font-bold text-lg pt-2 border-t border-blue-100 mt-2">
                          <span>Total:</span> 
                          <span className="text-ifacens-primary">{formatCurrency(totalPrice)}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
                      <h2 className="font-bold text-ifacens-primary mb-3 flex items-center">
                        <div className="bg-ifacens-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</div>
                        Código PIX
                      </h2>
                      
                      <div className="flex justify-center mb-4">
                        <div className="bg-white rounded-full p-3 shadow-md">
                          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 256 256">
                            <path fill="#32BCAD" d="M128 24.186L19.467 85.33v85.332L128 231.813l108.533-61.14V85.33z"/>
                            <path fill="#fff" d="M110.483 99.202a3.327 3.327 0 0 0-3.31 3.33v15.676H91.497a3.325 3.325 0 0 0-3.31 3.326a3.324 3.324 0 0 0 3.31 3.33h15.676v15.673a3.33 3.33 0 0 0 3.31 3.33a3.332 3.332 0 0 0 3.33-3.33v-15.673h15.673a3.33 3.33 0 0 0 0-6.657h-15.673v-15.676a3.329 3.329 0 0 0-3.33-3.329ZM71.55 99.169a2.996 2.996 0 0 0-2.996 2.996V137.7c0 .783.335 1.566.9 2.132l21.212 21.213a3.001 3.001 0 0 0 4.229-4.229l-20.346-20.347v-34.304a2.998 2.998 0 0 0-2.998-2.996ZM187.43 99.202c-.786 0-1.566.332-2.131.9l-21.213 21.212a3.001 3.001 0 0 0 4.229 4.229l20.347-20.346v34.304a2.998 2.998 0 0 0 5.996 0v-35.535c0-.783-.332-1.566-.9-2.131a2.991 2.991 0 0 0-2.131-.9c-.2 0-.398 0-.597.066-.066 0-.133.067-.2.067-.133.066-.266.133-.4.133Z"/>
                          </svg>
                        </div>
                      </div>
                      
                      {brcode && (
                        <>
                          <p className="text-sm break-all mb-3 bg-white p-3 rounded-lg border border-gray-200 font-mono shadow-sm">
                            {brcode}
                          </p>
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
                    <div className="bg-blue-50 p-5 rounded-lg border border-blue-100">
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
