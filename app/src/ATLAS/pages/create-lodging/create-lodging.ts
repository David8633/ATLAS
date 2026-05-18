import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LodgingService } from '../../service/lodging-service';
import { DestinationService } from '../../service/destination-service';
import { LodgingsTypeSinId } from '../../types/types';

@Component({
  selector: 'app-create-lodging',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-lodging.html',
  styleUrls: ['./create-lodging.css']
})
export class CreateLodging {
  lodgingService = inject(LodgingService);
  destinationService = inject(DestinationService);
  router = inject(Router);

  types = ['Hotel', 'Hostal', 'ApartHotel', 'Albergue', 'Resort', 'Posada'];

  formData  = {
    name: '',
    address: '',
    description: '',
    type: '',
    capacity: 1,
    pricePerNight: 0,
    latitude: 0,
    longitude: 0,
    destinationId: 0
  };

  ngOnInit() {
    this.destinationService.loadAllDestinations();
  }

   onSubmit() {
//     this.lodgingService.create(this.formData).subscribe({
//       next: () => {
//         alert('Alojamiento creado con éxito');
//         this.router.navigate(['/lodgings']);
//       },
//       error: (err) => {
//         console.error(err);
//         alert('Error al crear el alojamiento');
//       }
//     });
 }
}