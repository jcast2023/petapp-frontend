export interface Mascota {
  id: number;
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string; // ISO date: "2024-01-15"
  sexo: string; // "Macho" o "Hembra"
  fotoUrl: string;
}

export interface CrearMascotaRequest {
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  fotoUrl: string;
}

export interface ActualizarMascotaRequest {
  nombre: string;
  especie: string;
  raza: string;
  fechaNacimiento: string;
  sexo: string;
  fotoUrl: string;
}
