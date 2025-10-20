import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const InvoiceList = ({ invoices }) => {
  const navigate = useNavigate();
  const [sortOption, setSortOption] = useState('Newest');

  const sortedInvoices = [...invoices].sort((a, b) => {
    if (sortOption === 'Newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortOption === 'Oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortOption === 'Vendor A-Z') return a.vendor_name.localeCompare(b.vendor_name);
    if (sortOption === 'Vendor Z-A') return b.vendor_name.localeCompare(a.vendor_name);
    return 0;
  });

  return (
    <div className="p-4 space-y-4">
      {/* Sort Filter */}
      <div className="w-full mb-4">
        <label className="block text-gray-700 font-medium mb-1">Sort</label>
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="appearance-none w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
        >
          <option>Newest</option>
          <option>Oldest</option>
          <option>Vendor A-Z</option>
          <option>Vendor Z-A</option>
        </select>
      </div>

      {/* Invoices List */}
      {sortedInvoices.map((invoice) => (
        <div
          key={invoice.id}
          onClick={() => navigate(`/invoices/${invoice.id}`)}
          className="bg-white rounded-lg shadow p-4 flex flex-col gap-2 cursor-pointer hover:shadow-md transition"
        >
          <div className="flex justify-between items-start">
            <h2 className="font-semibold text-lg text-gray-900">{invoice.vendor_name}</h2>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
              {invoice.total}$
            </span>
          </div>
          <p className="text-gray-400 text-xs">{new Date(invoice.created_at).toLocaleDateString()}</p>
        </div>
      ))}

      {sortedInvoices.length === 0 && (
        <div className="text-center text-gray-500 py-4">No invoices found</div>
      )}
    </div>
  );
};

export default InvoiceList;
