import React from 'react';
import { Bell, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { signOut } from '../api/auth';

const Header = ({ user }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <header className="w-full bg-white shadow-md px-4 py-3 flex justify-between items-center sticky top-0 z-50">
            {/* Left: Logo / Title */}
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {user.name.slice(0, 1)}
                </div>
                <h1 className="text-xl font-semibold text-gray-800">Po App</h1>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center space-x-4">

                {/* User menu */}
                <div className="flex items-center space-x-2">
                    <span className="text-gray-700 font-medium">{user?.name || 'User'}</span>
                    <User size={24} className="text-gray-600" />
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-3 py-1 rounded-lg font-medium hover:from-blue-500 hover:to-purple-500 shadow transition"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;
