import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, ɵInternalFormsSharedModule, Validators } from '@angular/forms';
import { Router, RouterLink, Routes } from '@angular/router';
import { AuthService } from '../service/auth-service';


@Component({
  selector: 'app-login-component',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  private authService = inject(AuthService);
  private route = inject(Router);

  formBuilder = inject(FormBuilder);
  public myForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(2), Validators.max(20)], []],
    password: ['', [Validators.required, Validators.minLength(3), Validators.max(20)], []]
  })


  isInvalidField(field: string) {
    return this.myForm?.controls[field]?.errors && this.myForm?.controls[field]?.touched;
  }

  getError(field: string) {
    const errors = this.myForm?.controls[field]?.errors || {};

    for (const element of Object.keys(errors)) {
      switch (element) {
        case 'required':
          return 'Este campo es requerido';
        case 'minlength':
          return `Este campo debe tener al menos ${errors['minlength'].requiredLength} caracteres`;

        case 'max':
          return `Este campo debe tener como longitud ${errors['max'].requiredLength}`

      }
    }
    return null;
  }

  tryLogin() {
    if (this.myForm.invalid) {
      this.myForm.markAllAsTouched(); // Para que salten los errores visuales si le dan al botón sin escribir
      return;
    }


    this.authService.login(this.myForm.value).subscribe({
      next: (res) => {
        console.log('¡Conexión exitosa, Comandante!');
        this.authService.setSession(res.token);
        this.route.navigateByUrl('/dashboard/list');
      },
      error: (err) => {
        // Aquí manejas el fallo de la API (401, 500, etc.)
        console.error('Fallo en la matriz de acceso:', err);
        alert(err.error?.message || 'Credenciales incorrectas');
      }
    });
  }

}
