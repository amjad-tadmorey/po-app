import { useEffect, useState } from 'react';
import InvoiceList from '../components/InvoiceList';
import { getInvoices } from '../api/invoices';

const Invoices = ({ user }) => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchInvoices = async () => {
      setLoading(true);
      const { data, error } = await getInvoices(user);
      if (error) setError(error.message || 'Failed to fetch invoices.');
      else setInvoices(data);
      setLoading(false);
    };

    fetchInvoices();
  }, [user]);

  if (loading) return <div className="p-4 text-center text-gray-500">Loading invoices...</div>;
  if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

  return <InvoiceList invoices={invoices} />;
};

export default Invoices;
