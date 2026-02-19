import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Topic Interface - TypeScript best practice
 * Defines the shape of a learning topic
 */
interface Topic {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly route: string | null;  // null if no dedicated page
  readonly concepts: readonly string[];  // readonly array for immutability
}

/**
 * Home Component
 * 
 * Angular Concepts:
 * - Lazy loaded component
 * - RouterLink for navigation
 * - Signal-based state
 * - TypeScript interfaces
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  /**
   * Topics covered in this learning application
   * Using readonly signal with typed array for type safety
   */
  readonly topics = signal<Topic[]>([
    {
      id: 1,
      title: 'Routing & Lazy Loading, Guards, Resolvers',
      description: 'Navigation, route configuration, code splitting',
      route: null,
      concepts: ['Routes array', 'loadComponent()', 'pathMatch', 'Wildcards', 'Route params']
    },
    {
      id: 2,
      title: 'Reactive Forms + Signals + Global Error Handling',
      description: 'Form handling with modern Angular signals',
      route: '/login',
      concepts: ['FormBuilder', 'FormGroup', 'Validators', 'signal()', 'computed()', 'effect()']
    },
    {
      id: 3,
      title: 'Services + RxJS Observables + DI',
      description: 'Data fetching with dependency injection',
      route: '/products',
      concepts: ['@Injectable', 'inject()', 'Observable', 'subscribe()', 'of()', 'Subscription']
    },
    {
      id: 4,
      title: 'Parent-Child + Change Detection',
      description: 'Component interaction patterns',
      route: '/products',
      concepts: ['input()', 'output()', 'EventEmitter', 'OnPush', 'ngOnChanges']
    },
    {
      id: 5,
      title: 'Project Structure (DDD) + PWA',
      description: 'Domain-driven folder organization',
      route: null,
      concepts: ['features/', 'shared/', 'core/', 'models/', 'Standalone']
    },
    {
      id: 6,
      title: 'TypeScript',
      description: 'Strong typing throughout the app',
      route: null,
      concepts: ['Interfaces', 'Types', 'Generics', 'readonly', 'Strict mode']
    }
  ]);
}
