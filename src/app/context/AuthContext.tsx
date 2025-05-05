'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '../mockData';

// Define the User type
type User = {
  id: string;
  username: string;
  name: string;
  role: string;
  email: string;
  avatar: null; // Changed from string | null to match mockData structure
  phone?: string;
  department?: string;
  bio?: string;
};

// Define the AuthContext type
type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<User | null>;
  logout: () => void;
  isLoading: boolean;
  updateUserProfile: (updatedUser: User) => void;
  changePassword: (userId: string, currentPassword: string, newPassword: string) => boolean;
};

// Create the AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));

      // Đảm bảo cookie auth-token được thiết lập
      if (!document.cookie.includes('auth-token=')) {
        document.cookie = "auth-token=true; path=/; max-age=86400"; // Hết hạn sau 1 ngày
      }
    }
    setIsLoading(false);
  }, []);

  // Login function
  const login = async (username: string, password: string): Promise<User | null> => {
    setIsLoading(true);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user in mock data - support both username and email login
    const foundUser = mockUsers.find(
      user => (user.username === username || user.email === username) && user.password === password
    );

    if (foundUser) {
      // Remove password from user object before storing
      const { password, ...userWithoutPassword } = foundUser;
      const userData = userWithoutPassword as User;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      // Thêm cookie để middleware có thể xác thực
      document.cookie = "auth-token=true; path=/; max-age=86400"; // Hết hạn sau 1 ngày

      setIsLoading(false);
      return userData;
    }

    setIsLoading(false);
    return null;
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');

    // Xóa cookie auth-token
    document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

    window.location.replace('/login');
  };

  // Update user profile function
  const updateUserProfile = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));

    // Update user in mockUsers for persistence
    const userIndex = mockUsers.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      // Preserve the password
      const password = mockUsers[userIndex].password;
      // Update the user in mockUsers
      mockUsers[userIndex] = {
        ...updatedUser,
        password,
        avatar: null // Always set avatar to null to match the mockData structure
      };
    }
  };

  // Change password function
  const changePassword = (userId: string, currentPassword: string, newPassword: string): boolean => {
    const userIndex = mockUsers.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return false;
    }

    // Verify current password
    if (mockUsers[userIndex].password !== currentPassword) {
      return false;
    }

    // Update password
    mockUsers[userIndex].password = newPassword;
    return true;
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isLoading,
      updateUserProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Create a hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
