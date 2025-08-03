import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AdminDashboard from './AdminDashboard';

const AdminRoute = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is already logged in
    const savedAdmin = localStorage.getItem('roboturkiye_admin');
    if (savedAdmin) {
      try {
        const adminData = JSON.parse(savedAdmin);
        setAdmin(adminData);
      } catch (error) {
        console.error('Error loading admin data:', error);
        localStorage.removeItem('roboturkiye_admin');
      }
    }
    setLoading(false);
  }, []);

  const handleAdminLogin = (adminData) => {
    setAdmin(adminData);
    localStorage.setItem('roboturkiye_admin', JSON.stringify(adminData));
  };

  const handleAdminLogout = () => {
    setAdmin(null);
    localStorage.removeItem('roboturkiye_admin');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!admin) {
    return <AdminLogin onAdminLogin={handleAdminLogin} />;
  }

  return <AdminDashboard admin={admin} onLogout={handleAdminLogout} />;
};

export default AdminRoute;