import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';
import { LodgingsType } from '../types/types';

@Injectable({ providedIn: 'root' })
export class LodgingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/alojamientos`;

  isLoading = signal(false);


  destination = signal<string | null>(null);
  type = signal<string | null>(null);
  checkin = signal<string | null>(null);
  checkout = signal<string | null>(null);
  person = signal<string | null>(null);

  lodgingsSignal = signal<LodgingsType[]>([]);
  totalPagesSignal = signal(0);
  currentPageSignal = signal(0);

  loadLodgingsPage(page: number, size: number = 9, filters: any = {}) {
    this.isLoading.set(true);

    let params = new HttpParams()
      .set('page', page)
      .set('size', size);

    console.log(filters);
    if (filters.destination !== null && filters.destination !== undefined)
      params = params.set('destination', filters.destination);

    if (filters.type !== null && filters.type !== undefined)
      params = params.set('type', filters.type);

    if (filters.capacity !== null && filters.capacity !== undefined)
      params = params.set('capacity', filters.capacity);

    if (filters.checkin !== null && filters.checkin !== undefined)
      params = params.set('checkin', filters.checkin);

    if (filters.checkout !== null && filters.checkout !== undefined)
      params = params.set('checkout', filters.checkout);



    this.http.get<any>(this.apiUrl, { params }).subscribe({
      next: (data) => {
        console.log(params)
        console.log(data);
        this.lodgingsSignal.set(data.content);

        console.log(this.lodgingsSignal());

        this.totalPagesSignal.set(data.totalPages);
        this.currentPageSignal.set(data.number);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading lodgings:', err);
        this.isLoading.set(false);
      }
    });
  }

  getByIdFromApi(id: number) {
    return this.http.get<LodgingsType>(`${this.apiUrl}/${id}`);
  }

  refresh(filters?: any) {
    this.loadLodgingsPage(0, 9, filters);
  }
}
