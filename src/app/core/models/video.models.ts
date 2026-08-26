export interface Video {
  id: number;
  titulo: string;
  descripcion: string;
  urlVideo: string;
  comando: string;
  nivel: string; // "Básico", "Intermedio", "Avanzado"
  duracionSegundos: number;
  miniaturaUrl: string;
}

export interface CrearVideoRequest {
  titulo: string;
  descripcion: string;
  urlVideo: string;
  comando: string;
  nivel: string;
  duracionSegundos: number;
  miniaturaUrl: string;
}

export interface ActualizarVideoRequest {
  titulo: string;
  descripcion: string;
  urlVideo: string;
  comando: string;
  nivel: string;
  duracionSegundos: number;
  miniaturaUrl: string;
}
