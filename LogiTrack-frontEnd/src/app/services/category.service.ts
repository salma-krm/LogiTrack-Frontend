import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export interface Category {
  id?: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'http://localhost:8082/api/categories';
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  private getHeaders(): HttpHeaders {
    const token = this.isBrowser ? localStorage.getItem('token') : null;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  private handleError = (error: HttpErrorResponse) => {
    console.error('API Error:', error);

    if (error.status === 0) {
      console.error('Erreur de connexion - Vérifiez que le backend est démarré sur le port 8082');
      return throwError(() => new Error('Impossible de se connecter au serveur. Vérifiez que le backend est démarré.'));
    }

    if (error.status === 401) {
      console.error('Non autorisé - Token invalide ou expiré');
      if (this.isBrowser) {
        localStorage.removeItem('token');
      }
      return throwError(() => new Error('Session expirée. Veuillez vous reconnecter.'));
    }

    if (error.status === 403) {
      return throwError(() => new Error('Accès refusé. Vous n\'avez pas les permissions nécessaires.'));
    }

    return throwError(() => error);
  }

  getAllCategories(): Observable<Category[]> {
    console.log('Tentative de récupération des catégories depuis:', this.apiUrl);
    return this.http.get<Category[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getCategoryById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createCategory(category: Category): Observable<Category> {
    console.log('Création de catégorie:', category);
    return this.http.post<Category>(this.apiUrl, category, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    console.log('Mise à jour de catégorie:', id, category);
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCategory(id: number): Observable<void> {
    console.log('Suppression de catégorie:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}
