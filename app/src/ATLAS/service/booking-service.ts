import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { BookingRequest, BookingType } from '../types/types';



@Injectable({ providedIn: 'root' })
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/reservas`;

  isLoading = signal(false);
  private bookingsSignal = signal<BookingType[]>([]);
  private totalPagesSignal = signal(0);
  private currentPageSignal = signal(0);

  allBookings = this.bookingsSignal.asReadonly();
  totalBookings = computed(() => this.bookingsSignal().length);
  totalPages = this.totalPagesSignal.asReadonly();
  currentPage = this.currentPageSignal.asReadonly();

  loadMyBookings(page: number = 0, size: number = 10) {
    this.isLoading.set(true);
    this.http.get<any>(`${this.apiUrl}/mis-reservas?page=${page}&size=${size}`).subscribe({
      next: (response) => {
        this.bookingsSignal.set(response.content);
        this.totalPagesSignal.set(response.totalPages);
        this.currentPageSignal.set(response.pageNumber);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading bookings:', err);
        this.isLoading.set(false);
      }
    });
  }

  loadAllBookings(page: number = 0, size: number = 10) {
    this.isLoading.set(true);
    this.http.get<any>(`${this.apiUrl}/admin/all?page=${page}&size=${size}`).subscribe({
      next: (response) => {
        this.bookingsSignal.set(response.content);
        this.totalPagesSignal.set(response.totalPages);
        this.currentPageSignal.set(response.pageNumber);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading all bookings:', err);
        this.isLoading.set(false);
      }
    });
  }

  createBooking(booking: BookingRequest) {
    return this.http.post<BookingType>(this.apiUrl, booking);
  }

  cancelBooking(id: number) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getById(id: number) {
    return this.http.get<BookingType>(`${this.apiUrl}/${id}`);
  }

  payBooking(data: {
    lodgingId: number;
    checkinDate: string;
    checkoutDate: string;
    paymentMethod: string;
  }) {
    console.log(data);
    return this.http.post(`${this.apiUrl}`, data);
  }


}