import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private usernameSubject = new BehaviorSubject<string>('');
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  username$ = this.usernameSubject.asObservable();

  constructor(private http: HttpClient) {
    // Check if token exists in sessionStorage
    const token = sessionStorage.getItem('token');
    const username = sessionStorage.getItem('username');
    if (token) {
      this.isAuthenticatedSubject.next(true);
      if (username) {
        this.usernameSubject.next(username);
      }
    }
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { username, password }).pipe(
      tap((response: any) => {
        if (response.token) {
          sessionStorage.setItem('token', response.token);
          sessionStorage.setItem('username', username);
          this.isAuthenticatedSubject.next(true);
          this.usernameSubject.next(username);
        }
      })
    );
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, email, password });
  }

  logout(): void {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
    this.isAuthenticatedSubject.next(false);
    this.usernameSubject.next('');
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getUsername(): string {
    return this.usernameSubject.value;
  }

  updateUsername(newUsername: string): void {
    sessionStorage.setItem('username', newUsername);
    this.usernameSubject.next(newUsername);
  }
} 