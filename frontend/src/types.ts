export type Category = 'ELECTRONICS' | 'FASHION' | 'FOOD' | 'HOME' | 'OTHER';

export type Product = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  description?: string;
  category: Category;
};

export type ProductPayload = Omit<Product, 'id'>;

export type LoginRequest = { username: string; password: string };
export type LoginResponse = { token: string; username: string };
