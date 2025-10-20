import { supabase } from "../api/supabaseClinet";


// Fetch invoices (filtered by role)
export const getInvoices = async (user) => {
    let query = supabase.from('invoices').select('*');


    // Order by newest first
    const { data, error } = await query.order('created_at', { ascending: false });
    return { data, error };
};


export const createInvoice = async ({ order_id, buyer_id, vendor_name, items, tax = 0 }) => {
    try {
        const subtotal = items.reduce((sum, i) => sum + i.qty * i.price, 0);
        const total = subtotal + tax;

        const { data, error } = await supabase
            .from("invoices")
            .insert([
                {
                    order_id,
                    buyer_id,
                    vendor_name,
                    items,
                    subtotal,
                    tax,
                    total,
                }
            ])
            .single();

        return { data, error };
    } catch (err) {
        return { data: null, error: err };
    }
};
