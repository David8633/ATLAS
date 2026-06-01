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
import { AuthService } from '../../auth/service/auth-service';
import { LodgingsType } from '../../types/types';
import { BookingService } from '../../service/booking-service';
import { AdminService } from '../../service/admin-service';

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
  authService = inject(AuthService);

  lodgingService = inject(LodgingService);
  opinionService = inject(OpinionService);
  BookingService = inject(BookingService);
  adminService = inject(AdminService);

  lodging: any = null;
  lodgingId!: number;
  loading = signal<boolean>(true);

  checkin: string = this.bookingStore.checkin() || "";
  checkout: string = this.bookingStore.checkout() || "";
  people: number = this.bookingStore.people() || 0;
  nights: number = this.bookingStore.nights() || 0;
  totalPrice: number = this.bookingStore.totalPrice() || 0;

  minDate: string = new Date().toISOString().split('T')[0];

  ngOnInit() {
    this.lodgingId = Number(this.activatedRoute.snapshot.paramMap.get('id'));
    this.loadLodging();

    const storedCheckin = this.bookingStore.checkin();
    const storedCheckout = this.bookingStore.checkout();

    if (storedCheckin) this.checkin = storedCheckin;
    if (storedCheckout) this.checkout = storedCheckout;

    this.updatePreviewPrice()

  }

  updatePreviewPrice() {
    if (this.checkin && this.checkout && this.lodging) {
      this.nights = this.calculateNights();
      this.totalPrice = this.lodging.pricePerNight * this.nights;
    }
  }


  loadLodging() {
  this.lodgingService.getByIdFromApi(this.lodgingId).subscribe({
    next: (data) => {
      this.lodging = data;
      this.opinionService.getByLodging(this.lodgingId);
      this.loading.set(false);
    },
    error: () => {
      Swal.fire({
        icon: 'error',
        title: 'Alojamiento no encontrado',
        text: 'El alojamiento que buscas no existe.',
        confirmButtonColor: '#d33'
      }).then(() => {
        this.router.navigate(['/lodgings']);
      });
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
    if (!this.checkin || !this.checkout) {
      Swal.fire({
        icon: 'warning',
        title: 'Selecciona fechas',
        text: 'Debes elegir check-in y check-out.',
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
        text: 'La fecha de entrada debe ser anterior.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    if (this.people > 10) {
      Swal.fire({
        icon: 'error',
        title: 'Cantidad inválida',
        text: 'La cantidad de personas no puede ser mayor a 10.',
        confirmButtonColor: '#d33'
      });
      return;
    }

    const payload = {
      lodgingId: this.lodging.id,
      checkinDate: this.formatDate(this.checkin),
      people: this.people,
      checkoutDate: this.formatDate(this.checkout),
    };

    this.BookingService.validateBooking(payload).subscribe({
      next: () => {
        this.nights = this.calculateNights();
        this.totalPrice = this.lodging.pricePerNight * this.nights;

        this.bookingStore.setBooking({
          checkin: this.checkin,
          checkout: this.checkout,
          nights: this.nights,
          totalPrice: this.totalPrice,
          lodgingId: this.lodging.id,
          lodgingName: this.lodging.name,
          people: this.people
        });

        Swal.fire({
          icon: 'success',
          title: 'Reserva preparada',
          text: `Has reservado ${this.nights} noche(s). Total: ${this.totalPrice} €`
        }).then(() => {
          this.router.navigate(['/payBooking']);
        });
      },

      error: (err) => {
        const apiMessage =
          Array.isArray(err.error?.messages)
            ? err.error.messages[0]
            : err.error?.messages ||
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

  onEdit(lodging: LodgingsType) {
    this.router.navigateByUrl("/edit/lodging/" + lodging.id);
  }

 onDelete(lodging: LodgingsType) {
  Swal.fire({
    title: '¿Eliminar alojamiento?',
    text: `Se eliminará "${lodging.name}". Esta acción no se puede deshacer.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar'
  }).then((result) => {
    if (result.isConfirmed) {

      this.adminService.deleteLodging(lodging.id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El alojamiento ha sido eliminado correctamente.'
          });

          // 🔥 Recargar lista o redirigir
          this.router.navigate(['/lodgings']);
        },
        error: () => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el alojamiento.'
          });
        }
      });

    }
  });
}

  private formatDate(date: any): string {
    return new Date(date).toISOString().split('T')[0];
  }
}
