import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from '../../../environments/environment';
import {
  AuthResponse,
  LoginRequest,
  RegistroRequest
} from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly usuarioKey = 'petapp_usuario';

  login(datos: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, datos, {
      withCredentials: true // Envía y recibe cookies
    }).pipe(
      tap(response => this.guardarSesion(response))
    );
  }

  registrar(datos: RegistroRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/registro`, datos, {
      withCredentials: true
    }).pipe(
      tap(response => this.guardarSesion(response))
    );
  }

  private guardarSesion(respuesta: AuthResponse): void {
    // El token está en la cookie HTTP-only, solo guardamos datos del usuario
    localStorage.setItem(this.usuarioKey, JSON.stringify({
      id: respuesta.usuarioId,
      nombre: respuesta.nombre,
      correo: respuesta.correo
    }));
  }

  obtenerUsuario(): { id: number; nombre: string; correo: string } | null {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  obtenerIdUsuario(): number | null {
    return this.obtenerUsuario()?.id || null;
  }

  estaAutenticado(): boolean {
    return localStorage.getItem(this.usuarioKey) !== null;
  }

  cerrarSesion(): void {
    // Llamar al endpoint de logout para eliminar la cookie
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem(this.usuarioKey);
          this.router.navigate(['/login']);
        },
        error: () => {
          // Si falla, igual limpiamos localmente
          localStorage.removeItem(this.usuarioKey);
          this.router.navigate(['/login']);
        }
      });
  }
}
