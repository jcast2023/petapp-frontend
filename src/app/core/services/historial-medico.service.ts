import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { HistorialMedico, CrearHistorialMedicoRequest, ActualizarHistorialMedicoRequest } from '../models/historial-medico.models';

@Injectable({
  providedIn: 'root'
})
export class HistorialMedicoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/historial-medico`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en HistorialMedicoService:', error);
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

  listar(): Observable<HistorialMedico[]> {
    console.log('📤 HistorialMedicoService.listar() llamado');
    return this.http.get<HistorialMedico[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<HistorialMedico> {
    console.log('📤 HistorialMedicoService.obtenerPorId() llamado con ID:', id);
    return this.http.get<HistorialMedico>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(historial: CrearHistorialMedicoRequest): Observable<HistorialMedico> {
    console.log('📤 Creando historial médico:', historial);

    const body = {
      fecha: historial.fecha,
      motivoConsulta: historial.motivoConsulta,
      diagnostico: historial.diagnostico,
      tratamiento: historial.tratamiento,
      veterinario: historial.veterinario,
      clinica: historial.clinica,
      mascota: { id: historial.mascotaId }
    };

    console.log('📤 Body enviado:', JSON.stringify(body, null, 2));

    return this.http.post<HistorialMedico>(this.apiUrl, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, historial: ActualizarHistorialMedicoRequest): Observable<HistorialMedico> {
    console.log('📤 Actualizando historial médico ID:', id);

    const body = {
      fecha: historial.fecha,
      motivoConsulta: historial.motivoConsulta,
      diagnostico: historial.diagnostico,
      tratamiento: historial.tratamiento,
      veterinario: historial.veterinario,
      clinica: historial.clinica,
      mascota: { id: historial.mascotaId }
    };

    return this.http.put<HistorialMedico>(`${this.apiUrl}/${id}`, body, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 Eliminando historial médico ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
