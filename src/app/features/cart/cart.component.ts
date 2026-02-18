import { Component, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Cart Component
 * 
 * Angular Concepts:
 * - Signal-based state management
 * - Computed signals for derived state
 * - @for and @if control flow
 */
@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {
  readonly cartItems = signal([
    { id: 1, name: 'Product 1', price: 29.99, quantity: 2 },
    { id: 2, name: 'Product 2', price: 49.99, quantity: 1 },
  ]);

  readonly cartTotal = computed(() => 
    this.cartItems().reduce((sum, item) => sum + (item.price * item.quantity), 0)
  );

  readonly itemCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  removeItem(id: number): void {
    this.cartItems.update(items => items.filter(item => item.id !== id));
  }
}
