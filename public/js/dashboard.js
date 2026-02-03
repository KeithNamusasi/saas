import { supabase } from './supabase-client.js';

/**
 * Load business information
 */
export async function getBusinessInfo(user) {
  const { data, error } = await supabase
    .from('businesses')
    .select('business_name')
    .eq('user_id', user.id)
    .maybeSingle();

  if (error) {
    console.error('Error loading business info:', error);
    throw error;
  }

  if (!data) {
    const { getOrCreateBusiness } = await import('./businesses.js');
    return await getOrCreateBusiness(user);
  }

  return data;
}

/**
 * Load today's statistics
 */
export async function getTodayStats(user) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('sales')
    .select('total_amount, profit, quantity')
    .eq('user_id', user.id)
    .gte('sale_date', today.toISOString());

  if (error) {
    console.error('Error loading stats:', error);
    throw error;
  }

  // Calculate totals
  const totalSales = data.reduce((sum, sale) => sum + parseFloat(sale.total_amount), 0);
  const totalProfit = data.reduce((sum, sale) => sum + parseFloat(sale.profit), 0);
  const totalItems = data.reduce((sum, sale) => sum + sale.quantity, 0);

  return { totalSales, totalProfit, totalItems };
}

/**
 * Load low stock alerts
 */
export async function getLowStockAlerts(user) {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user.id)
    .or(`stock_qty.lte.low_stock_level`)
    .order('stock_qty', { ascending: true });

  if (error) {
    console.error('Error loading low stock alerts:', error);
    throw error;
  }
  return data;
}

/**
 * Load recent sales
 */
export async function getRecentSales(user, limit = 10) {
  const { data, error } = await supabase
    .from('sales')
    .select('*')
    .eq('user_id', user.id)
    .order('sale_date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error loading recent sales:', error);
    throw error;
  }
  return data;
}
/**
 * Count total sales for a user
 */
export async function getSalesCount(user) {
  const { count, error } = await supabase
    .from('sales')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  if (error) {
    console.error('Error counting sales:', error);
    throw error;
  }
  return count || 0;
}
