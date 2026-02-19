import { ErrorHandler, Injectable } from "@angular/core";

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: any): void {
    console.error('Global Error:', error);
    alert(error.message || 'An unexpected error occurred. Please try again later.');
  }
}
