import { supabase } from "./supabase-client.js";

/**
 * Get business record or create it if missing
 */
export async function getOrCreateBusiness(user, businessDetails = {}) {
    // 1. Try to fetch existing business
    const { data: existingBusiness, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

    if (fetchError) {
        console.error('Error fetching business:', fetchError);
        throw fetchError;
    }

    if (existingBusiness) return existingBusiness;

    // 2. Create if missing
    const { data: newBusiness, error: insertError } = await supabase
        .from('businesses')
        .insert({
            user_id: user.id,
            business_name: businessDetails.name || "My Business",
            phone_number: businessDetails.phone || "",
            email: user.email
        })
        .select()
        .single();

    if (insertError) {
        console.error('Error creating business:', insertError);
        throw insertError;
    }

    return newBusiness;
}
