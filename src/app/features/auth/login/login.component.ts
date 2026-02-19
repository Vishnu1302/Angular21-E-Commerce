import { Component, signal, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { 
  ReactiveFormsModule, 
  FormBuilder, 
  FormGroup, 
  Validators
} from '@angular/forms';
import { toggleAuth, getAuthState } from '../../../core/guards/auth.guard';

/**
 * ===========================================
 * REACTIVE FORMS + SIGNALS - Complete Guide
 * ===========================================
 * 
 * Reactive Forms Concepts:
 * 1. FormGroup - Container for form controls
 * 2. FormControl - Individual input field
 * 3. Validators - Built-in and custom validation
 * 4. FormBuilder - Helper to create forms
 * 
 * Signals Integration:
 * 1. signal() - Track form state (loading, error messages)
 * 2. computed() - Derive values (button labels, validation messages)
 * 3. effect() - Side effects (logging, analytics)
 * 
 * Guard Integration:
 * - Receives returnUrl from authGuard redirect
 * - Toggles auth state on successful login
 * - Redirects back to original destination
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  // ========================================
  // REACTIVE FORM DEFINITION
  // ========================================
  loginForm!: FormGroup;

  // ========================================
  // SIGNALS FOR UI STATE
  // ========================================
  
  // Loading state - shows spinner during API call
  readonly isLoading = signal(false);
  
  // Track form submission attempts
  readonly submitAttempts = signal(0);
  
  // Show/hide password
  readonly showPassword = signal(false);
  
  // Remember me checkbox (could use FormControl, but signal works for simple toggle)
  readonly rememberMe = signal(false);
  
  // Auth state for demo (from guard)
  readonly isAuthenticated = signal(getAuthState());

  // ========================================
  // COMPUTED SIGNALS - Derived State
  // ========================================
  
  // Dynamic button text based on loading state
  readonly buttonText = computed(() => {
    if (this.isLoading()) return 'Signing in...';
    return 'Sign In';
  });
  
  // Password field type (text/password)
  readonly passwordFieldType = computed(() => 
    this.showPassword() ? 'text' : 'password'
  );
  
  // Show validation errors only after first submit attempt
  readonly showValidationErrors = computed(() => 
    this.submitAttempts() > 0
  );
  
  // Button disabled state
  readonly isButtonDisabled = computed(() => 
    this.isLoading()
  );

  constructor() {
    // ========================================
    // EFFECT - Side Effects
    // ========================================
    
    // Log form submissions for analytics
    effect(() => {
      const attempts = this.submitAttempts();
      if (attempts > 0) {
        console.log(`📊 Login attempt #${attempts}`);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  // ========================================
  // FORM INITIALIZATION
  // ========================================
  private initForm(): void {
    this.loginForm = this.fb.group({
      // Email with built-in validators
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.minLength(5)
      ]],
      
      // Password with built-in validators
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(50)
      ]]
    });

  }

  // ========================================
  // VALIDATION HELPERS
  // ========================================
  
  // Check if a field has error (for template)
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.hasError(errorType) && (field?.touched || this.showValidationErrors()));
  }
  
  // Check if field is invalid (for styling)
  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field?.invalid && (field?.touched || this.showValidationErrors()));
  }
  
  // Get field error message
  getErrorMessage(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    
    if (field?.hasError('required')) {
      return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength'].requiredLength;
      return `Minimum ${minLength} characters required`;
    }
    if (field?.hasError('maxlength')) {
      const maxLength = field.errors?.['maxlength'].requiredLength;
      return `Maximum ${maxLength} characters allowed`;
    }
    return '';
  }

  // ========================================
  // UI ACTIONS
  // ========================================
  
  togglePassword(): void {
    this.showPassword.update(show => !show);
  }
  
  toggleRememberMe(): void {
    this.rememberMe.update(value => !value);
  }

  // ========================================
  // FORM SUBMISSION
  // ========================================
  onSubmit(): void {
    // Increment submit attempts
    this.submitAttempts.update(n => n + 1);
    
    // Mark all fields as touched to show validation
    this.loginForm.markAllAsTouched();
    
    // Check if form is valid
    if (this.loginForm.invalid) {
      console.log('❌ Form is invalid');
      return;
    }
    
    // Get form values
    const { email, password } = this.loginForm.value;
    
    console.log('📤 Submitting login:', { email, rememberMe: this.rememberMe() });
    
    // Start loading
    this.isLoading.set(true);
    
    // Simulate API call
    setTimeout(() => {
      // Simulate success/failure
      if (email === 'test@test.com' && password === '123456') {
        console.log('✅ Login successful!');
        this.isLoading.set(false);
        
        // Toggle auth state to authenticated
        toggleAuth();
        this.isAuthenticated.set(true);
        
        // Save to localStorage if remember me is checked
        if (this.rememberMe()) {
          localStorage.setItem('rememberedEmail', email);
        }
        
        // Get returnUrl from query params (set by authGuard)
        const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
        console.log('🔄 Redirecting to:', returnUrl);
        
        // Navigate to the original destination or home
        this.router.navigateByUrl(returnUrl);
      } else {
        // Simulate error - let global error handler catch it
        this.isLoading.set(false);
        throw new Error('Invalid email or password. Try test@test.com / 123456');
      }
    }, 1500);
  }
  
  // ========================================
  // DEMO: Quick Login Toggle (for testing guards)
  // ========================================
  quickLogin(): void {
    const newState = toggleAuth();
    this.isAuthenticated.set(newState);
    
    if (newState) {
      const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/home';
      this.router.navigateByUrl(returnUrl);
    }
  }
  
  // Reset form
  resetForm(): void {
    this.loginForm.reset();
    this.submitAttempts.set(0);
  }
}
