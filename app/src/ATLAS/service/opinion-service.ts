// src/app/service/opinion-service.ts
import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../environments/environment';
import { OpinionRequest, OpinionType, PageResponse } from '../types/types';
import { tap, catchError, throwError } from 'rxjs';
import { AuthService } from '../auth/service/auth-service';

@Injectable({ providedIn: 'root' })
export class OpinionService {

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/opiniones`;

  // Signals
  opinions = signal<OpinionType[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  totalElements = signal(0);
  pageSize = 2;
  isLoading = signal(false);
  error = signal<string | null>(null);

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // GET paginado
  getByLodging(lodgingId: number, page: number = 0) {
    this.isLoading.set(true);
    this.error.set(null);

    this.http.get<PageResponse<OpinionType>>(
      `${this.apiUrl}?alojamientoId=${lodgingId}&page=${page}&size=${this.pageSize}`,
      { headers: this.getHeaders() }
    ).subscribe({
      next: (res) => {
        this.opinions.set(res.content);
        this.currentPage.set(res.number);
        this.totalPages.set(res.totalPages);
        this.totalElements.set(res.totalElements);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando opiniones:', err);
        this.error.set('Error al cargar las opiniones');
        this.isLoading.set(false);
      }
    });
  }

  nextPage(lodgingId: number) {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.getByLodging(lodgingId, this.currentPage() + 1);
    }
  }

  prevPage(lodgingId: number) {
    if (this.currentPage() > 0) {
      this.getByLodging(lodgingId, this.currentPage() - 1);
    }
  }

  // Crear opinión
  create(opinion: OpinionRequest) {
    return this.http.post<OpinionType>(
      `${this.apiUrl}`,
      opinion,
      { headers: this.getHeaders() }
    ).pipe(
      tap((newOpinion) => {
        // Actualizar la lista local si estamos en la primera página
        if (this.currentPage() === 0) {
          this.opinions.update(opinions => [newOpinion, ...opinions]);
        }
      }),
      catchError((error) => {
        console.log('Error creando opinión:', error);
        return throwError(() => new Error(error.error?.message || 'Error al crear la opinión'));
      })
    );
  }

  // Eliminar opinión
  delete(id: number) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      { headers: this.getHeaders() }
    ).pipe(
      tap(() => {
        // Eliminar la opinión de la lista local
        this.opinions.update(opinions => opinions.filter(o => o.id !== id));
      }),
      catchError((error) => {
        console.error('Error eliminando opinión:', error);
        return throwError(() => new Error(error.error?.message || 'Error al eliminar la opinión'));
      })
    );
  }

  // Editar opinión
  edit(id: number, opinion: OpinionRequest) {
    return this.http.patch<OpinionType>(
      `${this.apiUrl}/${id}`,
      opinion,
      { headers: this.getHeaders() }
    ).pipe(
      tap((updatedOpinion) => {
        // Actualizar la opinión en la lista local
        this.opinions.update(opinions => 
          opinions.map(o => o.id === id ? updatedOpinion : o)
        );
      }),
      catchError((error) => {
        console.error('Error editando opinión:', error);
        return throwError(() => new Error(error.error?.message || 'Error al editar la opinión'));
      })
    );
  }
}