import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { Product } from '../../features/products/models/product.model';
import { ProductService } from '../services/product.service';

/**
 * ===========================================
 * PRODUCTS RESOLVER - Pre-fetch Data Before Route Loads
 * ===========================================
 * 
 * What is a Resolver?
 * -------------------
 * A Resolver fetches data BEFORE the route component loads.
 * The component won't render until the data is ready.
 * 
 * Why use Resolvers?
 * ------------------
 * 1. NO LOADING SPINNERS - Data ready when component renders
 * 2. CLEANER COMPONENTS - No ngOnInit data fetching
 * 3. ERROR HANDLING - Can redirect if data fetch fails
 * 4. BETTER UX - Page appears fully loaded
 * 
 * Flow:
 * -----
 * User clicks link
 *       ↓
 * Guard checks (if any)
 *       ↓
 * Resolver fetches data ← We are here
 *       ↓
 * Component loads with data ready
 *       ↓
 * Component accesses data via ActivatedRoute.data
 * 
 * Without Resolver:
 * -----------------
 * Component loads → Shows spinner → Fetches data → Renders
 * 
 * With Resolver:
 * --------------
 * Fetches data → Component loads → Renders immediately
 */

/**
 * PRODUCTS RESOLVER - Functional Resolver (Modern Angular 14+)
 * 
 * This resolver:
 * 1. Calls ProductService.getProducts()
 * 2. Waits for the Observable to complete
 * 3. Makes data available via route.data['products']
 * 
 * Usage in routes:
 * {
 *   path: 'products',
 *   resolve: { products: productsResolver },  // ← Key = 'products'
 *   loadComponent: () => ...
 * }
 * 
 * Usage in component:
 * route.data['products'] or toSignal(route.data.pipe(map(d => d['products'])))
 */
export const productsResolver: ResolveFn<Product[]> = (
  route,      // ActivatedRouteSnapshot
  state       // RouterStateSnapshot
): Observable<Product[]> | Promise<Product[]> | Product[] => {
  
  // inject() works in functional resolvers!
  const productService = inject(ProductService);
  
  console.log('📦 [ProductsResolver] Fetching products data...');
  console.log('📍 [ProductsResolver] Route:', state.url);
  
  return productService.getProducts().pipe(
    catchError(error => {
      console.error('❌ [ProductsResolver] Error fetching products:', error);
      // Return empty array on error so component still loads
      // Alternatively, could redirect to error page
      return of([]);
    })
  );
};

/**
 * ===========================================
 * EXPLANATION: Resolver Data Flow
 * ===========================================
 * 
 * 1. DEFINE in routes:
 *    resolve: { products: productsResolver }
 *              ^^^^^^^^
 *              This key is how you access it
 * 
 * 2. ACCESS in component:
 *    
 *    // Option A: Using ActivatedRoute (Observable)
 *    private route = inject(ActivatedRoute);
 *    products$ = this.route.data.pipe(
 *      map(data => data['products'] as Product[])
 *    );
 *    
 *    // Option B: Using toSignal (Signal)
 *    private route = inject(ActivatedRoute);
 *    products = toSignal(
 *      this.route.data.pipe(map(d => d['products'] as Product[])),
 *      { initialValue: [] }
 *    );
 *    
 *    // Option C: Snapshot (one-time read)
 *    products = this.route.snapshot.data['products'] as Product[];
 * 
 * ===========================================
 * EXPLANATION: When to Use Resolvers
 * ===========================================
 * 
 * ✅ USE WHEN:
 * - Data is required to render the page
 * - You want to avoid loading spinners
 * - Data fetch is fast (< 1-2 seconds)
 * 
 * ❌ AVOID WHEN:
 * - Data fetch is slow (poor UX - page seems frozen)
 * - Data is optional
 * - Real-time updates needed (use services instead)
 */
