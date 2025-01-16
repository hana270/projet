// product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:8081/api/products';

  constructor(private http: HttpClient) {}

  addProduct(formData: FormData): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, formData)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Une erreur est survenue lors de l\'ajout du produit.';
    
    if (error.status === 413) {
      errorMessage = 'Le fichier est trop volumineux. La taille maximale autorisée est de 20MB';
    }
    
    return throwError(() => errorMessage);
  }

  getAllProducts(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  deleteProduct(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}