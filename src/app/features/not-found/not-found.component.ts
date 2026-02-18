import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Not Found Component - 404 Page
 * 
 * Angular Concepts:
 * - Wildcard route handling (**)
 * - Simple standalone component
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss'
})
export class NotFoundComponent {}
