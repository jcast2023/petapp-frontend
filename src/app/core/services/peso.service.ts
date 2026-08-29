import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Peso, CrearPesoRequest, ActualizarPesoRequest } from '../models/peso.models';

@Injectable({
  providedIn: 'root'
})
export class PesoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/pesos`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en PesoService:', error);
    let mensaje = 'Error al procesar la solicitud';

    if (error.status === 0) {
      mensaje = 'No se pudo conectar con el servidor';
    } else if (error.status === 401) {
      mensaje = 'Sesión expirada. Inicia sesión nuevamente';
    } else if (error.status === 403) {
      mensaje = 'No tienes permiso para realizar esta acción';
    } else if (error.status === 404) {
      mensaje = 'Registro no encontrado';
    } else if (error.error?.mensaje) {
      mensaje = error.error.mensaje;
    }

    return throwError(() => ({ mensaje, status: error.status }));
  }

  listar(): Observable<Peso[]> {
    console.log('📤 PesoService.listar() llamado');
    return this.http.get<Peso[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<Peso> {
    console.log('📤 PesoService.obtenerPorId() llamado con ID:', id);
    return this.http.get<Peso>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(peso: CrearPesoRequest): Observable<Peso> {
    console.log('📤 Creando registro de peso:', peso);

    const body = {
      fecha: peso.fecha,
      pesoKg: peso.pesoKg
    };

    const params = new HttpParams().set('mascotaId', peso.mascotaId.toString());

    return this.http.post<Peso>(this.apiUrl, body, {
      params,
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, peso: ActualizarPesoRequest): Observable<Peso> {
    console.log('📤 Actualizando peso ID:', id);

    const body = {
      fecha: peso.fecha,
      pesoKg: peso.pesoKg
    };

    return this.http.put<Peso>(`${this.apiUrl}/${id}`, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 Eliminando peso ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
