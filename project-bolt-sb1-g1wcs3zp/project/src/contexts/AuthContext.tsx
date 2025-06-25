import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import { User, AuthContextType } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demonstration
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@embu.ac.ke',
    name: 'Admin User',
    role: 'admin',
    department: 'Administration',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'faculty@embu.ac.ke',
    name: 'Dr. Jane Smith',
    role: 'faculty',
    department: 'Computer Science',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'student@embu.ac.ke',
    name: 'John Doe',
    role: 'student',
    studentId: 'CS/2024/001',
    department: 'Computer Science',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('auth-token');
    const userData = Cookies.get('user-data');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Failed to parse user data:', error);
        Cookies.remove('auth-token');
        Cookies.remove('user-data');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Mock authentication - in real app, this would call your API
    const foundUser = mockUsers.find(u => u.email === email);
    
    if (foundUser && password === 'password123') {
      const token = 'mock-jwt-token-' + foundUser.id;
      
      Cookies.set('auth-token', token, { expires: 7 });
      Cookies.set('user-data', JSON.stringify(foundUser), { expires: 7 });
      
      setUser(foundUser);
      setLoading(false);
      return true;
    }
    
    setLoading(false);
    return false;
  };

  const logout = () => {
    Cookies.remove('auth-token');
    Cookies.remove('user-data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};