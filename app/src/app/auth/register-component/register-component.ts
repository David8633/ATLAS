import { Component } from '@angular/core';
import { Account } from "../../pages/account/account";
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register-component',
  imports: [RouterLink,ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {

  fb :FormBuilder = new FormBuilder();
  myForm :FormGroup = this.fb.group({
    name: ['',[Validators.required],[]],
    username : ["",[Validators.required,Validators.pattern(/^[A-Za-z]{3,}[0-9]*$/)],[]],
    email : ["",[Validators.required,Validators.pattern(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/)],[]],
    password: ["",[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]],
    retryPassword:  ["",[Validators.required,Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)]]
  })

  isInvalidField(field :string){
    return this.myForm?.controls[field]?.invalid &&
          this.myForm?.controls[field]?.touched;
  }


  getErrorField(field :string){
    if(!this.myForm.controls[field]) return null;
    const errros = this.myForm.controls[field].errors || {}; 

    for (const element of Object.keys(errros)) {
      switch (element) {
        case 'required' : 
          return 'Este campo debe ser requerido';
        case 'pattern' :
          return `El campo ${field} no tiene el formato correcto.`;
      }
    }
  return null;}

}
