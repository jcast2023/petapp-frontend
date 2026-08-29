import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Vacuna, CrearVacunaRequest, ActualizarVacunaRequest } from '../models/vacuna.models';

@Injectable({
  providedIn: 'root'
})
export class VacunaService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/vacunas`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en VacunaService:', error);
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

  listar(): Observable<Vacuna[]> {
    console.log('📤 VacunaService.listar() llamado');
    return this.http.get<Vacuna[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<Vacuna> {
    console.log('📤 VacunaService.obtenerPorId() llamado con ID:', id);
    return this.http.get<Vacuna>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(vacuna: CrearVacunaRequest): Observable<Vacuna> {
    console.log('📤 Creando vacuna:', vacuna);

    const body = {
      nombreVacuna: vacuna.nombreVacuna,
      fechaAplicacion: vacuna.fechaAplicacion,
      fechaProximaDosis: vacuna.fechaProximaDosis,
      veterinario: vacuna.veterinario,
      notas: vacuna.notas
    };

    const params = new HttpParams().set('mascotaId', vacuna.mascotaId.toString());

    return this.http.post<Vacuna>(this.apiUrl, body, {
      params,
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, vacuna: ActualizarVacunaRequest): Observable<Vacuna> {
    console.log('📤 Actualizando vacuna ID:', id);

    const body = {
      nombreVacuna: vacuna.nombreVacuna,
      fechaAplicacion: vacuna.fechaAplicacion,
      fechaProximaDosis: vacuna.fechaProximaDosis,
      veterinario: vacuna.veterinario,
      notas: vacuna.notas
    };

    return this.http.put<Vacuna>(`${this.apiUrl}/${id}`, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 Eliminando vacuna ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
