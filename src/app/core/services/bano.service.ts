import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Bano, BanoRequest } from '../models/bano.models';

@Injectable({ providedIn: 'root' })
export class BanoService {
  private baseUrl = `${environment.apiUrl}/api/banos`;

  constructor(private http: HttpClient) {}

  listar(): Observable<Bano[]> {
    return this.http.get<Bano[]>(this.baseUrl, { withCredentials: true });
  }

  obtenerPorId(id: number): Observable<Bano> {
    return this.http.get<Bano>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  crear(request: BanoRequest, mascotaId: number): Observable<Bano> {
    const params = new HttpParams().set('mascotaId', mascotaId.toString());
    return this.http.post<Bano>(this.baseUrl, request, { params, withCredentials: true });
  }

  actualizar(id: number, request: BanoRequest): Observable<Bano> {
    return this.http.put<Bano>(`${this.baseUrl}/${id}`, request, { withCredentials: true });
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}
