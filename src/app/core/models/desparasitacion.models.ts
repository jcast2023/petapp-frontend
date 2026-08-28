export interface Desparasitacion {
  id: number;
  tipo: string;
  producto: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  notas: string;
  mascotaId: number; // Cambiar de "mascota" a "mascotaId"
}

export interface CrearDesparasitacionRequest {
  tipo: string;
  producto: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  notas: string;
  mascotaId: number;
}

export interface ActualizarDesparasitacionRequest {
  tipo: string;
  producto: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  notas: string;
  mascotaId: number;
}
