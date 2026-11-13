import { requireSupabase } from '../lib/supabase';
import { Address, CartItem, Profile, WishlistItem } from '../types';

export async function fetchProfile(userId: string): Promise<Profile | null> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data as Profile | null) ?? null;
}

export async function updateProfile(
  userId: string,
  updates: { full_name: string; phone: string }
): Promise<Profile> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('profiles')
    .update({
      full_name: updates.full_name,
      phone: updates.phone,
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Profile;
}

export async function fetchAddresses(userId: string): Promise<Address[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('addresses')
    .select('*')
    .eq('user_id', userId)
    .order('is_default', { ascending: false })
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Address[];
}

export async function saveAddress(
  userId: string,
  address: Omit<Address, 'id' | 'user_id' | 'created_at'>
): Promise<Address> {
  const client = requireSupabase();
  if (address.is_default) {
    await client.from('addresses').update({ is_default: false }).eq('user_id', userId);
  }
  const { data, error } = await client
    .from('addresses')
    .insert({ ...address, user_id: userId })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data as Address;
}

export async function deleteAddress(addressId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('addresses').delete().eq('id', addressId);
  if (error) throw new Error(error.message);
}

export async function fetchWishlistDb(userId: string): Promise<WishlistItem[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('wishlist_items')
    .select(`
      id,
      product_id,
      created_at,
      product:products(
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as WishlistItem[];
}

export async function addToWishlistDb(userId: string, productId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from('wishlist_items')
    .upsert({ user_id: userId, product_id: productId }, { onConflict: 'user_id,product_id' });
  if (error) throw new Error(error.message);
}

export async function removeFromWishlistDb(userId: string, productId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw new Error(error.message);
}

export async function fetchCartDb(userId: string): Promise<CartItem[]> {
  const client = requireSupabase();
  const { data, error } = await client
    .from('cart_items')
    .select(`
      id,
      product_id,
      variant_id,
      quantity,
      product:products(
        *,
        category:categories(*),
        images:product_images(*),
        variants:product_variants(*)
      ),
      variant:product_variants(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as unknown as CartItem[];
}

export async function upsertCartItemDb(
  userId: string,
  productId: string,
  variantId: string,
  quantity: number
): Promise<void> {
  const client = requireSupabase();
  if (quantity <= 0) {
    await removeCartItemDb(userId, variantId);
    return;
  }
  const { error } = await client
    .from('cart_items')
    .upsert(
      { user_id: userId, product_id: productId, variant_id: variantId, quantity },
      { onConflict: 'user_id,variant_id' }
    );
  if (error) throw new Error(error.message);
}

export async function removeCartItemDb(userId: string, variantId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client
    .from('cart_items')
    .delete()
    .eq('user_id', userId)
    .eq('variant_id', variantId);
  if (error) throw new Error(error.message);
}

export async function clearCartDb(userId: string): Promise<void> {
  const client = requireSupabase();
  const { error } = await client.from('cart_items').delete().eq('user_id', userId);
  if (error) throw new Error(error.message);
}
