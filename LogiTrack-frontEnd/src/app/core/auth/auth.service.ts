import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface LoginResponse {
  message?: string;
  sessionId?: string;
  user?: User;
  // Legacy fields for backward compatibility
  token?: string;
  refreshToken?: string;
  expiresIn?: number;
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8082/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Vérifier si l'utilisateur est déjà connecté au démarrage
    if (this.isBrowser) {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser !== 'undefined') {
        try {
          this.currentUserSubject.next(JSON.parse(savedUser));
        } catch (e) {
          // Si la valeur est corrompue, on la supprime
          localStorage.removeItem('currentUser');
          this.currentUserSubject.next(null);
        }
      }
    }
  }

  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          const user: User | undefined =
            response.user ?? (response.role ? {
              id: response.id ?? 0,
              email: response.email ?? email,
              firstName: response.firstName ?? '',
              lastName: response.lastName ?? '',
              role: response.role
            } : undefined);

          if (this.isBrowser) {
            // Store sessionId as token for compatibility with existing code
            if (response.sessionId) {
              localStorage.setItem('token', response.sessionId);
            } else if (response.token) {
              // Fallback for legacy token-based auth
              localStorage.setItem('token', response.token);
            }
            
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            if (user) {
              localStorage.setItem('currentUser', JSON.stringify(user));
            }
            if (response.expiresIn) {
              localStorage.setItem('tokenExpires', (Date.now() + response.expiresIn * 1000).toString());
            }
          }

          if (user) {
            this.currentUserSubject.next(user);
          }
        })
      );
  }

  logout(): void {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('tokenExpires');
    }
    this.currentUserSubject.next(null);
  }

  refreshToken(): Observable<LoginResponse> {
    const refreshToken = this.isBrowser ? localStorage.getItem('refreshToken') : null;
    return this.http.post<LoginResponse>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          if (this.isBrowser) {
            if (response.token) {
              localStorage.setItem('token', response.token);
            }
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            if (response.expiresIn) {
              localStorage.setItem('tokenExpires', (Date.now() + response.expiresIn * 1000).toString());
            }
          }
        })
      );
  }

  isAuthenticated(): boolean {
    if (!this.isBrowser) {
      return false;
    }

    // 1) Si un utilisateur est présent dans le localStorage, on le considère connecté
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && savedUser !== 'undefined') {
      return true;
    }

    // 2) Fallback pour un éventuel token JWT avec date d'expiration
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('tokenExpires');

    if (!token || !expires) {
      return false;
    }

    return Date.now() < parseInt(expires, 10);
  }

  isTokenExpiringSoon(): boolean {
    if (!this.isBrowser) {
      return false;
    }
    const expires = localStorage.getItem('tokenExpires');
    if (!expires) return false;

    // Vérifier si le token expire dans les 5 prochaines minutes
    const fiveMinutes = 5 * 60 * 1000;
    return Date.now() + fiveMinutes >= parseInt(expires);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    if (!this.isBrowser) {
      return null;
    }
    return localStorage.getItem('token');
  }

  hasRole(role: string): boolean {
    const currentUser = this.getCurrentUser();
    return currentUser?.role === role;
  }
}
