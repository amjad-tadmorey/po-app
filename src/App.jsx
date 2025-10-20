import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { getCurrentUser } from './api/auth';
import { supabase } from './api/supabaseClinet';

import Login from './pages/Login';
import Signup from './pages/Signup';
import OrderView from './pages/OrderView';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import Home from './pages/Home';
import AppLayout from './components/AppLayout';
import Invoices from './pages/Invoices';
import InvoiceView from './pages/InvoiceView';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      getCurrentUser().then(setUser);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
        <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" replace />} />

        {/* Protected routes wrapped with layout (thumb nav visible) */}
        <Route
          element={user ? <AppLayout user={user} /> : <Navigate to="/login" replace />}
        >
          <Route path="/" element={<Home user={user} />} />
          <Route path="/orders" element={<Orders user={user} />} />
          <Route path="/orders/:id" element={<OrderView user={user} />} />
          <Route path="/invoices" element={<Invoices user={user} />} />
          <Route path="/invoices/:id" element={<InvoiceView user={user} />} />
          <Route path="/profile" element={<Profile user={user} />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
