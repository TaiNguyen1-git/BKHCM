'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { mockUsers } from '../mockData';

// Định nghĩa kiểu dữ liệu cho User
export type User = {
  id: string;
  username: string;
  password: string;
  name: string;
  role: string;
  email: string;
  avatar: string | null;
};

// Định nghĩa kiểu dữ liệu cho UserContext
type UserContextType = {
  users: User[];
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  getUserById: (id: string) => User | undefined;
};

// Tạo context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Tạo provider component
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);

  // Khởi tạo dữ liệu từ localStorage hoặc mockData
  useEffect(() => {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      setUsers(mockUsers);
      localStorage.setItem('users', JSON.stringify(mockUsers));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (users.length > 0) {
      localStorage.setItem('users', JSON.stringify(users));
    }
  }, [users]);

  // Thêm người dùng mới
  const addUser = (user: User) => {
    setUsers(prevUsers => [...prevUsers, user]);
  };

  // Cập nhật thông tin người dùng
  const updateUser = (updatedUser: User) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      )
    );
  };

  // Xóa người dùng
  const deleteUser = (id: string) => {
    setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
  };

  // Lấy thông tin người dùng theo ID
  const getUserById = (id: string) => {
    return users.find(user => user.id === id);
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser, getUserById }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook để sử dụng UserContext
export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};
