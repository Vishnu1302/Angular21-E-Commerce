import { inject } from '@angular/core';
import { Router, CanActivateFn, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

/**
 * ===========================================
 * AUTH GUARD - Route Protection with canActivate
 * ===========================================
 * 
 * What is a Guard?
 * ----------------
 * Guards are functions that control navigation to routes.
 * They can ALLOW, DENY, or REDIRECT navigation.
 * 
 * Types of Guards:
 * ----------------
 * 1. canActivate     - Can user ACCESS this route?
 * 2. canActivateChild - Can user access CHILD routes?
 * 3. canDeactivate   - Can user LEAVE this route?
 * 4. canMatch        - Should this route even be considered?
 * 
 * Return Types:
 * -------------
 * - true            → Navigation proceeds
 * - false           → Navigation blocked
 * - UrlTree         → Redirect to different route
 * - Observable/Promise of above → Async decision
 * 
 * Modern Angular (14+) uses FUNCTIONAL guards (not classes)
 */

/**
 * Simulated authentication state
 * In real app, this would come from an AuthService
 */
let isAuthenticated = false;

/**
 * Helper function to toggle auth state (for demo purposes)
 */
export function toggleAuth(): boolean {
  isAuthenticated = !isAuthenticated;
  console.log(`🔐 Auth state changed: ${isAuthenticated ? 'LOGGED IN' : 'LOGGED OUT'}`);
  return isAuthenticated;
}

/**
 * Helper to check current auth state
 */
export function getAuthState(): boolean {
  return isAuthenticated;
}

/**
 * AUTH GUARD - Functional Guard (Modern Angular 14+)
 * 
 * This guard:
 * 1. Checks if user is authenticated
 * 2. If YES → allows navigation (returns true)
 * 3. If NO → redirects to login (returns UrlTree)
 * 
 * Usage in routes:
 * {
 *   path: 'products',
 *   canActivate: [authGuard],  // ← Add guard here
 *   loadComponent: () => ...
 * }
 */
export const authGuard: CanActivateFn = (
  route,      // ActivatedRouteSnapshot - info about the route
  state       // RouterStateSnapshot - state of router
): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {
  
  // inject() works in functional guards!
  const router = inject(Router);
  
  console.log('🛡️ [AuthGuard] Checking access to:', state.url);
  
  if (isAuthenticated) {
    console.log('✅ [AuthGuard] Access GRANTED');
    return true;
  }
  
  console.log('❌ [AuthGuard] Access DENIED - Redirecting to login');
  
  // Create UrlTree to redirect to login
  // Pass the attempted URL as a query param so we can redirect back after login
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};

/**
 * ===========================================
 * EXPLANATION: Why Functional Guards?
 * ===========================================
 * 
 * Old Way (Class-based):
 * ----------------------
 * @Injectable()
 * export class AuthGuard implements CanActivate {
 *   constructor(private router: Router) {}
 *   canActivate() { ... }
 * }
 * 
 * New Way (Functional):
 * ---------------------
 * export const authGuard: CanActivateFn = (route, state) => {
 *   const router = inject(Router);
 *   ...
 * }
 * 
 * Benefits of Functional:
 * - Simpler syntax
 * - Tree-shakable
 * - Easier to test
 * - Can be composed with other functions
 */
