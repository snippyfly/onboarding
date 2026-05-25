import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const USERS = {
  customer: {
    name: 'Admin User',
    role: 'customer',
    title: 'Global Controller',
    initial: 'A',
    defaultPath: '/dashboard',
  },
  admin: {
    name: 'Ops Admin',
    role: 'admin',
    title: '运营管理员',
    initial: 'O',
    defaultPath: '/ops/tenants',
  },
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = useCallback((role) => {
    setUser(USERS[role] || null);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { USERS };
