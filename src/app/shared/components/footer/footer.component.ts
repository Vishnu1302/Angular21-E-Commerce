import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Footer Component
 * 
 * Angular Concepts:
 * - Simple presentational component
 * - RouterLink for navigation
 */
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {}
