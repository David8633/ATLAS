// src/app/service/admin.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from '../auth/service/auth-service';
import { DestinationType, LodgingsType, PageResponse, UserType } from '../types/types';
import { Booking } from '../pages/booking/booking';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;


  // ==========================================
  // USUARIOS
  // ==========================================
  
  getUsers(page: number = 0, size: number = 10): Observable<PageResponse<UserType>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    return this.http.get<PageResponse<UserType>>(`${this.apiUrl}/users`);
  }

  getUserById(id: number): Observable<UserType> {
    return this.http.get<UserType>(`${this.apiUrl}/users/${id}`);
  }

  updateUser(id: number, user: Partial<UserType>): Observable<UserType> {
    return this.http.put<UserType>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }

  // ==========================================
  // RESERVAS
  // ==========================================
  
  getBookings(): Observable<PageResponse<Booking>> {
    return this.http.get<PageResponse<Booking>>(`${this.apiUrl}/reservas`);
  }

  getBookingById(id: number): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/reservas/${id}`);
  }

  updateBooking(id: number, booking: Partial<Booking>): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/reservas/${id}`, booking);
  }

  deleteBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/reservas/${id}`);
  }

  // ==========================================
  // DESTINOS
  // ==========================================
  
  getDestinations(): Observable<PageResponse<DestinationType>> { 
    return this.http.get<PageResponse<DestinationType>>(`${this.apiUrl}/destinos`);
  }

  createDestination(destination: Partial<DestinationType>): Observable<DestinationType> {
    return this.http.post<DestinationType>(`${this.apiUrl}/destinos`, destination);
  }

  updateDestination(id: number, destination: Partial<DestinationType >): Observable<DestinationType> {
    return this.http.put<DestinationType>(`${this.apiUrl}/destinos/${id}`, destination);
  }

  deleteDestination(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/destinos/${id}`);
  }

  // ==========================================
  // ALOJAMIENTOS
  // ==========================================
  
  getLodgings(): Observable<PageResponse<LodgingsType>> {
    return this.http.get<PageResponse<LodgingsType>>(`${this.apiUrl}/alojamientos`);
  }

  createLodging(lodging: Partial<LodgingsType>): Observable<LodgingsType> {
    return this.http.post<LodgingsType>(`${this.apiUrl}/alojamientos`, lodging);
  }

 updateLodging(id: number, lodging: Partial<LodgingsType>): Observable<LodgingsType> {
  return this.http.put<LodgingsType>(`${this.apiUrl}/alojamientos/${id}`, lodging);
}


  deleteLodging(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/alojamientos/${id}`);
  }
}