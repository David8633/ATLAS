import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BookingType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  
  private httpClient = inject(HttpClient);
  private _allBooking = signal<BookingType[]>([]);
  allBooking = this._allBooking.asReadonly();
  private url = "http://localhost:3000/reservas";

  constructor(){
    this.getAllBooking()
  }

  getAllBooking(){
    this.httpClient.get<BookingType[]>(this.url).subscribe({
      next: (books) => {
        this._allBooking.set(books);
      }
    })
  }
}
