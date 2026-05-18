import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../service/booking-service';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './booking.html',
  styleUrls: ['./booking.css']
})
export class Booking implements OnInit {
  bookingService = inject(BookingService);
  authService = inject(AuthService);

  ngOnInit() {
    this.bookingService.loadMyBookings();
    console.log(this.bookingService.loadMyBookings());
  }
}