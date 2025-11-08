import api from '../lib/axios';
import type { Category } from '../types';

export async function getCategories(): Promise<Category[]> {
  const { data } = await api.get('/categories');
  return data;
}
