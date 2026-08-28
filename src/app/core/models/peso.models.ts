export interface Peso {
  id: number;
  fecha: string;
  pesoKg: number;
  mascotaId: number; // Cambiar de "mascota" a "mascotaId"
}

export interface CrearPesoRequest {
  fecha: string;
  pesoKg: number;
  mascotaId: number;
}

export interface ActualizarPesoRequest {
  fecha: string;
  pesoKg: number;
  mascotaId: number;
}
