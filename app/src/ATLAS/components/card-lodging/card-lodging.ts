import { Component, Input, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LodgingsType } from '../../types/types';
import { AuthService } from '../../auth/service/auth-service';
import { Loading } from "../loading/loading";
import { LodgingService } from '../../service/lodging-service';

@Component({
  selector: 'app-card-lodging',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './card-lodging.html',
  styleUrls: ['./card-lodging.css']
})
export class CardLodgingComponent {
  
  lodgingService = inject(LodgingService);
  authService = inject(AuthService);

  top3Lodging = computed(() =>
  [...this.lodgingService.lodgingsSignal()]
    .sort((a, b) => b.rating - a.rating)   // mayor → menor
    .slice(0, 3)
);

}