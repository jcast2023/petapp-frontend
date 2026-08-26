import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Mascota, CrearMascotaRequest, ActualizarMascotaRequest } from '../models/mascota.models';

@Injectable({
  providedIn: 'root'
})
export class MascotaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/mascotas`;

  listar(): Observable<Mascota[]> {
    return this.http.get<Mascota[]>(this.apiUrl, {
      withCredentials: true
    });
  }

  obtenerPorId(id: number): Observable<Mascota> {
    return this.http.get<Mascota>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }

  crear(mascota: CrearMascotaRequest): Observable<Mascota> {
    return this.http.post<Mascota>(this.apiUrl, mascota, {
      withCredentials: true
    });
  }

  actualizar(id: number, mascota: ActualizarMascotaRequest): Observable<Mascota> {
    return this.http.put<Mascota>(`${this.apiUrl}/${id}`, mascota, {
      withCredentials: true
    });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });
  }
}
