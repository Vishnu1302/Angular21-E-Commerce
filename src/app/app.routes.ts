import { Routes } from '@angular/router';

/**
 * Application Routes Configuration
 * 
 * Angular Routing Concepts:
 * 1. Lazy Loading - loadComponent for code splitting
 * 2. Redirects - redirectTo for default route
 * 3. Wildcards - ** for 404 handling
 * 4. pathMatch - 'full' ensures exact match
 */
export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    title: 'Home | Angular Shop'
  },
  {
    path: 'products',
    loadComponent: () => import('./features/products/products.component').then(m => m.ProductsComponent),
    title: 'Products | Angular Shop'
  },
  {
    path: 'cart',
    loadComponent: () => import('./features/cart/cart.component').then(m => m.CartComponent),
    title: 'Cart | Angular Shop'
  },
  {
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
