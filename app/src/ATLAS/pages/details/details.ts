import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LodgingService } from '../../service/lodging-service';
import { OpinionService } from '../../service/opinion-service';
import { OpinionsSection } from '../../components/opinions-section/opinions-section';
import { MapComponent } from '../../components/map-component/map-component';
import { BookingStore } from '../../service/booking-store';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MapComponent,
    RouterLink,
    OpinionsSection
],
  templateUrl: './details.html',
  styleUrls: ['./details.css']
})
export class Details implements OnInit {

  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private bookingStore = inject(BookingStore);

  lodgingService = inject(LodgingService);
  opinionService = inject(OpinionService);

  lodging: any = null;
  lodgingId!: number;

  loading = signal<boolean>(true);

  // Fechas seleccionadas por el usuario
  checkin: string = '';
  checkout: string = '';

  nights: number = 0;
  totalPrice: number = 0;

  // Fecha mínima (hoy) en formato yyyy-mm-dd
  minDate: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.lodgingId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadLodging();

    // Si ya hay datos en el store, precargarlos en los inputs
    const storedCheckin = this.bookingStore.checkin();
    const storedCheckout = this.bookingStore.checkout();
    if (storedCheckin) this.checkin = storedCheckin;
    if (storedCheckout) this.checkout = storedCheckout;
  }

  loadLodging() {
    this.lodgingService.getByIdFromApi(this.lodgingId).subscribe({
      next: (data) => {
        this.lodging = data;
        this.opinionService.getByLodging(this.lodgingId);
        this.loading.set(false);
      }
    });
  }

  calculateNights(): number {
    if (!this.checkin || !this.checkout) return 0;
    const start = new Date(this.checkin);
    const end = new Date(this.checkout);
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  }

  reserve() {
    // Validaciones
    if (!this.checkin || !this.checkout) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona fechas',
        text: 'Debes elegir check‑in y check‑out antes de reservar.',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    const start = new Date(this.checkin);
    const end = new Date(this.checkout);

    if (start >= end) {
      Swal.fire({
        icon: 'error',
        title: 'Fechas inválidas',
        text: 'La fecha de entrada debe ser anterior a la de salida.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    // Cálculo y guardado
    this.nights = this.calculateNights();
    this.totalPrice = this.lodging.pricePerNight * this.nights;

    this.bookingStore.setBooking({
      checkin: this.checkin,
      checkout: this.checkout,
      nights: this.nights,
      totalPrice: this.totalPrice,
      lodgingId: this.lodging.id,
      lodgingName: this.lodging.name
    });

    Swal.fire({
      icon: 'success',
      title: 'Fechas guardadas',
      text: `Has reservado ${this.nights} noche(s). Total: ${this.totalPrice} €`,
    }).then(() => {
      this.router.navigate(['/payBooking']);
    });
  }
}
