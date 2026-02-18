/**
 * ===========================================
 * PRODUCT TYPES - TypeScript Models
 * ===========================================
 * 
 * TypeScript Concepts:
 * 1. Interface - Shape of data
 * 2. Type alias - Alternative naming
 * 3. Readonly - Immutability
 * 4. Optional properties - ?
 */

// Product interface with strict typing
export interface Product {
  readonly id: number;
  name: string;
  price: number;
  description?: string;  // Optional
  image: string;
  category: ProductCategory;
  inStock: boolean;
  rating: number;
}

// Category as union type (strict values)
export type ProductCategory = 'electronics' | 'clothing' | 'books' | 'home';

// Event payload types - what parent receives from child
export interface AddToCartEvent {
  product: Product;
  quantity: number;
}

export interface ProductRatingEvent {
  productId: number;
  rating: number;
}

// Type for creating new products (without readonly id)
export type CreateProduct = Omit<Product, 'id'>;

// Type for updating products (all fields optional except id)
export type UpdateProduct = Partial<Product> & { id: number };
