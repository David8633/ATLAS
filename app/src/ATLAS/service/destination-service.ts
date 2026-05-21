import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { DestinationType } from '../types/types';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DestinationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/destinos`;

  isLoading = signal(false);
  private destinationsSignal = signal<DestinationType[]>([]);

  allDestinations = this.destinationsSignal.asReadonly();
  topDestinations = computed(() => this.destinationsSignal().slice(0, 6));

  constructor() {
    this.loadAllDestinations();
    this.getTop8Destinos()
  }

  loadAllDestinations() {
    this.isLoading.set(true);
    this.http.get<DestinationType[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.destinationsSignal.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading destinations:', err);
        this.isLoading.set(false);
      }
    });
  }

  getById(id: number) {
    return this.http.get<DestinationType>(`${this.apiUrl}/${id}`);
  }
  
  getTop8Destinos(): Observable<DestinationType[]> {
    return this.http.get<DestinationType[]>(
      `${this.apiUrl}/top8`
    );
  }
}
