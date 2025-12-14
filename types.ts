export enum Category {
  DOG = 'Dog',
  CAT = 'Cat',
  BIRD = 'Bird',
  SMALL_PET = 'Small Pet',
  ACCESSORIES = 'Accessories'
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  rating: number;
  reviews: number;
  badge?: string; // e.g., "New", "Bestseller"
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  recommendedProductIds?: string[];
  generatedImage?: string;
}