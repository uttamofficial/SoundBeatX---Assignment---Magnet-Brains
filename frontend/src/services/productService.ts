import { Product } from '../types';
import { products as mockProducts } from '../data/products';
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5010';

export const productService = {
  // Get all products
  async getAllProducts(): Promise<Product[]> {
    try {
      const res = await fetch(`${BASE_URL}/api/products`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return await res.json();
    } catch (error) {
      console.warn('Falling back to mock products:', (error as Error).message);
      return mockProducts;
    }
  },

  // Get product by ID
  async getProductById(id: number): Promise<Product | null> {
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}`);
      if (!res.ok) throw new Error('Failed');
      return await res.json();
    } catch (error) {
      return mockProducts.find(p => p.id === id) || null;
    }
  },

  // Create a new product
  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/api/admin/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error('Failed to create product');
    const data = await res.json();
    return (data.product || data) as Product;
  },

  // Update a product
  async updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
    const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!res.ok) throw new Error('Failed to update product');
    return await res.json();
  },

  // Delete a product
  async deleteProduct(id: number): Promise<void> {
    const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, {
      method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete product');
  }
};