import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LodgingService } from '../../service/lodging-service';
import { CardLodgingComponent } from '../../components/card-lodging/card-lodging';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardLodgingComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class Dashboard implements OnInit {
  lodgingService = inject(LodgingService);

  ngOnInit() {
    this.lodgingService.loadLodgingsPage(0,3);
  }
}