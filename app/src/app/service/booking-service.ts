import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  
  private httpClient = inject(HttpClient);
  private allBooking = signal<BookingType[]>([]);


}
