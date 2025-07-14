export * from './Product';
export * from './User';
export * from './Order';
export * from './Payment';
export * from './UploadedImage';

// Common API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Common UI types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  isPreorder: boolean;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}