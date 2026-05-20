import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse, LoginRequest, RegisterRequest, UserType } from '../../types/types';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/auth`;

  // Signals privadas
  private tokenSignal = signal<string | null>(localStorage.getItem('token'));
  private userSignal = signal<UserType | undefined>(undefined);
  
  // Signals públicas (solo lectura)
  user = this.userSignal.asReadonly();
  isAuthenticated = computed(() => !!this.tokenSignal());
  isAdmin = computed(() => this.userSignal()?.role === 'ADMIN');
  
  constructor() {
    const token = localStorage.getItem('token');
    if (token) {
      this.loadUserFromToken(token);
    }
  }

  /**
   * Carga el usuario desde el token almacenado
   */
  private loadUserFromToken(token: string): void {
    try {
      const decoded: any = jwtDecode(token);
      this.userSignal.set({
        id: decoded.userId || decoded.id,
        email: decoded.email || decoded.sub,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        username: decoded.sub
      });
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }

  /**
   * Iniciar sesión
   */
  login(credentials: LoginRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  /**
   * Registrar usuario
   */
  register(user: RegisterRequest) {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, user);
  }

  /**
   * Establecer sesión después de login/registro
   */
  setSession(token: string): void {
    localStorage.setItem('token', token);
    this.tokenSignal.set(token);
    // Decodificar token para obtener todos los datos del usuario
    try {
      const decoded: any = jwtDecode(token);
      this.userSignal.set({
        id: decoded.userId || decoded.id,
        email: decoded.email,
        firstName: decoded.firstName,
        lastName: decoded.lastName,
        role: decoded.role,
        username: decoded.username,
      });

      console.log(this.userSignal());
    } catch (error) {
      // Fallback si no se puede decodificar
      this.userSignal.set({
        id: 0 ,
        email: "",
        firstName: "",
        lastName: "",
        role: "",
        username: ""
      });
    }
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.clear();
    this.tokenSignal.set(null);
    this.userSignal.set(undefined);
    localStorage.removeItem("token");
    this.router.navigate(['/auth/login']);
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return this.tokenSignal();
  }

  /**
   * Verificar token con el backend
   */
  verify(token: string) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify`, { headers });
  }

  /**
   * Obtener usuario decodificado del token (sin llamar al backend)
   */
  getDecodedUser(): UserType | undefined {
    return this.userSignal();
  }

  /**
   * Obtener nombre completo del usuario
   */
  getFullName(): string {
    const user = this.userSignal();
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.email?.split('@')[0] || 'Usuario';
  }

  /**
   * Obtener ID del usuario
   */
  getUserId(): number | null {
    return this.userSignal()?.id || null;
  }

 // Añade esto a tu AuthService

/**
 * Obtener el rol del usuario
 */
getRole(): string | null {
  return this.userSignal()?.role || null;
}

/**
 * Obtener el usuario actual (para compatibilidad con componentes)
 */
currentUser():UserType | undefined {
  return this.userSignal();
}
}