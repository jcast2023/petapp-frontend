export interface AuthResponse {
  usuarioId: number;
  nombre: string;
  correo: string;
  rol?: string;
}

export interface LoginRequest {
  correo: string;
  contrasena: string;
}

export interface RegistroRequest {
  nombre: string;
  correo: string;
  contrasena: string;
}
