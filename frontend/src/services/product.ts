import api from '../lib/axios';
import type { Product, ProductPayload } from '../types';

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get<Product[]>('/products');
  return data;
}

export async function createProduct(p: ProductPayload): Promise<Product> {
  const { data } = await api.post<Product>('/products', p);
  return data;
}

export async function updateProduct(id: number, p: ProductPayload): Promise<Product> {
  const { data } = await api.put<Product>(`/products/${id}`, p);
  return data;
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

export async function readProduct(id: number): Promise<Product> {
  const { data } = await api.get<Product>(`/products/${id}`);
  return data;
}