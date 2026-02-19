import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { productsResolver } from './core/resolvers/products.resolver';

/**
 * Application Routes Configuration
 * 
 * Angular Routing Concepts:
 * 1. Lazy Loading - loadComponent for code splitting
 * 2. Redirects - redirectTo for default route
 * 3. Wildcards - ** for 404 handling
 * 4. pathMatch - 'full' ensures exact match
 * 5. canActivate - Guards to protect routes
 * 6. resolve - Pre-fetch data before component loads
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    // HOME - No guard (public route)
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Home | Angular Shop'
  },
  {
    // PRODUCTS - Protected + Resolver
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Products | Angular Shop',
    canActivate: [authGuard],           // ← Guard: must be authenticated
    resolve: { products: productsResolver }  // ← Resolver: pre-fetch products
  },
  {
    // CART - Protected
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Cart | Angular Shop',
    canActivate: [authGuard]            // ← Guard: must be authenticated
  },
  {
    // LOGIN - No guard (need this to login!)
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'Login | Angular Shop'
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: '404 - Page Not Found'
  }
];
