import {
  Component,
  Input,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { OpinionService } from '../../service/opinion-service';

import { OpinionCardComponent } from '../opinions-card/opinions-card';

@Component({
  selector: 'app-opinions-section',
  standalone: true,
  imports: [
    CommonModule,
    OpinionCardComponent
  ],
  templateUrl: './opinions-section.html',
  styleUrls: ['./opinions-section.css']
})
export class OpinionsSection implements OnInit {

  @Input() lodgingId!: number;

  opinionService = inject(OpinionService);

  ngOnInit(): void {

    if (this.lodgingId != null) {

      this.opinionService.getByLodging(
        this.lodgingId
      );

    }

  }

  nextPage(): void {

    this.opinionService.nextPage(
      this.lodgingId
    );

  }

  prevPage(): void {

    this.opinionService.prevPage(
      this.lodgingId
    );

  }

}