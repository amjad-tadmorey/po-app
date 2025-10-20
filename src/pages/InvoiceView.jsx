import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../api/supabaseClinet";

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Processing: "bg-blue-100 text-blue-800",
    Completed: "bg-gray-100 text-gray-800",
};

const InvoiceView = () => {
    const { id } = useParams();
    const [invoice, setInvoice] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInvoice = async () => {
            const { data, error } = await supabase
                .from("invoices")
                .select("*")
                .eq("id", id)
                .single();

            if (!error) setInvoice(data);
            setLoading(false);
        };
        fetchInvoice();
    }, [id]);

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
    if (!invoice) return <div className="p-6 text-center text-red-600">Invoice not found</div>;

    return (
        <div className="p-4 space-y-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-bold text-gray-800">{invoice.vendor_name}</h1>
                <p className="text-gray-400 text-sm">
                    Invoice ID: {invoice.id} | Created: {new Date(invoice.created_at).toLocaleString()}
                </p>
            </div>

            {/* Items */}
            <div className="space-y-2 border p-2 rounded">
                {invoice.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                        <span>{item.name} (Qty: {item.qty})</span>
                        <span>${item.price}</span>
                    </div>
                ))}
            </div>

            {/* Summary */}
            <div className="space-y-1 p-2 border rounded text-sm">
                <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${invoice.subtotal}</span>
                </div>
                <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>${invoice.tax}</span>
                </div>
                <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${invoice.total}</span>
                </div>
            </div>

            <div className="px-2 py-1 text-xs text-gray-500">
                Buyer ID: {invoice.buyer_id} | Order ID: {invoice.order_id}
            </div>
        </div>
    );
};

export default InvoiceView;
