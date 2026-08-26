import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Bano, CrearBanoRequest, ActualizarBanoRequest } from '../models/bano.models';

@Injectable({
  providedIn: 'root'
})
export class BanoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/banos`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en BanoService:', error);
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
    } else if (error.error?.error) {
      mensaje = error.error.error;
    }

    return throwError(() => ({ mensaje, status: error.status }));
  }

  listar(): Observable<Bano[]> {
    console.log('📤 BanoService.listar() llamado');
    return this.http.get<Bano[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<Bano> {
    console.log('📤 BanoService.obtenerPorId() llamado con ID:', id);
    return this.http.get<Bano>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(bano: CrearBanoRequest): Observable<Bano> {
    console.log('📤 BanoService.crear() llamado con:', bano);
    const body = {
      fecha: bano.fecha,
      notas: bano.notas,
      mascota: { id: bano.mascotaId }
    };
    console.log('📤 Body enviado al backend:', body);

    return this.http.post<Bano>(this.apiUrl, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, bano: ActualizarBanoRequest): Observable<Bano> {
    console.log('📤 BanoService.actualizar() llamado con ID:', id, bano);
    return this.http.put<Bano>(`${this.apiUrl}/${id}`, {
      fecha: bano.fecha,
      notas: bano.notas,
      mascota: { id: bano.mascotaId }
    }, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 BanoService.eliminar() llamado con ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
