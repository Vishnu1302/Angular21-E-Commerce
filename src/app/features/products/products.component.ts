import { Component, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ProductCardComponent } from './product-card/product-card.component';
import { Product, AddToCartEvent, ProductCategory } from './models/product.model';

/**
 * ===========================================
 * PARENT COMPONENT - Products Page
 * ===========================================
 * 
 * This component demonstrates:
 * 1. Passing data DOWN to child via @Input()
 * 2. Receiving events FROM child via @Output()
 * 3. Immutable updates (important for OnPush)
 * 
 * Parent-Child Flow:
 * 
 *   ┌─────────────────────────────────────────┐
 *   │  ProductsComponent (Parent)             │
 *   │                                         │
 *   │  products signal ───@Input()───►        │
 *   │                                         │
 *   │  handleAddToCart() ◄──@Output()───      │
 *   │                                         │
 *   │     ┌─────────────────────────────┐     │
 *   │     │  ProductCardComponent       │     │
 *   │     │  (Child with OnPush)        │     │
 *   │     └─────────────────────────────┘     │
 *   └─────────────────────────────────────────┘
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  private readonly router = Router;
  
  // ========================================
  // PARENT STATE (will be passed to children)
  // ========================================
  
  readonly products = signal<Product[]>([
    { 
      id: 1, 
      name: 'Wireless Headphones', 
      price: 79.99, 
      image: 'https://picsum.photos/seed/headphones/300/200',
      category: 'electronics',
      inStock: true,
      rating: 4
    },
    { 
      id: 2, 
      name: 'Smart Watch', 
      price: 199.99, 
      image: 'https://picsum.photos/seed/watch/300/200',
      category: 'electronics',
      inStock: true,
      rating: 5
    },
    { 
      id: 3, 
      name: 'Cotton T-Shirt', 
      price: 24.99, 
      image: 'https://picsum.photos/seed/tshirt/300/200',
      category: 'clothing',
      inStock: false,
      rating: 3
    },
    { 
      id: 4, 
      name: 'JavaScript Book', 
      price: 39.99, 
      image: 'https://picsum.photos/seed/book/300/200',
      category: 'books',
      inStock: true,
      rating: 5
    },
  ]);
  
  // Cart items (receives data from child via @Output)
  readonly cartItems = signal<AddToCartEvent[]>([]);
  
  // Featured product ID
  readonly featuredProductId = signal<number>(2);
  
  // UI state
  readonly showRatings = signal(true);
  readonly changeDetectionTriggerCount = signal(0);

  // ========================================
  // COMPUTED VALUES
  // ========================================
  
  readonly totalCartItems = computed(() => 
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );
  
  readonly totalCartValue = computed(() =>
    this.cartItems().reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  );

  // ========================================
  // EVENT HANDLERS (receive @Output events)
  // ========================================
  
  // Handle addToCart event from child
  handleAddToCart(event: AddToCartEvent): void {
    console.log('📦 [Parent] Received addToCart from child:', event);
    
    // Add to cart using immutable update
    this.cartItems.update(items => [...items, event]);
  }
  
  // Handle viewDetails event from child
  handleViewDetails(productId: number): void {
    console.log('👁️ [Parent] Received viewDetails for product:', productId);
    // In real app: this.router.navigate(['/products', productId]);
    alert(`Navigate to product ${productId} details`);
  }
  
  // Handle favorite toggle from child
  handleFavoriteToggle(event: { productId: number; isFavorite: boolean }): void {
    console.log('❤️ [Parent] Received favorite toggle:', event);
  }

  // ========================================
  // DEMO: Change Detection Triggers
  // ========================================
  
  // This WON'T trigger OnPush child re-render (same reference)
  mutateProductBad(): void {
    const products = this.products();
    products[0].price = products[0].price + 10;  // Mutating same object!
    console.log('⚠️ [Parent] Mutated product (BAD - OnPush won\'t detect)');
    console.log('Price is now:', products[0].price, 'but UI may not update!');
  }
  
  // This WILL trigger OnPush child re-render (new reference)
  updateProductGood(): void {
    this.products.update(products => 
      products.map((p, index) => 
        index === 0 
          ? { ...p, price: p.price + 10 }  // New object reference!
          : p
      )
    );
    console.log('✅ [Parent] Updated product immutably (GOOD - OnPush will detect)');
  }
  
  // Toggle featured product
  toggleFeatured(): void {
    this.featuredProductId.update(id => id === 2 ? 1 : 2);
  }
  
  // Toggle ratings visibility
  toggleRatings(): void {
    this.showRatings.update(v => !v);
  }
  
  // Trigger change detection (manual)
  triggerChangeDetection(): void {
    this.changeDetectionTriggerCount.update(n => n + 1);
    console.log('🔄 [Parent] Triggered change detection manually');
  }
}

