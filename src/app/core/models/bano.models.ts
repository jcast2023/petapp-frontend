export interface MascotaEnBano {
  id: number;
  nombre: string;
  especie: string;
  raza?: string;
  fechaNacimiento?: string;
  sexo?: string;
  fotoUrl?: string | null;
}

export interface Bano {
  id: number;
  fecha: string;
  notas: string;
  mascota: MascotaEnBano;
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
