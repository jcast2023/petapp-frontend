export interface Vacuna {
  id: number;
  nombreVacuna: string;
  fechaAplicacion: string;
  fechaProximaDosis: string;
  veterinario: string;
  notas: string;
  mascotaId: number;
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
