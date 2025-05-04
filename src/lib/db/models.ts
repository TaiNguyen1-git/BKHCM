// This is a sample model file to demonstrate how you might structure your database models
// In a real application, you would use a database ORM like Prisma or Mongoose

import { User, Product } from '@/types';

/**
 * Mock function to get user by ID
 */
export async function getUserById(id: string): Promise<User | null> {
  // In a real app, this would query a database
  const mockUsers: User[] = [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
    },
    {
      id: '2',
      name: 'Admin User',
      email: 'admin@example.com',
      role: 'admin',
      avatar: 'https://i.pravatar.cc/150?u=admin',
    },
  ];

  const user = mockUsers.find(user => user.id === id);
  return user || null;
}

/**
 * Mock function to get products
 */
export async function getProducts(): Promise<Product[]> {
  // In a real app, this would query a database
  return [
    {
      id: '1',
      name: 'Product 1',
      description: 'This is product 1',
      price: 100,
      image: 'https://via.placeholder.com/150',
      category: 'electronics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'This is product 2',
      price: 200,
      image: 'https://via.placeholder.com/150',
      category: 'clothing',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
} 