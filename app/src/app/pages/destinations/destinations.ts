import { Component, inject } from '@angular/core';
import { DestinationService } from '../../service/destination-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-destinations',
  standalone: true,  
  imports: [RouterLink],
  templateUrl: './destinations.html',
  styleUrl: './destinations.css',
})
export class Destinations {

  service = inject(DestinationService);

  allDestinations = this.service.allDestination;

  


}
