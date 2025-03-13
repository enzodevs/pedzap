
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/context/CartContext';

export interface Stand {
  id: string;
  name: string;
  description: string | null;
}

export async function getStands(): Promise<Stand[]> {
  const { data, error } = await supabase
    .from('stands')
    .select('*');

  if (error) {
    console.error('Erro ao buscar barracas:', error);
    return [];
  }

  return data || [];
}

export async function getProductsByStand(standId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, stands!inner(name)')
    .eq('stand_id', standId);

  if (error) {
    console.error(`Erro ao buscar produtos da barraca ${standId}:`, error);
    return [];
  }

  // Mapear os dados para o formato esperado pelo contexto do carrinho
  return (data || []).map(item => ({
    id: item.id,
    name: item.name,
    price: Number(item.price),
    description: item.description || '',
    standId: item.stand_id,
    standName: item.stands.name,
    image: item.image_url,
    stock: item.stock
  }));
}

export async function createOrder(
  customerName: string, 
  transactionId: string,
  standId: string,
  items: Array<{
    productId: string,
    quantity: number,
    unitPrice: number
  }>,
  totalAmount: number
) {
  // Criar o pedido primeiro
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_name: customerName,
      transaction_id: transactionId,
      stand_id: standId,
      total_amount: totalAmount
    })
    .select()
    .single();

  if (orderError) {
    console.error('Erro ao criar pedido:', orderError);
    return { success: false, error: orderError };
  }

  // Depois adicionar os itens do pedido
  const orderItems = items.map(item => ({
    order_id: order.id,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price: item.unitPrice
  }));

  const { error: itemsError } = await supabase
    .from('order_items')
    .insert(orderItems);

  if (itemsError) {
    console.error('Erro ao adicionar itens ao pedido:', itemsError);
    return { success: false, error: itemsError };
  }

  return { success: true, orderId: order.id };
}
