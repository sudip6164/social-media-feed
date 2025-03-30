import { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const _setUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('is_login', '1');
    } else {
      localStorage.removeItem('user');
      localStorage.setItem('is_login', '0');
    }
  };

  return (
    <UserContext.Provider value={{ user, _setUser }}>
      {children}
    </UserContext.Provider>
  );
}