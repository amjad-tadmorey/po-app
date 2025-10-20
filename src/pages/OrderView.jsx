import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../api/supabaseClinet";
import { updateOrder, updateOrderStatus } from "../api/orders";
import { createInvoice } from "../api/invoices";

const statusStyles = {
    Pending: "bg-yellow-100 text-yellow-800",
    Accepted: "bg-green-100 text-green-800",
    Rejected: "bg-red-100 text-red-800",
    Processing: "bg-blue-100 text-blue-800",
    Completed: "bg-green-100 text-green-800",
};

// Toast component
const Toast = ({ message, type = "success", onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = { success: "bg-green-500 text-white", error: "bg-red-500 text-white" };

    return (
        <div className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg ${colors[type]} animate-slide-in`} style={{ zIndex: 9999 }}>
            {message}
        </div>
    );
};

const OrderView = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // Invoice modal state
    const [showModal, setShowModal] = useState(false);
    const [invoiceItems, setInvoiceItems] = useState([]);
    const [vendorName, setVendorName] = useState("");
    const [tax, setTax] = useState(0);
    const [creatingInvoice, setCreatingInvoice] = useState(false);

    useEffect(() => {
        const fetchOrder = async () => {
            const { data, error } = await supabase.from("purchase_orders").select("*").eq("id", id).single();
            if (!error) setOrder(data);
            setLoading(false);
        };
        fetchOrder();
    }, [id]);

    const handleStatusChange = async (newStatus) => {
        if (!order) return;
        setSaving(true);
        const { error } = await updateOrderStatus(order.id, newStatus);
        if (!error) setOrder({ ...order, status: newStatus });
        setSaving(false);
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...order.items];
        if (field === "qty") updatedItems[index][field] = parseInt(value);
        else if (field === "price") updatedItems[index][field] = parseFloat(value);
        else updatedItems[index][field] = value;
        setOrder({ ...order, items: updatedItems });
    };

    const handleSaveItems = async () => {
        if (!order) return;
        setSaving(true);
        const { error } = await updateOrder(order.id, { items: order.items });
        if (error) setToast({ message: "Error saving items: " + error.message, type: "error" });
        else setToast({ message: "Items saved successfully!", type: "success" });
        setSaving(false);
    };

    const toggleInvoiceItem = (item) => {
        if (invoiceItems.includes(item)) setInvoiceItems(invoiceItems.filter(i => i !== item));
        else setInvoiceItems([...invoiceItems, item]);
    };

    const handleCreateInvoice = async () => {
        if (!invoiceItems.length) return setToast({ message: "Select at least one item", type: "error" });
        setCreatingInvoice(true);
        const buyer_id = order.manager_id;
        const { data, error } = await createInvoice({ order_id: order.id, buyer_id, vendor_name: vendorName, items: invoiceItems, tax });
        if (error) setToast({ message: "Error creating invoice", type: "error" });
        else {
            setToast({ message: "Invoice created successfully", type: "success" });
            setShowModal(false);
            setInvoiceItems([]);
            setVendorName("");
            setTax(0);
        }
        setCreatingInvoice(false);
    };

    const subtotal = invoiceItems.reduce((sum, i) => sum + i.price, 0);
    const total = subtotal + tax;

    if (loading) return <div className="p-6 text-center text-gray-500">Loading...</div>;
    if (!order) return <div className="p-6 text-center text-red-600">Order not found</div>;

    return (
        <>
            <div className="p-4 space-y-6 max-w-lg mx-auto bg-white rounded-2xl shadow-lg">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">{order.branch_name}</h1>
                        <p className="text-gray-400 text-sm mt-1">
                            Created: {new Date(order.created_at).toLocaleString()} | Updated: {new Date(order.updated_at).toLocaleString()}
                        </p>
                    </div>
                    <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`px-4 py-2 rounded-full text-sm font-medium ${statusStyles[order.status]} w-full sm:w-auto`}
                        disabled={saving}
                    >
                        {["Pending", "Accepted", "Rejected", "Processing", "Completed"].map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>

                {order.notes && <p className="text-gray-500 text-sm">{order.notes}</p>}

                {/* Items */}
                <div className="space-y-3">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex flex-col gap-2 p-2 border border-gray-200 rounded">
                            <label className="flex flex-col text-sm text-gray-700">
                                Item Name
                                <input
                                    type="text"
                                    value={item.name}
                                    onChange={e => handleItemChange(idx, "name", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                                    placeholder="Item name"
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Quantity
                                <input
                                    type="number"
                                    value={item.qty}
                                    min={0}
                                    onChange={e => handleItemChange(idx, "qty", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                                    placeholder="Qty"
                                />
                            </label>

                            <label className="flex flex-col text-sm text-gray-700">
                                Price
                                <input
                                    type="number"
                                    value={item.price}
                                    min={0}
                                    step="0.01"
                                    onChange={e => handleItemChange(idx, "price", e.target.value)}
                                    className="w-full border border-gray-300 rounded px-2 py-2 text-sm"
                                    placeholder="Price"
                                />
                            </label>
                        </div>

                    ))}
                </div>

                <button onClick={handleSaveItems} disabled={saving} className="w-full mt-4 bg-blue-500 text-white px-4 py-3 rounded-lg hover:bg-blue-600 transition">
                    {saving ? "Saving..." : "Save Items"}
                </button>

                {/* Create Invoice Button */}
                <button onClick={() => setShowModal(true)} className="w-full mt-2 bg-green-500 text-white px-4 py-3 rounded-lg hover:bg-green-600 transition">
                    Create Invoice
                </button>
            </div>

            {/* Invoice Modal */}
            {showModal && (
                <div className="fixed inset-0 w-screen flex justify-center items-center z-50 p-2">
                    {/* Blur background */}
                    <div className="absolute inset-0 bg-white/30 backdrop-blur-md" />

                    {/* Modal container */}
                    <div className="relative bg-white rounded-2xl w-full max-w-sm sm:max-w-md p-4 sm:p-6 space-y-4 shadow-lg flex flex-col z-10 overflow-y-auto max-h-[90vh]">
                        <h2 className="text-lg sm:text-xl font-bold text-gray-800 text-center">Create Invoice</h2>

                        <input
                            type="text"
                            placeholder="Vendor Name"
                            value={vendorName}
                            onChange={e => setVendorName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm sm:text-base"
                        />

                        <input
                            type="number"
                            placeholder="Tax"
                            value={tax}
                            min={0}
                            onChange={e => setTax(parseFloat(e.target.value))}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:border-transparent transition text-sm sm:text-base"
                        />

                        {/* Items list */}
                        <div className="max-h-52 sm:max-h-60 overflow-y-auto border p-2 rounded space-y-2">
                            {order.items.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm sm:text-base">
                                    <input type="checkbox" checked={invoiceItems.includes(item)} onChange={() => toggleInvoiceItem(item)} className="w-4 h-4" />
                                    <span>{item.name} - Qty: {item.qty} - Price: {item.price}</span>
                                </div>
                            ))}
                        </div>

                        {/* Invoice summary */}
                        <div className="p-2 border rounded space-y-1 text-sm sm:text-base">
                            <div className="flex justify-between">
                                <span>Subtotal:</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Tax:</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between font-bold">
                                <span>Total:</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row justify-between gap-2">
                            <button onClick={() => setShowModal(false)} className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition text-sm sm:text-base">
                                Cancel
                            </button>
                            <button onClick={handleCreateInvoice} disabled={creatingInvoice} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition text-sm sm:text-base">
                                {creatingInvoice ? "Creating..." : "Create Invoice"}
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default OrderView;
