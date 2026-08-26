export interface MascotaEnDesparasitacion {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
}

export interface Desparasitacion {
  id: number;
  tipo: string; // "Interna" o "Externa"
  producto: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  notas: string;
  mascota: MascotaEnDesparasitacion;
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
