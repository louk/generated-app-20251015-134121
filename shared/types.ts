export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
// Minimal real-world chat example types (shared by frontend and worker)
export interface User {
  id: string;
  name: string;
  password?: string; // Added for auth
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
export interface Product {
  id: string;
  name: string; // Mongolian
  description: string; // Mongolian
  image: string;
  price: number;
  originalPrice: number;
  category: string; // Mongolian
  brand: string;
  colors: string[]; // Hex codes
  rating: number;
  reviews: number;
  submittedBy: string; // User ID of the submitter
}
export type SortOption = 'rating-desc' | 'price-asc' | 'price-desc' | 'newest';
export interface CartItem extends Product {
  quantity: number;
}