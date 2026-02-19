import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { ProductCardComponent } from './product-card/product-card.component';
import { Product, AddToCartEvent } from './models/product.model';

/**
 * ===========================================
 * PARENT COMPONENT - Products Page
 * ===========================================
 * 
 * This component demonstrates:
 * 1. RESOLVER DATA - Products pre-fetched via route resolver
 * 2. ActivatedRoute - Access route data, params, queryParams
 * 3. toSignal() - Convert route data Observable to Signal
 * 4. Passing data DOWN to child via @Input()
 * 5. Receiving events FROM child via @Output()
 * 
 * Data Flow (WITH RESOLVER):
 * 
 *   Route Navigation
 *         │
 *         ▼
 *   AuthGuard checks ─────► Denied? → Redirect to /login
 *         │
 *         ▼ Allowed
 *   ProductsResolver
 *         │
 *         │ getProducts() → waits for data
 *         ▼
 *   ┌─────────────────────────────────────────┐
 *   │  ProductsComponent (Parent)             │
 *   │  - Data already available!              │
 *   │  - No loading spinner needed            │
 *   │                                         │
 *   │  route.data['products'] ──@Input()──►   │
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
  
  // ========================================
  // DEPENDENCY INJECTION
  // ========================================
  
  /**
   * ActivatedRoute - Access to route information
   * 
   * Provides:
   * - route.data       → Resolver data (Observable)
   * - route.params     → Route params like :id
   * - route.queryParams → Query string ?foo=bar
   * - route.snapshot   → One-time snapshot (not reactive)
   */
  private readonly route = inject(ActivatedRoute);
  
  // ========================================
  // RESOLVER DATA (No manual fetching!)
  // ========================================
  
  /**
   * Products from Resolver
   * 
   * The resolver already fetched the data before this component loaded.
   * We just need to read it from route.data['products']
   * 
   * Benefits:
   * ✅ No loading state needed - data is ready!
   * ✅ No error handling here - resolver handled it
   * ✅ Component stays clean and simple
   */
  readonly products = toSignal(
    this.route.data.pipe(
      map(data => data['products'] as Product[])
    ),
    { initialValue: [] }
  );
  
  // No loading state needed - resolver guarantees data is ready!
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  
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

