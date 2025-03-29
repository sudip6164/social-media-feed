// src/pages/context/admin.context.jsx
import { createContext, useState, useEffect } from 'react';

export const AdminContext = createContext();

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  const _setAdmin = (adminData) => {
    setAdmin(adminData);
    if (adminData) {
      localStorage.setItem('admin', JSON.stringify(adminData));
      localStorage.setItem('is_admin_login', '1');
    } else {
      localStorage.removeItem('admin');
      localStorage.setItem('is_admin_login', '0');
    }
  };

  return (
    <AdminContext.Provider value={{ admin, _setAdmin }}>
      {children}
    </AdminContext.Provider>
  );
}