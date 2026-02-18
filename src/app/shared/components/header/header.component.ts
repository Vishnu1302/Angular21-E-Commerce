import { Component, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

/**
 * ===========================================
 * ANGULAR SIGNALS - Complete Guide
 * ===========================================
 * 
 * What is a Signal?
 * - A wrapper around a value that notifies when it changes
 * - Angular's new reactive primitive (Angular 16+)
 * - Simpler alternative to RxJS for component state
 * 
 * Why Signals?
 * 1. Fine-grained reactivity - Only updates what changed
 * 2. Simpler than BehaviorSubject/RxJS for local state
 * 3. No subscriptions to manage = No memory leaks
 * 4. Better performance - No Zone.js needed for change detection
 * 
 * Three Main Concepts:
 * 1. signal()   - Create a writable reactive value
 * 2. computed() - Create a read-only derived value
 * 3. effect()   - Run side effects when signals change
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  
  // ========================================
  // 1. SIGNAL - Writable reactive value
  // ========================================
  // signal(initialValue) creates a getter function
  // Reading: this.cartCount() - call it like a function
  // Writing: this.cartCount.set(5) or this.cartCount.update(v => v + 1)
  
  readonly cartCount = signal(0);
  readonly isLoggedIn = signal(false);
  readonly userName = signal('Guest');
  
  // ========================================
  // 2. COMPUTED - Derived read-only value
  // ========================================
  // Automatically recalculates when dependencies change
  // It's LAZY - only calculates when read
  // It's MEMOIZED - caches result until dependencies change
  
  // Computed: depends on cartCount
  readonly cartLabel = computed(() => {
    const count = this.cartCount();
    if (count === 0) return 'Cart (Empty)';
    if (count === 1) return 'Cart (1 item)';
    return `Cart (${count} items)`;
  });
  
  // Computed: depends on isLoggedIn and userName
  readonly welcomeMessage = computed(() => {
    if (this.isLoggedIn()) {
      return `Welcome back, ${this.userName()}!`;
    }
    return 'Welcome, Guest!';
  });
  
  // Computed: depends on cartCount (boolean derived value)
  readonly hasItemsInCart = computed(() => this.cartCount() > 0);
  
  // ========================================
  // UPDATING SIGNALS
  // ========================================
  
  // Method 1: set() - Replace the entire value
  login(): void {
    this.isLoggedIn.set(true);
    this.userName.set('John Doe');
  }
  
  logout(): void {
    this.isLoggedIn.set(false);
    this.userName.set('Guest');
    this.cartCount.set(0); // Clear cart on logout
  }
  
  // Method 2: update() - Transform based on current value
  addToCart(): void {
    this.cartCount.update(count => count + 1);
  }
  
  removeFromCart(): void {
    this.cartCount.update(count => Math.max(0, count - 1));
  }
  
  clearCart(): void {
    this.cartCount.set(0);
  }
}
