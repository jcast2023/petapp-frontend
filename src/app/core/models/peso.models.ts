export interface MascotaEnPeso {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
}

export interface Peso {
  id: number;
  fecha: string;
  pesoKg: number;
  mascota: MascotaEnPeso;
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
