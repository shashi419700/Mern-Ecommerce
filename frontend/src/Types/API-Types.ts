import type { Product, User } from "./type";

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type AllProductsResponce = {
  success: boolean;
  product: Product[];
};

export type CategoriesResponce = {
  success: boolean;
  categories: string[];
};

export type SearchProductsResponce = {
  success: boolean;
  product: Product[];
  totalPage: number;
};

export type SearchProductsRequest = {
  price: number;
  page: number;
  category: string;
  search: string;
  sort: string;
};
export type ProductsResponce = {
  success: boolean;
  product: Product;
};
export type NewProductsRequest = {
  id: string;
  formData: FormData;
};

export type UpdateProductsRequest = {
  userId: string;
  productId: string;
  formData: FormData;
};

export type deleteProductsRequest = {
  userId: string;
  productId: string;
};

