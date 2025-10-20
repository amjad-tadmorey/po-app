import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const statusStyles = {
    Pending: 'bg-yellow-100 text-yellow-800',
    Accepted: 'bg-green-100 text-green-800',
    Rejected: 'bg-red-100 text-red-800',
    Processing: 'bg-blue-100 text-blue-800',
    Completed: 'bg-gray-100 text-gray-800',
};

const OrderList = ({ orders }) => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('All');
    const [sortOption, setSortOption] = useState('Newest');

    const filteredOrders =
        statusFilter === 'All'
            ? orders
            : orders.filter((order) => order.status === statusFilter);

    const sortedOrders = [...filteredOrders].sort((a, b) => {
        if (sortOption === 'Newest') return new Date(b.created_at) - new Date(a.created_at);
        if (sortOption === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
        if (sortOption === 'Branch A-Z') return a.branch_name.localeCompare(b.branch_name);
        if (sortOption === 'Branch Z-A') return b.branch_name.localeCompare(a.branch_name);
        return 0;
    });

    return (
        <div className="p-4 space-y-4">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
                {/* Status Filter */}
                <div className="relative w-full sm:w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    >
                        <option>All</option>
                        <option>Pending</option>
                        <option>Accepted</option>
                        <option>Rejected</option>
                        <option>Processing</option>
                        <option>Completed</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>

                {/* Sort Filter */}
                <div className="relative w-full sm:w-1/2">
                    <label className="block text-gray-700 font-medium mb-1">Sort</label>
                    <select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
                    >
                        <option>Newest</option>
                        <option>Oldest</option>
                        <option>Branch A-Z</option>
                        <option>Branch Z-A</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>


            {/* Orders List */}
            {sortedOrders.map((order) => (
                <div
                    key={order.id}
                    onClick={() => navigate(`/orders/${order.id}`)}
                    className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
                >
                    <div className="flex justify-between items-start">
                        <h2 className="font-semibold text-lg text-gray-900">{order.branch_name}</h2>
                        <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${statusStyles[order.status]}`}
                        >
                            {order.status}
                        </span>
                    </div>
                    {order.notes && (
                        <p className="text-gray-500 text-sm break-words">Notes: {order.notes}</p>
                    )}
                    <p className="text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
            ))}

            {sortedOrders.length === 0 && (
                <div className="text-center text-gray-500 py-4">No orders found</div>
            )}
        </div>
    );
};

export default OrderList;
