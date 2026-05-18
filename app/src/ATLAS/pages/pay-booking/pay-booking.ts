import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BookingService } from '../../service/booking-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BookingStore } from '../../service/booking-store';

@Component({
  selector: 'app-pay-booking',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './pay-booking.html',
  styleUrls: ['./pay-booking.css']
})
export class PayBooking implements OnInit {

  lodgingId!: number;
  lodgingName!: string;

  checkin!: string;
  checkout!: string;

  nights!: number;
  totalPrice!: number;

  paymentMethod: string = '';

  private router = inject(Router);
  private bookingService = inject(BookingService);
  private bookingStore = inject(BookingStore);

  ngOnInit() {
    if (!this.bookingStore.validateOrAlert()) {
      this.router.navigate(['/lodgings']);
      return;
    }

    this.lodgingId = this.bookingStore.lodgingId()!;
    this.lodgingName = this.bookingStore.lodgingName()!;
    this.checkin = this.bookingStore.checkin()!;
    this.checkout = this.bookingStore.checkout()!;
    this.nights = this.bookingStore.nights()!;
    this.totalPrice = this.bookingStore.totalPrice()!;
  }

  payBooking() {
    if (!this.paymentMethod) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona un método de pago',
        text: 'Debes elegir una opción para continuar',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    const payload = {
      lodgingId: this.lodgingId,
      checkinDate: this.formatDate(this.checkin),
      checkoutDate: this.formatDate(this.checkout),
      paymentMethod: this.paymentMethod
    };

    console.log(payload);

    this.bookingService.payBooking(payload).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Reserva completada',
          text: 'Tu reserva ha sido creada y pagada correctamente',
          confirmButtonColor: '#007bff'
        }).then(() => {
          this.bookingStore.clear();
          this.router.navigate(['/books']);
        });
      },
      error: (err) => {
        const apiMessage =
          err.error?.messages ||
          err.error?.error ||
          err.error ||
          'No se pudo procesar el pago. Inténtalo de nuevo.';

        Swal.fire({
          icon: 'error',
          title: 'Error en el pago',
          text: apiMessage,
          confirmButtonColor: '#d33'
        });
      }

    });
  }


  private formatDate(date: any): string {
    return new Date(date).toISOString().split('T')[0];
  }

}