import React, { useEffect } from "react";

const Toast = ({ message, type = "success", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000); // auto-close after 3s
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    info: "bg-blue-500 text-white",
  };

  return (
    <div
      className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg ${colors[type]} animate-slide-in`}
      style={{ zIndex: 9999 }}
    >
      {message}
    </div>
  );
};

export default Toast;
