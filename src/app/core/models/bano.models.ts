export interface Bano {
  id: number;
  fecha: string;
  notas: string;
  mascotaId: number; // Cambiar de "mascota" a "mascotaId"
}

export interface CrearBanoRequest {
  fecha: string;
  notas: string;
  mascotaId: number;
}

export interface ActualizarBanoRequest {
  fecha: string;
  notas: string;
  mascotaId: number;
}
