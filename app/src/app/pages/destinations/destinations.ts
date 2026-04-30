import { Component, inject } from '@angular/core';
import { DestinationService } from '../../service/destination-service';

@Component({
  selector: 'app-destinations',
  imports: [],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
})
export class Destinations {

  service = inject(DestinationService);

  allDestinations = this.service.allDestination;

  


}
