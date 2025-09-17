import { Request } from 'express';
import { User } from '@prisma/client';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  image: string;
  categoryId: string;
  inStock?: boolean;
  rating?: number;
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  price?: number;
  image?: string;
  categoryId?: string;
  inStock?: boolean;
  rating?: number;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
}

export interface AddToCartRequest {
  productId: string;
  quantity: number;
}

export interface CreateOrderRequest {
  shippingAddress: string;
  notes?: string;
}

export interface CreateTestimonialRequest {
  name: string;
  location: string;
  text: string;
  rating: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
}
