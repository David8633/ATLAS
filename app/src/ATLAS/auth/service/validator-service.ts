import { Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class ValidatorService {

  public passIgual(campo1:string, campo2:string){
    return (formGroup :AbstractControl) => {
      const pass1 = formGroup.get(campo1)?.value;
      const pass2 = formGroup.get(campo2)?.value;

      if(pass1!==pass2){
        formGroup.get(campo2)?.setErrors({noEsIgual : true});
        return {noEsIgual : true};
      }

      if(formGroup.get(campo2)?.hasError('noEsIgual')){
        delete formGroup.get(campo2)?.errors?.['noEsIgual']; //lo que hace es eliminar ese erro si los dos contraseña son iguales.
        formGroup.get(campo2)?.updateValueAndValidity();
      }

      return null;
    }
  }

}
