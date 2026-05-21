import { Component, EventEmitter, Input, Output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { LodgingsType } from '../../types/types';
import { AuthService } from '../../auth/service/auth-service';
import { Loading } from "../loading/loading";
import { LodgingService } from '../../service/lodging-service';
import { AdminService } from '../../service/admin-service';

@Component({
  selector: 'app-card-lodging',
  standalone: true,
  imports: [CommonModule, RouterLink, Loading],
  templateUrl: './card-lodging.html',
  styleUrls: ['./card-lodging.css']
})
export class CardLodgingComponent {

  @Output() edit = new EventEmitter<any>();
  @Output() delete = new EventEmitter<any>();
  
  lodgingService = inject(LodgingService);
  authService = inject(AuthService);

  top3Lodging = computed(() =>
  [...this.lodgingService.lodgingsSignal()]
    .sort((a, b) => b.rating - a.rating) 
    .slice(0, 3)
  );

 

   onEditClick(lodging : LodgingsType) {
    this.edit.emit(lodging);
  }

  onDeleteClick(lodging : LodgingsType) {
    this.delete.emit(lodging);
  }

}