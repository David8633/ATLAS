import { Component, inject } from '@angular/core';
import { BookingService } from '../../service/booking-service';
import { RouterLink } from "@angular/router";
import { UserService } from '../../service/user-service';
import { UsuarioType } from '../../types/types';
import { AlojamientoService } from '../../service/alojamiento-service';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './books.html',
  styleUrl: './books.css',
})
export class Books {

  bookService = inject(BookingService);
  userService = inject(UserService)
  alojamientoService = inject(AlojamientoService);

  allBooks = this.bookService.allBooking;
  userNameFind :String = "";

  
}
