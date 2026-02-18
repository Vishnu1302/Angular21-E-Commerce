import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../../features/products/models/product.model';

/**
 * ===========================================
 * PRODUCT SERVICE - Dependency Injection + RxJS
 * ===========================================
 * 
 * What are Services used for?
 * ---------------------------
 * 1. SHARE DATA - Between multiple components
 * 2. BUSINESS LOGIC - Keep components lean
 * 3. API CALLS - HTTP requests to backend
 * 4. STATE MANAGEMENT - Central data store
 * 5. REUSABILITY - Use same logic everywhere
 * 
 * Key Concepts:
 * - @Injectable: Makes class available for DI
 * - providedIn: 'root': Singleton (one instance app-wide)
 * - Observable: Async data stream from RxJS
 */

@Injectable({
  providedIn: 'root'  // Singleton - same instance everywhere
})
export class ProductService {

  // Simulated database (later replace with HTTP calls)
  private readonly products: Product[] = [
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 79.99,
      description: 'High-quality wireless headphones with noise cancellation',
      image: 'https://picsum.photos/seed/headphones/300/200',
      category: 'electronics',
      inStock: true,
      rating: 4
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 199.99,
      description: 'Feature-rich smartwatch with health tracking',
      image: 'https://picsum.photos/seed/watch/300/200',
      category: 'electronics',
      inStock: true,
      rating: 5
    },
    { 
      id: 3, 
      name: 'Cotton T-Shirt', 
      price: 24.99,
      description: 'Comfortable cotton t-shirt for everyday wear',
      image: 'https://picsum.photos/seed/tshirt/300/200',
      category: 'clothing',
      inStock: false,
      rating: 3
    },
    { 
      id: 4, 
      name: 'JavaScript Book', 
      price: 39.99,
      description: 'Complete guide to modern JavaScript',
      image: 'https://picsum.photos/seed/book/300/200',
      category: 'books',
      inStock: true,
      rating: 5
    },
    { 
      id: 5, 
      name: 'Desk Lamp', 
      price: 49.99,
      description: 'Modern LED desk lamp with adjustable brightness',
      image: 'https://picsum.photos/seed/lamp/300/200',
      category: 'home',
      inStock: true,
      rating: 4
    },
    { 
      id: 6, 
      name: 'Bluetooth Speaker', 
      price: 59.99,
      description: 'Portable speaker with powerful bass',
      image: 'https://picsum.photos/seed/speaker/300/200',
      category: 'electronics',
      inStock: true,
      rating: 4
    }
  ];

  constructor() {
    console.log('✅ ProductService instantiated (singleton)');
  }

  /**
   * Get all products
   * of() creates Observable from static data
   * delay() simulates API latency
   */
  getProducts(): Observable<Product[]> {
    return of(this.products).pipe(
      delay(500)  // Simulate 500ms network delay
    );
  }

  /**
   * Get single product by ID
   */
  getProductById(id: number): Observable<Product | undefined> {
    const product = this.products.find(p => p.id === id);
    return of(product).pipe(delay(300));
  }

  /**
   * Get products by category
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(p => p.category === category);
    return of(filtered).pipe(delay(400));
  }

  /**
   * Search products by name
   */
  searchProducts(query: string): Observable<Product[]> {
    const results = this.products.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
    return of(results).pipe(delay(300));
  }
}
