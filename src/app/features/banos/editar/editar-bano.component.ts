import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { BanoService } from '../../../core/services/bano.service';
import { MascotaService } from '../../../core/services/mascota.service';
import { Mascota } from '../../../core/models/mascota.models';

@Component({
  selector: 'app-editar-bano',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './editar-bano.component.html',
  styleUrl: './editar-bano.component.scss'
})
export class EditarBanoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly banoService = inject(BanoService);
  private readonly mascotaService = inject(MascotaService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  mascotas: Mascota[] = [];
  cargando = false;
  cargandoMascotas = false;
  error = '';
  banoId = 0;

  formulario = this.fb.group({
    fecha: ['', [Validators.required]],
    notas: [''],
    mascotaId: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.banoId = Number(this.route.snapshot.params['id']);
    this.cargarMascotas();
    this.cargarBano();
  }

  cargarMascotas(): void {
    this.cargandoMascotas = true;
    this.mascotaService.listar()
      .pipe(finalize(() => this.cargandoMascotas = false))
      .subscribe({
        next: (mascotas) => {
          this.mascotas = mascotas;
        },
        error: () => {
          this.error = 'Error al cargar las mascotas';
        }
      });
  }

  cargarBano(): void {
    this.cargando = true;
    this.banoService.obtenerPorId(this.banoId)
      .pipe(finalize(() => this.cargando = false))
      .subscribe({
        next: (bano) => {
          this.formulario.patchValue({
            fecha: bano.fecha,
            notas: bano.notas,
            mascotaId: String(bano.mascotaId)
          });
        },
        error: () => {
          this.error = 'Error al cargar el registro de baño';
        }
      });
  }

  onSubmit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.cargando = true;
    this.error = '';
    const datos = this.formulario.value;

    this.banoService.actualizar(this.banoId, {
      fecha: datos.fecha!,
      notas: datos.notas || ''
    })
    .pipe(finalize(() => this.cargando = false))
    .subscribe({
      next: () => {
        this.router.navigate(['/banos']);
      },
      error: (error: HttpErrorResponse) => {
        this.error = error.error?.mensaje || 'Error al actualizar el registro';
      }
    });
  }
}
