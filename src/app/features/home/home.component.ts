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
  readonly title = signal('Angular Learning Hub');
  
  /**
   * Topics covered in this learning application
   * Using readonly signal with typed array for type safety
   */
  readonly topics = signal<Topic[]>([
    {
      id: 1,
      title: 'Routing & Lazy Loading',
      description: 'Navigation, route configuration, code splitting',
      route: null,
      concepts: ['Routes array', 'loadComponent()', 'pathMatch', 'Wildcards', 'Route params']
    },
    {
      id: 2,
      title: 'Reactive Forms + Signals + Dependency Injection',
      description: 'Form handling with modern Angular signals',
      route: '/login',
      concepts: ['FormBuilder', 'FormGroup', 'Validators', 'signal()', 'computed()', 'effect()']
    },
    {
      id: 3,
      title: 'Parent-Child Communication , Change Detection',
      description: 'Component interaction patterns',
      route: '/products',
      concepts: ['input()', 'output()', '@Input/@Output', 'EventEmitter', 'OnPush', 'ngOnChanges vs effect()']
    },
    {
      id: 4,
      title: 'Domain Driven Design Setup',
      description: 'Project structure and organization',
      route: null,
      concepts: ['features/', 'shared/', 'core/', 'models/', 'Standalone components']
    },
    {
      id: 5,
      title: 'TypeScript',
      description: 'Strong typing throughout the application',
      route: null,
      concepts: ['Interfaces', 'Types', 'Generics', 'readonly', 'Strict mode']
    }
  ]);
}
