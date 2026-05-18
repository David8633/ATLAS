import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { OpinionRequest, OpinionType } from '../types/types';

@Injectable({ providedIn: 'root' })
export class OpinionService {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/opiniones`;

  // Signals
  opinions = signal<OpinionType[]>([]);
  currentPage = signal(0);
  totalPages = signal(0);
  pageSize = 3;
  isLoading = signal(false);

  // GET paginado
  getByLodging(lodgingId: number, page: number = 0) {
    this.isLoading.set(true);

    this.http.get<any>(`${this.apiUrl}?alojamientoId=${lodgingId}&page=${page}&size=${this.pageSize}`)
      .subscribe({
        next: (res) => {
          this.opinions.set(res.content);
          this.currentPage.set(res.number);
          this.totalPages.set(res.totalPages);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
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

  create(opinion: OpinionRequest) {
    return this.http.post(`${this.apiUrl}`, opinion);
  }

  delete(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  edit(id: number, opinion: OpinionRequest) {
    return this.http.patch(`${this.apiUrl}/${id}`, opinion);
  }
}
