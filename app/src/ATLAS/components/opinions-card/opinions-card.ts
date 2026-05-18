import {
  Component,
  Input
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-opinion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opinions-card.html',
  styleUrls: ['./opinions-card.css']
})
export class OpinionCardComponent {

  @Input() opinion: any;

  stars = [1, 2, 3, 4, 5];

  getUserInitial(): string {

    return this.opinion.userName
      ?.charAt(0)
      ?.toUpperCase() || '?';

  }

  formatDate(date: string): string {

    return new Date(date)
      .toLocaleDateString('es-ES');

  }

}