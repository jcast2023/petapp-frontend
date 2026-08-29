import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Desparasitacion, CrearDesparasitacionRequest, ActualizarDesparasitacionRequest } from '../models/desparasitacion.models';

@Injectable({
  providedIn: 'root'
})
export class DesparasitacionService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/desparasitaciones`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en DesparasitacionService:', error);
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

  listar(): Observable<Desparasitacion[]> {
    console.log('📤 DesparasitacionService.listar() llamado');
    return this.http.get<Desparasitacion[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<Desparasitacion> {
    console.log('📤 DesparasitacionService.obtenerPorId() llamado con ID:', id);
    return this.http.get<Desparasitacion>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(desparasitacion: CrearDesparasitacionRequest): Observable<Desparasitacion> {
    console.log('📤 Creando desparasitación:', desparasitacion);

    const body = {
      tipo: desparasitacion.tipo,
      producto: desparasitacion.producto,
      fechaAplicacion: desparasitacion.fechaAplicacion,
      fechaProximaDosis: desparasitacion.fechaProximaDosis,
      notas: desparasitacion.notas
    };

    const params = new HttpParams().set('mascotaId', desparasitacion.mascotaId.toString());

    console.log('📤 Body enviado:', JSON.stringify(body, null, 2));
    console.log('📤 Param enviado: mascotaId =', desparasitacion.mascotaId);

    return this.http.post<Desparasitacion>(this.apiUrl, body, {
      params,
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, desparasitacion: ActualizarDesparasitacionRequest): Observable<Desparasitacion> {
    console.log('📤 Actualizando desparasitación ID:', id);

    const body = {
      tipo: desparasitacion.tipo,
      producto: desparasitacion.producto,
      fechaAplicacion: desparasitacion.fechaAplicacion,
      fechaProximaDosis: desparasitacion.fechaProximaDosis,
      notas: desparasitacion.notas
    };

    return this.http.put<Desparasitacion>(`${this.apiUrl}/${id}`, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 Eliminando desparasitación ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
