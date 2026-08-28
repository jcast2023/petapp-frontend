export interface HistorialMedico {
  id: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  veterinario: string;
  clinica: string;
  mascotaId: number; // Cambiar de "mascota" a "mascotaId"
}

export interface CrearHistorialMedicoRequest {
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  veterinario: string;
  clinica: string;
  mascotaId: number;
}

export interface ActualizarHistorialMedicoRequest {
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  veterinario: string;
  clinica: string;
  mascotaId: number;
}
