import { Injectable, signal } from '@angular/core';
import { single } from 'rxjs';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class BookingStore {

  checkin = signal<string | null>(null);
  checkout = signal<string | null>(null);
  nights = signal<number>(0);
  totalPrice = signal<number>(0);
  lodgingId = signal<number | null>(null);
  lodgingName = signal<string | null>(null);
  people = signal<number>(1);

  setBooking(data: {
    checkin: string;
    checkout: string;
    nights: number;
    totalPrice: number;
    lodgingId: number;
    lodgingName: string;
    people:number
  }) {
    this.checkin.set(data.checkin);
    this.checkout.set(data.checkout);
    this.nights.set(data.nights);
    this.totalPrice.set(data.totalPrice);
    this.lodgingId.set(data.lodgingId);
    this.lodgingName.set(data.lodgingName);
    this.people.set(data.people)
  }

  validateOrAlert(): boolean {
    if (!this.checkin() || !this.checkout()) {
      Swal.fire({
        icon: 'warning',
        title: 'Faltan fechas',
        text: 'Debes seleccionar check-in y check-out antes de continuar.',
        confirmButtonColor: '#007bff'
      });
      return false;
    }
    return true;
  }

  clear() {
    this.checkin.set(null);
    this.checkout.set(null);
    this.nights.set(0);
    this.totalPrice.set(0);
    this.lodgingId.set(null);
    this.lodgingName.set(null);
    this.people.set(1);
  }
}
