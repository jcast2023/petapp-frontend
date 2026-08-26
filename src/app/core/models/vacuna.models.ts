export interface MascotaEnVacuna {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
}

export interface Vacuna {
  id: number;
  nombreVacuna: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  veterinario: string;
  notas: string;
  mascota: MascotaEnVacuna;
}

export interface CrearVacunaRequest {
  nombreVacuna: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  veterinario: string;
  notas: string;
  mascotaId: number;
}

export interface ActualizarVacunaRequest {
  nombreVacuna: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  veterinario: string;
  notas: string;
  mascotaId: number;
}
