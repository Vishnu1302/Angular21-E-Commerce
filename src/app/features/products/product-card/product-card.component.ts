import { 
  Component, 
  input,           // Signal input function (Angular 17.1+)
  output,          // Signal output function (Angular 17.3+)
  signal,
  computed,
  effect,
  numberAttribute, // Built-in transform for string -> number
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product, AddToCartEvent } from '../models/product.model';

/**
 * ===========================================
 * SIGNAL INPUTS + EFFECT (Modern Angular 17+)
 * ===========================================
 * 
 * OLD WAY (Decorator-based):
 *   @Input() product!: Product;
 *   ngOnChanges(changes) { ... }
 * 
 * NEW WAY (Signal-based):
 *   product = input.required<Product>();
 *   effect(() => { console.log(this.product()) });
 * 
 * Why Signal Inputs are better:
 * 1. input() returns a Signal - works with effect() and computed()
 * 2. No need for ngOnChanges lifecycle hook
 * 3. Type-safe without need for ! assertion
 * 4. Better tree-shaking and performance
 * 5. Consistent reactive programming model
 * 
 * Signal Input vs @Input:
 * ┌─────────────────┬──────────────────────────────────────────┐
 * │ Feature         │ @Input()          │ input()             │
 * ├─────────────────┼───────────────────┼─────────────────────┤
 * │ Type            │ Plain property    │ Signal<T>           │
 * │ Access value    │ this.product      │ this.product()      │
 * │ React to change │ ngOnChanges       │ effect()            │
 * │ Use in computed │ ❌ Won't track    │ ✅ Auto-tracked     │
 * │ Required        │ { required: true }│ input.required<T>() │
 * └─────────────────┴───────────────────┴─────────────────────┘
 */
@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush  // Works great with signals!
})
export class ProductCardComponent {
  
  // ========================================
  // SIGNAL INPUTS - input() function
  // ========================================
  
  /**
   * Required input - must be provided by parent
   * Usage in parent: <app-product-card [product]="myProduct" />
   * Access in this component: this.product() (call it like a function!)
   */
  readonly product = input.required<Product>();
  
  /**
   * Optional input with default value
   * If parent doesn't provide it, defaults to true
   */
  readonly showRating = input<boolean>(true);
  
  /**
   * Input with alias - parent uses 'featured', we use 'isFeatured' internally
   * Usage in parent: <app-product-card [featured]="true" />
   */
  readonly isFeatured = input<boolean>(false, { alias: 'featured' });
  
  /**
   * Input with transform - converts string/number to number
   * numberAttribute is a built-in transform from @angular/core
   * Usage: <app-product-card maxQuantity="20" /> (string becomes number)
   */
  readonly maxQuantity = input<number, string | number>(10, { 
    transform: numberAttribute 
  });

  // ========================================
  // SIGNAL OUTPUTS - output() function
  // ========================================
  
  /**
   * output() is the signal-based alternative to @Output() EventEmitter
   * It returns an OutputEmitterRef which has .emit() method
   * Slightly simpler syntax than EventEmitter
   */
  readonly addToCart = output<AddToCartEvent>();
  
  readonly viewDetails = output<number>();
  
  // Output with alias
  readonly onFavoriteChange = output<{
    productId: number;
    isFavorite: boolean;
  }>({ alias: 'favoriteToggled' });

  // ========================================
  // COMPONENT STATE (Signals)
  // ========================================
  readonly quantity = signal(0);
  readonly isFavoriteState = signal(false);  // Renamed to avoid confusion with input
  readonly effectTriggerCount = signal(0);   // Demo: track how many times effect runs

  // ========================================
  // COMPUTED VALUES - Now properly reactive!
  // ========================================
  /**
   * Because product is now a Signal (from input()), 
   * computed() will automatically track it!
   * When parent updates product, this recalculates.
   */
  readonly totalPrice = computed(() => {
    const prod = this.product();  // Reading signal creates dependency
    return prod.price * this.quantity();
  });
  
  readonly canAddMore = computed(() => 
    this.quantity() < this.maxQuantity()  // maxQuantity is also a signal now!
  );
  
  readonly canRemove = computed(() => 
    this.quantity() > 0
  );

  // ========================================
  // EFFECT - Replaces ngOnChanges!
  // ========================================
  constructor() {
    /**
     * effect() runs whenever ANY signal it reads changes.
     * This is the modern replacement for ngOnChanges.
     * 
     * Benefits over ngOnChanges:
     * 1. Automatically tracks all signal dependencies
     * 2. No need to check `changes['product']` etc.
     * 3. Runs in correct order (after signals update)
     * 4. Works with all signals, not just inputs
     */
    effect(() => {
      // Access signals to create dependencies
      const product = this.product();
      const featured = this.isFeatured();
      const showRating = this.showRating();
      
      this.effectTriggerCount.update(n => n + 1);
      
      console.log(`🔄 [ProductCard ${product.id}] effect() triggered`, {
        effectCount: this.effectTriggerCount(),
        productName: product.name,
        productPrice: product.price,
        isFeatured: featured,
        showRating: showRating
      });
    });
    
    // You can have multiple effects for different concerns
    effect(() => {
      const product = this.product();
      console.log(`  📦 Product input changed to: ${product.name}`);
    });
    
    effect(() => {
      if (this.isFeatured()) {
        console.log(`  ⭐ This product is now featured!`);
      }
    });
  }

  // ========================================
  // METHODS - Trigger output() Events
  // ========================================
  
  onAddToCart(): void {
    // output() also uses .emit() just like EventEmitter
    this.addToCart.emit({
      product: this.product(),  // Call signal to get value
      quantity: this.quantity()
    });
    
    console.log(`🛒 [ProductCard] Emitted addToCart event`);
  }
  
  onViewDetails(): void {
    this.viewDetails.emit(this.product().id);  // Call signal!
  }
  
  toggleFavorite(): void {
    this.isFavoriteState.update(v => !v);
    
    this.onFavoriteChange.emit({
      productId: this.product().id,  // Call signal!
      isFavorite: this.isFavoriteState()
    });
  }
  
  incrementQuantity(): void {
    if (this.canAddMore()) {
      this.quantity.update(q => q + 1);
    }
  }
  
  decrementQuantity(): void {
    if (this.canRemove()) {
      this.quantity.update(q => q - 1);
    }
  }
}
