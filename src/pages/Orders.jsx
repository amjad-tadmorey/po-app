import { useEffect, useState } from 'react';
import OrderList from '../components/OrderList';
import { getOrders } from '../api/orders';

const Orders = ({ user }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            setLoading(true);
            const { data, error } = await getOrders(user);
            if (error) setError(error);
            else setOrders(data);
            setLoading(false);
        };

        fetchOrders();
    }, [user]);

    if (loading) return <div className="p-4 text-center">Loading orders...</div>;
    if (error) return <div className="p-4 text-red-600 text-center">{error}</div>;

    return <OrderList orders={orders} />;
};

export default Orders;
