export interface Bano {
  id: number;
  fecha: string;      // 'YYYY-MM-DD'
  notas?: string;
  mascotaId: number;
}

export interface BanoRequest {
  fecha: string;
  notas?: string;
}
