import api from '../lib/axios';

export type Product = { id?: number; name: string; price: number };

export async function getProducts(): Promise<Product[]> {
  const { data } = await api.get('/products');
  return data;
}
export async function createProduct(p: Product): Promise<Product> {
  const { data } = await api.post('/products', p);
  return data;
}
export async function updateProduct(id: number, p: Product): Promise<Product> {
  const { data } = await api.put(`/products/${id}`, p);
  return data;
}
export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}
