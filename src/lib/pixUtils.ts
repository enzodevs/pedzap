import { createStaticPix, hasError } from 'pix-utils';

/**
 * Generates a random transaction ID for PIX payments
 * @returns A random string to use as transaction ID
 */
export const generateTransactionId = (): string => {
  const randomPart = Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `ifacens-${randomPart}-${timestamp}`;
};

/**
 * Formats a number as Brazilian currency (R$)
 * @param value The number to format
 * @returns Formatted string (e.g., "R$ 10,50")
 */
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

/**
 * Formats a number for PIX API (e.g., 10.50 instead of 10,50)
 * @param value The number to format
 * @returns Formatted string with dot as decimal separator
 */
export const formatValueForPix = (value: number): string => {
  return value.toFixed(2);
};

/**
 * Cria um código PIX simplificado com os parâmetros essenciais.
 * @param pixKey Chave PIX
 * @param merchantName Nome do comerciante
 * @param merchantCity Cidade do comerciante
 * @param amount Valor da transação como string (ex.: "10.50")
 * @returns O código PIX (BR Code)
 */
export const createPixCode = (
  pixKey: string,
  merchantName: string,
  merchantCity: string,
  amount: string
): string => {
  const pix = createStaticPix({
    pixKey: pixKey,
    merchantName: merchantName,
    merchantCity: merchantCity,
    transactionAmount: parseFloat(amount),
  });

  if (hasError(pix)) {
    throw new Error('Erro ao gerar código PIX: ' + JSON.stringify(pix.error));
  }

  return pix.toBRCode();
};

/**
 * Generates a WhatsApp message with order details
 * @param name Customer name
 * @param orderItems Order items details 
 * @param totalPrice Total price of the order
 * @param transactionId Transaction ID
 * @returns Encoded URL for WhatsApp with predefined message
 */
export const generateWhatsAppLink = (
  name: string,
  orderItems: Array<{ 
    name: string; 
    quantity: number; 
    price: number; 
    description?: string 
  }>,
  totalPrice: number,
  transactionId: string
): string => {
  // Format items text with descriptions/customizations
  const itemsText = orderItems
    .map(item => {
      // Base item text
      const baseText = `• ${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`;
      
      // Check if description has customization info (in parentheses)
      if (item.description && item.description.includes('(')) {
        const customizationStart = item.description.indexOf('(') + 1;
        const customizationEnd = item.description.indexOf(')');
        
        if (customizationStart > 0 && customizationEnd > customizationStart) {
          const customizationText = item.description.substring(
            customizationStart, 
            customizationEnd
          );
          
          return `${baseText}\n   ↳ _${customizationText}_`;
        }
      }
      
      return baseText;
    })
    .join('\n\n');

  // Format complete message with better structure and emojis
  const message = `*📱 NOVO PEDIDO IFACENS!*\n\n` +
    `👤 *Cliente:* ${name}\n` +
    `🆔 *ID da Transação:* ${transactionId}\n\n` +
    `🛒 *ITENS DO PEDIDO:*\n${itemsText}\n\n` +
    `💰 *Total:* ${formatCurrency(totalPrice)}\n\n` +
    `✅ Estou enviando o comprovante do PIX.`;

  // Encode for URL and return with WhatsApp API link
  // This number is just a placeholder - replace with the actual number
  return `https://wa.me/5515999999999?text=${encodeURIComponent(message)}`;
};