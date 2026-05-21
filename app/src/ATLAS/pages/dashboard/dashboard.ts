import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LodgingService } from '../../service/lodging-service';
import { CardLodgingComponent } from '../../components/card-lodging/card-lodging';
import { AdminService } from '../../service/admin-service';
import { LodgingsType } from '../../types/types';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardLodgingComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  lodgingService = inject(LodgingService);

  private adminService = inject(AdminService);
  private router = inject(Router);


  ngOnInit() {
    this.lodgingService.loadLodgingsPage(0,3);
  }

  onDelete(lodging : LodgingsType){
    this.adminService.deleteLodging(lodging.id)
  }

  onEdit(lodging : LodgingsType){
    this.router.navigateByUrl("/details/"+lodging.id);
  }

}