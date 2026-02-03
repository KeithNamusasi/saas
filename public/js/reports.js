import { supabase } from './supabase-client.js';

/**
 * Load all sales for a user
 */
export async function getAllSales(user) {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('user_id', user.id)
    .order('sale_date', { ascending: false });

  if (error) {
    console.error('Error loading all sales:', error);
    throw error;
  }
  return data;
}
