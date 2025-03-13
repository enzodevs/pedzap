
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
 * Generates a WhatsApp message with order details
 * @param name Customer name
 * @param orderItems Order items details 
 * @param totalPrice Total price of the order
 * @param transactionId Transaction ID
 * @returns Encoded URL for WhatsApp with predefined message
 */
export const generateWhatsAppLink = (
  name: string,
  orderItems: Array<{ name: string; quantity: number; price: number }>,
  totalPrice: number,
  transactionId: string
): string => {
  // Format items text
  const itemsText = orderItems
    .map(item => `• ${item.quantity}x ${item.name} - ${formatCurrency(item.price * item.quantity)}`)
    .join('\n');

  // Format complete message
  const message = `*Novo pedido iFacens!*\n\n` +
    `*Nome:* ${name}\n` +
    `*ID da Transação:* ${transactionId}\n\n` +
    `*Itens do Pedido:*\n${itemsText}\n\n` +
    `*Total:* ${formatCurrency(totalPrice)}\n\n` +
    `Estou enviando o comprovante do PIX.`;

  // Encode for URL and return with WhatsApp API link
  // This number is just a placeholder - replace with the actual number
  return `https://wa.me/5515999999999?text=${encodeURIComponent(message)}`;
};
