import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Bano } from '../models/bano.models';
import { Mascota } from '../models/mascota.models';

@Injectable({
  providedIn: 'root'
})
export class BanoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/banos`;

  listar(): Observable<Bano[]> {
    return this.http.get<Bano[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  obtenerPorId(id: number): Observable<Bano> {
    return this.http.get<Bano>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  crear(mascotaId: number, fecha: string, notas: string): Observable<Bano> {
    return this.http.post<Bano>(this.apiUrl, {
      fecha: fecha,
      notas: notas,
      mascotaId: mascotaId
    }, {
      withCredentials: true
    });
  }

  actualizar(id: number, mascotaId: number, fecha: string, notas: string): Observable<Bano> {
    return this.http.put<Bano>(`${this.apiUrl}/${id}`, {
      fecha: fecha,
      notas: notas,
      mascotaId: mascotaId
    }, {
      withCredentials: true
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
