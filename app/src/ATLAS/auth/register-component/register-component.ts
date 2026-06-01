import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, MinLengthValidator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../service/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register-component',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  private authService = inject(AuthService);
  private router = inject(Router);


  fb: FormBuilder = new FormBuilder();
  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    lastname: ['', [Validators.required]],
    username: ["", [Validators.required, Validators.minLength(5)]],
    email: ["", [Validators.required, Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)]],
    password: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
    retryPassword: ["", [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]]
  });

  isInvalidField(field: string) {
    return this.myForm?.controls[field]?.invalid &&
      this.myForm?.controls[field]?.touched;
  }

  getErrorField(field: string) {
    if (!this.myForm.controls[field]) return null;
    const errors = this.myForm.controls[field].errors || {};

    // Mensajes personalizados por campo
    const customMessages: any = {
      email: {
        pattern: 'Introduce un correo válido (ejemplo: usuario@correo.com).'
      },
      password: {
        pattern: 'La contraseña debe tener al menos 6 caracteres, incluir letras y números.'
      },
      retryPassword: {
        pattern: 'La confirmación debe cumplir el mismo formato que la contraseña.'
      },
      username: {
        minlength: 'El usuario debe tener al menos 5 caracteres.'
      },
      name: {
        minlength: 'El nombre debe tener al menos 5 caracteres.'
      }
    };

    for (const errorKey of Object.keys(errors)) {
      switch (errorKey) {
        case 'required':
          return 'Este campo es obligatorio';

        case 'minlength':
          return customMessages[field]?.minlength ||
            `Debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'pattern':
          return customMessages[field]?.pattern ||
            `El formato del campo ${field} no es válido.`;
      }
    }

    return null;
  }


  private trimFormValues() {
    const rawValues = this.myForm.value;

    Object.keys(rawValues).forEach(key => {
      const value = rawValues[key];
      if (typeof value === 'string') {
        this.myForm.get(key)?.setValue(value.trim());
      }
    });
  }

  register() {
    this.trimFormValues();
    this.authService.register(this.myForm.value).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Registro completado',
          text: 'Tu cuenta ha sido creada correctamente.',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigateByUrl("/auth/login");
      },
      error: (error) => {

        console.log(error);

        const backendMessage =
          error?.error?.messages ||
          error?.error ||
          'No se pudo completar el registro.';

        Swal.fire({
          icon: 'error',
          title: 'Error en el registro',
          text: backendMessage,
          confirmButtonColor: '#d33'
        });
      }
    });
  }
}
