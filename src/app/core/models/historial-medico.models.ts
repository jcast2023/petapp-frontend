export interface MascotaEnHistorial {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
}

export interface HistorialMedico {
  id: number;
  fecha: string;
  motivoConsulta: string;
  diagnostico: string;
  tratamiento: string;
  veterinario: string;
  clinica: string;
  mascota: MascotaEnHistorial;
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
