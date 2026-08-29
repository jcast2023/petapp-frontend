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

export interface UsuarioSesion {
  id: number;
  nombre: string;
  correo: string;
  rol: string;
}

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
      withCredentials: true
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
    const usuario: UsuarioSesion = {
      id: respuesta.usuarioId,
      nombre: respuesta.nombre,
      correo: respuesta.correo,
      rol: respuesta.rol || 'ROLE_USER' // Asegúrate de incluir el campo rol en AuthResponse del Backend
    };
    localStorage.setItem(this.usuarioKey, JSON.stringify(usuario));
  }

  obtenerUsuario(): UsuarioSesion | null {
    const usuario = localStorage.getItem(this.usuarioKey);
    return usuario ? JSON.parse(usuario) : null;
  }

  obtenerIdUsuario(): number | null {
    return this.obtenerUsuario()?.id || null;
  }

  getRole(): string {
    return this.obtenerUsuario()?.rol || 'ROLE_USER';
  }

  estaAutenticado(): boolean {
    return localStorage.getItem(this.usuarioKey) !== null;
  }

  cerrarSesion(): void {
    this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => {
          localStorage.removeItem(this.usuarioKey);
          this.router.navigate(['/login']);
        },
        error: () => {
          localStorage.removeItem(this.usuarioKey);
          this.router.navigate(['/login']);
        }
      });
  }
}
