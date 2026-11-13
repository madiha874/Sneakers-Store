import { requireSupabase } from '../lib/supabase';
import { Order } from '../types';

export interface CheckoutPayload {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  city: string;
  postalCode: string;
  orderNotes?: string;
  couponCode?: string | null;
  items: Array<{
    variant_id: string;
    quantity: number;
  }>;
}

export interface CouponValidationResult {
  valid: boolean;
  code?: string;
  discount_type?: 'percentage' | 'fixed';
  discount_value?: number;
  discount_pkr?: number;
  description?: string;
  message?: string;
}

export async function validateCouponCode(
  code: string,
  subtotalPkr: number
): Promise<CouponValidationResult> {
  const client = requireSupabase();
  const { data, error } = await client.rpc('validate_coupon', {
    p_code: code,
    p_subtotal_pkr: subtotalPkr,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data as CouponValidationResult;
}

export async function placeCodOrder(payload: CheckoutPayload): Promise<Order> {
  const client = requireSupabase();

  const { data, error } = await client.rpc('place_cod_order', {
    p_customer_name: payload.customerName,
    p_customer_email: payload.customerEmail,
    p_customer_phone: payload.customerPhone,
    p_shipping_address: payload.shippingAddress,
    p_city: payload.city,
    p_postal_code: payload.postalCode,
    p_order_notes: payload.orderNotes ?? '',
    p_coupon_code: payload.couponCode ?? null,
    p_items: payload.items,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error('Order could not be confirmed by database.');
  }

  return data as Order;
}

export async function fetchMyOrders(userId: string): Promise<Order[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Order[];
}

export async function fetchOrderByNumber(orderNumber: string): Promise<Order | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('orders')
    .select('*, items:order_items(*)')
    .eq('order_number', orderNumber)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data as Order | null) ?? null;
}
