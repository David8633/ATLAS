// src/app/components/opinions-section/opinions-section.ts
import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpinionService } from '../../service/opinion-service';
import { OpinionCardComponent } from '../opinions-card/opinions-card';
import { OpinionForm } from '../opinion-form/opinion-form';
import { OpinionType } from '../../types/types';
import { AuthService } from '../../auth/service/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opinions-section',
  standalone: true,
  imports: [CommonModule, OpinionCardComponent, OpinionForm],
  templateUrl: './opinions-section.html',
  styleUrls: ['./opinions-section.css']
})
export class OpinionsSection implements OnInit {
  @Input() lodgingId!: number;

  opinionService = inject(OpinionService);
  authService = inject(AuthService);

  showForm = false;
  editingOpinion: OpinionType | null = null;

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  get canCreateOpinion(): boolean {
    return this.isAuthenticated;
  }

  // Añade esto a tu OpinionsSection component
  goToPage(page: number) {
    if (page !== this.opinionService.currentPage()) {
      this.opinionService.getByLodging(this.lodgingId, page);
    }
  }

  ngOnInit(): void {
    if (this.lodgingId != null) {
      this.opinionService.getByLodging(this.lodgingId);
    }
  }

  nextPage(): void {
    this.opinionService.nextPage(this.lodgingId);
  }

  prevPage(): void {
    this.opinionService.prevPage(this.lodgingId);
  }

  openCreateForm() {
    this.editingOpinion = null;
    this.showForm = true;
  }

  openEditForm(opinion: OpinionType) {
    this.editingOpinion = opinion;
    this.showForm = true;
  }

  closeForm() {
    this.showForm = false;
    this.editingOpinion = null;
  }

  onDeleteOpinion(id: number) {
  Swal.fire({
    title: '¿Eliminar opinión?',
    text: 'Esta acción no se puede deshacer.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {

      this.opinionService.delete(id).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Opinión eliminada',
            text: 'La opinión ha sido eliminada correctamente.',
            timer: 1800,
            showConfirmButton: false
          });

          this.opinionService.getByLodging(this.lodgingId, 0);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la opinión.',
            confirmButtonColor: '#dc2626'
          });
        }
      });

    }
  });
}


  onFormSuccess() {
    this.closeForm();
  }
}