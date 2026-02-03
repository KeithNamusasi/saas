import { supabase } from "./supabase-client.js";

/**
 * Load all products for a user (for the dropdown)
 */
export async function getProductsForSelect(user) {
    const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('user_id', user.id)
        .order('name', { ascending: true });

    if (error) {
        console.error('Error loading products for select:', error);
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

/**
 * Record a new sale and update product stock
 */
export async function recordSale(user, sale) {
    const { data: authData } = await supabase.auth.getUser();
    const authUser = authData?.user;
    if (!authUser) {
        return { error: new Error('NOT_AUTHENTICATED') };
    }
    if (user?.id && authUser.id !== user.id) {
        return { error: new Error('USER_MISMATCH') };
    }
    // Record the sale
    const { data, error } = await supabase
        .from("sales")
        .insert([
            {
                user_id: authUser.id,
                product_id: sale.product_id,
                product_name: sale.product_name,
                quantity: sale.quantity,
                unit_price: sale.unit_price,
                total_amount: sale.total_amount,
                profit: sale.profit,
                sale_date: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
        console.error("Error recording sale:", error);
        return { error };
    }

    // 3. Update product stock
    const { error: updateError } = await supabase
        .from('products')
        .update({
            stock_qty: sale.new_stock,
            updated_at: new Date().toISOString()
        })
        .eq('id', sale.product_id)
        .eq('user_id', authUser.id);

    if (updateError) {
        console.error('Error updating stock after sale:', updateError);
        throw updateError;
    }

    return { data };
}
