import { KeyValuePipe, TitleCasePipe, UpperCasePipe } from '@angular/common';
import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LodgingService } from '../../service/lodging-service';
import { UserService } from '../../service/user-service';
import { BookingService } from '../../service/booking-service';
import { DestinationService } from '../../service/destination-service';
import { AdminService } from '../../service/admin-service';

@Component({
  selector: 'app-edit-form',
  standalone: true,
  imports: [ReactiveFormsModule, KeyValuePipe, TitleCasePipe],
  templateUrl: './edit-form.html',
  styleUrls: ['./edit-form.css']
})
export class EditFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private lodgingService = inject(LodgingService);
  private userService = inject(UserService);
  private bookingService = inject(BookingService);
  private destinationService = inject(DestinationService);
  private adminService = inject(AdminService);

  type!: 'user' | 'lodging' | 'destination' | 'booking';
  data = signal<any>({});
  form!: FormGroup;
  isLoading = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);

  ngOnInit() {
    this.loadRouteParams();
  }

  async loadRouteParams() {
    this.isLoading.set(true);
    this.type = this.route.snapshot.paramMap.get('type') as any;
    const id = this.route.snapshot.paramMap.get('id');

    try {
      if (this.type === 'lodging' && id !== null) {
        this.lodgingService.getByIdFromApi(parseInt(id)).subscribe({
          next: (lodging) => {
            this.data.set(lodging);
            this.buildForm();
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Error cargando alojamiento: ' + err.message);
            this.isLoading.set(false);
          }
        });
      } else if (this.type === 'user' && id !== null) {
        this.adminService.getUserById(parseInt(id)).subscribe({
          next: (user) => {
            this.data.set(user);
            this.buildForm();
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Error cargando usuario: ' + err.message);
            this.isLoading.set(false);
          }
        });
      } else if (this.type === 'destination' && id !== null) {
        this.destinationService.getById(parseInt(id)).subscribe({
          next: (destination) => {
            this.data.set(destination);
            this.buildForm();
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Error cargando destino: ' + err.message);
            this.isLoading.set(false);
          }
        });
      } else if (this.type === 'booking' && id !== null) {
        this.bookingService.getById(parseInt(id)).subscribe({
          next: (booking) => {
            this.data.set(booking);
            this.buildForm();
            this.isLoading.set(false);
          },
          error: (err) => {
            this.error.set('Error cargando reserva: ' + err.message);
            this.isLoading.set(false);
          }
        });
      }
    } catch (err: any) {
      this.error.set('Error: ' + err.message);
      this.isLoading.set(false);
    }
  }

  buildForm() {
    const currentData = this.data();

    switch (this.type) {
      case 'user':
        this.form = this.fb.group({
          firstName: [currentData.firstName || '', Validators.required],
          lastName: [currentData.lastName || '', Validators.required],
          username: [currentData.username || '', [Validators.required, Validators.minLength(3)]],
          email: [currentData.email || '', [Validators.required, Validators.email]],
          role: [currentData.role || 'USER', Validators.required]
        });
        break;

      case 'lodging':
        this.form = this.fb.group({
          name: [currentData.name || '', Validators.required],
          description: [currentData.description || ''],
          address: [currentData.address || '', Validators.required],
          pricePerNight: [currentData.pricePerNight || 0, [Validators.required, Validators.min(0)]],
          capacity: [currentData.capacity || 1, [Validators.required, Validators.min(1)]],
          type: [currentData.type || 'HOTEL', Validators.required],
          rating: [currentData.rating || 0, [Validators.min(0), Validators.max(5)]],
          active: [currentData.active !== undefined ? currentData.active : true]
        });
        break;

      case 'destination':
        this.form = this.fb.group({
          countryName: [currentData.countryName || '', Validators.required],
          cityName: [currentData.cityName || '', Validators.required],
          description: [currentData.description || ''],
          latitude: [currentData.latitude || null],
          longitude: [currentData.longitude || null]
        });
        break;

      case 'booking':
        this.form = this.fb.group({
          userId: [currentData.userId || '', Validators.required],
          lodgingId: [currentData.lodgingId || '', Validators.required],
          checkinDate: [currentData.checkinDate || '', Validators.required],
          checkoutDate: [currentData.checkoutDate || '', Validators.required],
          status: [currentData.status || 'PENDING', Validators.required],
          paymentMethod: [currentData.paymentMethod || ''],
          paid: [currentData.paid || false]
        });
        break;
    }
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Por favor, completa todos los campos requeridos');
      return;
    }

    this.isLoading.set(true);
    this.error.set(null);
    this.success.set(null);

    const id = this.route.snapshot.paramMap.get('id');
    const updatedData = this.form.value;
    const upper = new UpperCasePipe();
    updatedData.type = upper.transform(updatedData.type); 
    
    switch (this.type) {
      case 'user':
        this.adminService.updateUser(parseInt(id!), updatedData).subscribe({
          next: () => {
            this.success.set('Usuario actualizado correctamente');
            setTimeout(() => this.router.navigate(['/admin']), 2000);
          },
          error: (err) => {
            this.error.set('Error actualizando usuario: ' + err.error?.message || err.message);
            this.isLoading.set(false);
          }
        });
        break;

      case 'lodging':
        this.adminService.updateLodging(parseInt(id!), updatedData).subscribe({
          next: () => {
            this.success.set('Alojamiento actualizado correctamente');
            setTimeout(() => this.router.navigate(['/admin']), 2000);
          },
          error: (err) => {
            this.error.set('Error actualizando alojamiento: ' + err.error?.messages || err.messages);
            this.isLoading.set(false);
          }
        });
        break;

      case 'destination':
        this.adminService.updateDestination(parseInt(id!), updatedData).subscribe({
          next: () => {
            this.success.set('Destino actualizado correctamente');
            setTimeout(() => this.router.navigate(['/admin']), 2000);
          },
          error: (err) => {
            this.error.set('Error actualizando destino: ' + err.error?.message || err.message);
            this.isLoading.set(false);
          }
        });
        break;

      case 'booking':
        this.adminService.updateBooking(parseInt(id!), updatedData).subscribe({
          next: () => {
            this.success.set('Reserva actualizada correctamente');
            setTimeout(() => this.router.navigate(['/admin']), 2000);
          },
          error: (err) => {
            this.error.set('Error actualizando reserva: ' + err.error?.message || err.message);
            this.isLoading.set(false);
          }
        });
        break;
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}