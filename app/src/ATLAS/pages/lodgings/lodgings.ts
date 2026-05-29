import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { LodgingService } from '../../service/lodging-service';
import { SearchEngine } from '../../components/search-engine/search-engine';
import { LodgingsType } from '../../types/types';
import Swal from 'sweetalert2';
import { BookingService } from '../../service/booking-service';
import { BookingStore } from '../../service/booking-store';

@Component({
  selector: 'app-lodgings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SearchEngine],
  templateUrl: './lodgings.html',
  styleUrls: ['./lodgings.css']
})
export class Lodgings implements OnInit {

  public lodgingService = inject(LodgingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private bookingStore = inject(BookingStore)

  destination = signal<string | null>(null);
  type = signal<string | null>(null);
  checkin = signal<string | null>(null);
  checkout = signal<string | null>(null);
  person = signal<string | null>(null);

  pageSize = 9;

  totalPages = this.lodgingService.totalPagesSignal;
  currentPage = this.lodgingService.currentPageSignal;

  hasFilters = computed(() => {
    return !!(
      this.destination() ||
      this.type() ||
      this.person() ||
      this.checkin() ||
      this.checkout()
    );
  });

  ngOnInit() {
    this.route.queryParams.subscribe(params => {

      this.destination.set(params['destination'] ?? '');
      this.type.set(params['type'] ?? '');
      this.person.set(params['count'] ?? '');
      this.checkin.set(params['checkin'] ?? '');
      this.checkout.set(params['checkout'] ?? '');

      const page = params['page'] ? +params['page'] : 0;

      this.lodgingService.loadLodgingsPage(page, this.pageSize, {
        destination: this.destination(),
        type: this.type(),
        count: this.person(),
        checkin: this.checkin(),
        checkout: this.checkout()
      });
    });
  }

  private updateQueryParams(page: number = 0) {
    const query: any = { page };

    if (this.destination()) query.destination = this.destination();
    if (this.type()) query.type = this.type();
    if (this.person()) query.count = this.person();
    if (this.checkin()) query.checkin = this.checkin();
    if (this.checkout()) query.checkout = this.checkout();

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: query,
      queryParamsHandling: ''
    });
  }

  applyFilters() {
    this.updateQueryParams(0);
  }

  onFilterChange() {
    this.applyFilters();
  }

  clearFilters() {
    this.destination.set('');
    this.type.set('');
    this.checkin.set('');
    this.checkout.set('');
    this.person.set('');

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        destination: null,
        type: null,
        count: null,
        checkin: null,
        checkout: null,
        page: null
      },
      queryParamsHandling: ''
    });
  }

  nextPage() {
    if (this.currentPage() + 1 < this.totalPages()) {
      this.updateQueryParams(this.currentPage() + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  prevPage() {
    if (this.currentPage() > 0) {
      this.updateQueryParams(this.currentPage() - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  calculateNights(checkin: string | null, checkout: string | null): number {
    if (!checkin || !checkout) return 0;

    const start = new Date(checkin);
    const end = new Date(checkout);

    const diff = end.getTime() - start.getTime();
    return diff / (1000 * 60 * 60 * 24);
  }


goToDetails(lodging: LodgingsType) {
  const checkin = this.checkin();
  const checkout = this.checkout();

  if (!checkin || !checkout) {
    Swal.fire({
      icon: 'warning',
      title: 'Selecciona fechas',
      text: 'Debes elegir check-in y check-out para continuar.',
      confirmButtonColor: '#007bff'
    });
    return;
  }

  const nights = this.calculateNights(checkin, checkout);

  this.bookingStore.setBooking({
    checkin,
    checkout,
    nights,
    totalPrice: lodging.pricePerNight * nights,
    lodgingId: lodging.id,
    lodgingName: lodging.name,
    people: Number(this.person())   // ✅ AQUÍ EL ARREGLO
  });

  this.router.navigate(['/details', lodging.id]);
}



}
