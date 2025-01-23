import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  isAdmin$ = this.isAdminSubject.asObservable();

  constructor() {
    // Recuperar el estado de autenticación del localStorage al iniciar
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.isAdminSubject.next(isAdmin);
  }

  login(password: string): boolean {
    // En producción, esto debería ser una llamada al backend
    if (password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      this.isAdminSubject.next(true);
      return true;
    }
    return false;
  }

  logout() {
    localStorage.removeItem('isAdmin');
    this.isAdminSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAdminSubject.value;
  }
}
