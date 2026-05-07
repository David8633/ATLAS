import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, ɵInternalFormsSharedModule, Validators } from '@angular/forms';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login-component',
  imports: [RouterLink, ɵInternalFormsSharedModule,ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {

  formBuilder  = inject(FormBuilder);
  public myForm: FormGroup = this.formBuilder.group({
    username: ['', [Validators.required,Validators.minLength(4),Validators.max(20)], []],
    password: ['',[Validators.required,Validators.minLength(8),Validators.max(20)], []]
  })


  isInvalidField(field :string){
    return this.myForm?.controls[field]?.errors &&  this.myForm?.controls[field]?.touched;
  }

  getError(field :string){
    const errors = this.myForm?.controls[field]?.errors || {};

    for (const element of Object.keys(errors)){
      switch (element) {
        case 'required' : 
          return 'Este campo es requerido';
        case 'minlength' :
          return `Este campo debe tener como longitud ${errors['minlength'].requiredLength}`
        case 'max' :
          return `Este campo debe tener como longitud ${errors['max'].requiredLength}`
          
      }
    }
    return null;
  }


  
}
