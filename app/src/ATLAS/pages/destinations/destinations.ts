import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DestinationService } from '../../service/destination-service';
import { DestinationType, LodgingsType } from '../../types/types';

@Component({
  selector: 'app-destinations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './destinations.html',
  styleUrls: ['./destinations.css']
})
export class Destinations implements OnInit {

  destinationService = inject(DestinationService);
  top8Destination = signal<DestinationType[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.destinationService.getTop8Destinos().subscribe({

      next: (destinations) => {

        console.log('Destinations:', destinations);

        this.top8Destination.set(destinations);

        this.isLoading.set(false);
      },

      error: (err) => {

        console.error('Error cargando top destinos:', err);

        this.isLoading.set(false);
      }
    });
  }
}