// src/app/components/opinion-form/opinion-form.ts
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OpinionService } from '../../service/opinion-service';
import { OpinionRequest } from '../../types/types';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-opinion-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './opinion-form.html',
  styleUrls: ['./opinion-form.css']
})
export class OpinionForm {
  @Input() lodgingId!: number;
  @Input() editingOpinion: any = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSuccess = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private opinionService = inject(OpinionService);

  stars = [1, 2, 3, 4, 5];
  isSubmitting = false;

  opinionForm: FormGroup = this.fb.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comments: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]]
  });

  ngOnInit() {
    if (this.editingOpinion) {
      this.opinionForm.patchValue({
        rating: this.editingOpinion.rating,
        comments: this.editingOpinion.comments
      });
    }
  }

  setRating(rating: number) {
    this.opinionForm.patchValue({ rating });
  }

  onSubmit() {
  if (this.opinionForm.invalid || this.isSubmitting) return;

  this.isSubmitting = true;

  const opinionRequest: OpinionRequest = {
    rating: this.opinionForm.value.rating,
    comments: this.opinionForm.value.comments,
    lodgingId: this.lodgingId
  };

  const request = this.editingOpinion
    ? this.opinionService.edit(this.editingOpinion.id, opinionRequest)
    : this.opinionService.create(opinionRequest);

  request.subscribe({
    next: () => {
      this.isSubmitting = false;

      Swal.fire({
        icon: 'success',
        title: this.editingOpinion ? 'Opinión actualizada' : 'Opinión publicada',
        text: this.editingOpinion
          ? 'Tu opinión ha sido modificada correctamente.'
          : 'Tu opinión ha sido publicada correctamente.',
        timer: 1800,
        showConfirmButton: false
      });

      this.onSuccess.emit();
      this.onClose.emit();

      this.opinionForm.reset({ rating: 5, comments: '' });

      this.opinionService.getByLodging(this.lodgingId, 0);
    },
    error: (error) => {
      this.isSubmitting = false;

      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo guardar la opinión. Inténtalo de nuevo.',
        confirmButtonColor: '#dc2626'
      });
    }
  });
}

}