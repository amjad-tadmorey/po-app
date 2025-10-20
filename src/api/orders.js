import { supabase } from "./supabaseClinet";

// Fetch orders (filtered by role)
export const getOrders = async (user) => {
  let query = supabase.from('purchase_orders').select('*');

  if (user.role === 'manager') {
    query = query.eq('manager_id', user.id);
  } else if (user.role === 'buyer') {
    query = query.eq('status', 'Accepted');
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  return { data, error };
};

// Create order
export const createOrder = async (manager_id, branch_name, items, notes) => {
  const { data, error } = await supabase.from('purchase_orders').insert([
    { manager_id, branch_name, items, notes }
  ]);
  return { data, error };
};

// Update multiple fields of an order
export const updateOrder = async (order_id, updates) => {
  // updates is an object like { status: 'accepted', total: 100, note: 'Urgent' }
  const { data, error } = await supabase
    .from('purchase_orders')
    .update({ ...updates, updated_at: new Date() })
    .eq('id', order_id);

  return { data, error };
};

// Update order status (for admin/buyer)
export const updateOrderStatus = async (order_id, status) => {
  const { data, error } = await supabase
    .from('purchase_orders')
    .update({ status, updated_at: new Date() })
    .eq('id', order_id);
  return { data, error };
};
