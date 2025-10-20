import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { signOut } from '../api/auth';
import Header from './Header';
import ThumbNav from './Thumbnav';

const AppLayout = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  console.log(user);

  return (
    <div
      className="relative min-h-screen pb-16 text-gray-800"
      style={{
        background: `radial-gradient(ellipse at bottom, #f6f6f6 0%, #ffffff 70%)`,
      }}
    >
      {/* Header */}
      <Header user={user} />

      {/* Main content */}
      <main className="p-4">
        <Outlet />
      </main>

      {/* Thumb nav */}
      <ThumbNav />
    </div>
  );
};

export default AppLayout;
