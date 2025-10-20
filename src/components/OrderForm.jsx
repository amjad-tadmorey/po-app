import React, { useState } from "react";
import { createOrder } from "../api/orders";
import { Plus, X } from "lucide-react";

// Branch options
const branches = ["Branch 1", "Branch 2"];

// Toast component
const Toast = ({ message, type = "success", onClose }) => {
    React.useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const colors = {
        success: "bg-green-500 text-white",
        error: "bg-red-500 text-white",
    };

    return (
        <div
            className={`fixed top-4 right-4 px-4 py-2 rounded-xl shadow-lg ${colors[type]} animate-slide-in`}
            style={{ zIndex: 9999 }}
        >
            {message}
        </div>
    );
};

// Add this to your global CSS for animation
// .animate-slide-in { animation: slideIn 0.3s ease-out; }
// @keyframes slideIn { 0% { transform: translateX(100%); opacity:0 } 100% { transform: translateX(0); opacity:1 } }

const OrderForm = ({ user }) => {
    const [branch, setBranch] = useState(branches[0]);
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState([{ name: "", qty: 1, price: 0 }]);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...items];
        if (field === "qty") updatedItems[index][field] = parseInt(value);
        else updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const addItem = () => setItems([...items, { name: "", qty: 1, price: 0 }]);
    const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        const manager_id = user.id;
        const orderItems = items.map((i) => ({ ...i, price: 0 }));
        const { data, error } = await createOrder(manager_id, branch, orderItems, notes);

        if (error) setToast({ message: error.message, type: "error" });
        else {
            setToast({ message: "Order created successfully!", type: "success" });
            setBranch(branches[0]);
            setNotes("");
            setItems([{ name: "", qty: 1, price: 0 }]);
        }

        setSaving(false);
    };

    return (
        <>
            <form
                className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg space-y-6"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold text-gray-800 text-center">Create Order</h2>

                {/* Branch */}
                <div className="relative">
                    <select
                        value={branch}
                        onChange={(e) => setBranch(e.target.value)}
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                    >
                        {branches.map((b) => (
                            <option key={b} value={b}>{b}</option>
                        ))}
                    </select>
                </div>

                {/* Notes */}
                <div className="relative">
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        rows={3}
                        placeholder="Notes (optional)"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition resize-none"
                    />
                </div>

                {/* Items */}
                <div className="space-y-3">
                    {items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center overflow-x-auto">
                            <input
                                type="text"
                                placeholder="Item Name"
                                value={item.name}
                                onChange={(e) => handleItemChange(idx, "name", e.target.value)}
                                className="flex-[2] min-w-[140px] border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-purple-400 transition"
                                required
                            />
                            <input
                                type="number"
                                placeholder="Qty"
                                value={item.qty}
                                min={1}
                                onChange={(e) => handleItemChange(idx, "qty", e.target.value)}
                                className="flex-1 min-w-[60px] border border-gray-300 rounded-xl px-3 py-3 focus:ring-2 focus:ring-purple-400 transition"
                                required
                            />
                            <X
                                color="red"
                                onClick={() => removeItem(idx)}
                            />
                        </div>
                    ))}
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                    <Plus
                        color="green"
                        onClick={addItem}
                    />
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg"
                    >
                        {saving ? "Creating..." : "Create Order"}
                    </button>
                </div>
            </form>

            {/* Toast */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </>
    );
};

export default OrderForm;
