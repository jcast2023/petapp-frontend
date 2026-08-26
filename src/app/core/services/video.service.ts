import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Video, CrearVideoRequest, ActualizarVideoRequest } from '../models/video.models';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/videos-obediencia`;

  private manejarError(error: HttpErrorResponse): Observable<never> {
    console.error('❌ Error en VideoService:', error);
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

  listar(): Observable<Video[]> {
    console.log('📤 VideoService.listar() llamado');
    return this.http.get<Video[]>(this.apiUrl, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerPorId(id: number): Observable<Video> {
    console.log('📤 VideoService.obtenerPorId() llamado con ID:', id);
    return this.http.get<Video>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  crear(video: CrearVideoRequest): Observable<Video> {
    console.log('📤 Creando video:', video);

    return this.http.post<Video>(this.apiUrl, video, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  actualizar(id: number, video: ActualizarVideoRequest): Observable<Video> {
    console.log('📤 Actualizando video ID:', id);

    return this.http.put<Video>(`${this.apiUrl}/${id}`, video, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }

  eliminar(id: number): Observable<void> {
    console.log('📤 Eliminando video ID:', id);
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      withCredentials: true
    }).pipe(
      catchError(this.manejarError)
    );
  }
}
