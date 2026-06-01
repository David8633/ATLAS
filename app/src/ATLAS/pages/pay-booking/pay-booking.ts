import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../service/booking-service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { BookingStore } from '../../service/booking-store';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pay-booking',
  standalone: true,
  imports: [FormsModule, RouterLink],
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

  people: number = 1;

  private router = inject(Router);
  private bookingService = inject(BookingService);
  private bookingStore = inject(BookingStore);
  private location = inject(Location);

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
    this.people = this.bookingStore.people();
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
      people: this.people,
      paymentMethod: this.paymentMethod
    };

    console.log("Payload enviado:", payload);

    // 1️⃣ VALIDAR ANTES DE PAGAR
    this.bookingService.validateBooking(payload).subscribe({
      next: () => {
        // 2️⃣ SI TODO OK → PAGAR
        this.confirmPayment(payload);
      },
      error: (err) => {
        const apiMessage =
          err.error?.messages ||
          err.error?.error ||
          err.error ||
          'No se pudo validar la reserva.';

        Swal.fire({
          icon: 'error',
          title: 'No disponible',
          text: apiMessage,
          confirmButtonColor: '#d33'
        });
      }
    });
  }

  private confirmPayment(payload: any) {
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

        this.bookingStore.setBooking({
          checkin: '',
          checkout: '',
          nights: 0,
          totalPrice: 0,
          lodgingId: 0,
          lodgingName: '',
          people: 0
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

  back() {
    this.bookingStore.setBooking({
      checkin: this.checkin,
      checkout: this.checkout,
      nights: this.nights,
      totalPrice: this.totalPrice,
      lodgingId: this.lodgingId,
      lodgingName: this.lodgingName,
      people: this.people
    });

    this.location.back();
  }


}

