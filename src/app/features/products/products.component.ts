import { Component, signal, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map, startWith } from 'rxjs/operators';
import { of } from 'rxjs';
import { ProductCardComponent } from './product-card/product-card.component';
import { Product, AddToCartEvent } from './models/product.model';
import { ProductService } from '../../core/services/product.service';

/**
 * ===========================================
 * PARENT COMPONENT - Products Page
 * ===========================================
 * 
 * This component demonstrates:
 * 1. SERVICE INJECTION - Using inject() to get ProductService
 * 2. RXJS SUBSCRIPTION - Subscribing to Observable data
 * 3. LIFECYCLE HOOKS - OnInit to load, OnDestroy to cleanup
 * 4. Passing data DOWN to child via @Input()
 * 5. Receiving events FROM child via @Output()
 * 
 * Data Flow:
 * 
 *   ProductService (Singleton)
 *         │
 *         │ getProducts() → Observable<Product[]>
 *         ▼
 *   ┌─────────────────────────────────────────┐
 *   │  ProductsComponent (Parent)             │
 *   │  - inject(ProductService)               │
 *   │  - subscribe() to Observable            │
 *   │                                         │
 *   │  products signal ───@Input()───►        │
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
  
  // inject() - Modern way to inject services (Angular 14+)
  private readonly productService = inject(ProductService);
  
  // ========================================
  // COMPONENT STATE with toSignal()
  // ========================================
  
  /**
   * toSignal() - Converts Observable to Signal
   * 
   * Benefits over manual subscription:
   * ✅ Auto-unsubscribes when component is destroyed
   * ✅ No OnInit/OnDestroy lifecycle hooks needed
   * ✅ No Subscription variable to manage
   * ✅ Works seamlessly with signals and computed()
   */
  private readonly productsState = toSignal(
    this.productService.getProducts().pipe(
      map(products => ({ data: products, loading: false, error: '' })),
      startWith({ data: [] as Product[], loading: true, error: '' }),
      catchError(err => of({ data: [] as Product[], loading: false, error: 'Failed to load products' }))
    ),
    { initialValue: { data: [] as Product[], loading: true, error: '' } }
  );
  
  // Computed values derived from productsState
  readonly products = computed(() => this.productsState().data);
  readonly isLoading = computed(() => this.productsState().loading);
  readonly errorMessage = computed(() => this.productsState().error);
  
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

