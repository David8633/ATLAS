import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ValidatorService } from '../../auth/service/validator-service';
import { AuthService } from '../../auth/service/auth-service';

@Component({
  selector: 'app-account',
  imports: [ReactiveFormsModule],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {

  private fb = inject(FormBuilder);
  private validatorService = inject(ValidatorService);
  private autService = inject(AuthService);

  // FORM 1 — Cambiar Email
  changeEmailForm: FormGroup = this.fb.group({
    newEmail: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    ]],
    retryPassword: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    ]]
  }, {
    validators: [this.validatorService.passIgual('password', 'retryPassword')]
  });

  // FORM 2 — Cambiar Password
  changePasswordForm: FormGroup = this.fb.group({
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    password: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    ]],
    retryPassword: ['', [
      Validators.required,
      Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
    ]]
  }, {
    validators: [this.validatorService.passIgual('password', 'retryPassword')]
  });

  isInvalidField(form: 'email' | 'password', field: string) {
    const formGroup = form === 'email' ? this.changeEmailForm : this.changePasswordForm;
    return formGroup.controls[field]?.errors && formGroup.controls[field]?.touched;
  }

  getError(form: 'email' | 'password', field: string) {
    const formGroup = form === 'email' ? this.changeEmailForm : this.changePasswordForm;
    const errors = formGroup.controls[field]?.errors || {};

    for (const error of Object.keys(errors)) {
      switch (error) {
        case 'required':
          return 'Este campo es requerido';

        case 'email':
          return 'Debe ser un email válido';

        case 'minlength':
          return `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'pattern':
          return 'Debe contener letras y números';

        case 'noEsIgual':
          return 'Las contraseñas no coinciden';
      }
    }

    return null;
  }

  logedUser = this.autService.currentUser();

  logoutAccount(){
    this.autService.logout();
  }
}
