// src/app/components/opinions-card/opinions-card.ts
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpinionType } from '../../types/types';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-opinion-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './opinions-card.html',
  styleUrls: ['./opinions-card.css']
})
export class OpinionCardComponent {
  @Input() opinion!: OpinionType;
  @Output() onEdit = new EventEmitter<OpinionType>();
  @Output() onDelete = new EventEmitter<number>();

  authService = inject(AuthService);

  stars = [1, 2, 3, 4, 5];

  get canEditOrDelete(): boolean {
    const user = this.authService.currentUser();
    return user?.role === 'ADMIN' || user?.email === this.opinion.userEmail;
  }

  getUserInitial(): string {
    return this.opinion.userName?.charAt(0)?.toUpperCase() || '?';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  canEditOrRemove(){
    return this.authService.currentUser()?.role == 'ADMIN' || this.authService.currentUser()?.id == this.opinion.userId;
  }

  edit() {
    this.onEdit.emit(this.opinion);
  }

  delete() {
    this.onDelete.emit(this.opinion.id);
  }
}