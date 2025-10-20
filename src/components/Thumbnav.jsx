import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ShoppingCart, User, LogOut, ReceiptIcon } from 'lucide-react';
import { signOut } from '../api/auth';

const ThumbNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', icon: <Home size={24} />, path: '/' },
    { label: 'Orders', icon: <ShoppingCart size={24} />, path: '/orders' },
    { label: 'Invoices', icon: <ReceiptIcon size={24} />, path: '/invoices' },
    { label: 'Profile', icon: <User size={24} />, path: '/profile' },
    { label: 'Logout', icon: <LogOut size={24} />, action: handleLogout },
  ];

  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 shadow-lg z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={item.action ? item.action : () => navigate(item.path)}
            className={`flex flex-col items-center justify-center transition-colors
              ${location.pathname === item.path ? 'text-blue-500' : 'text-gray-600'}
              hover:text-blue-500`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ThumbNav;
