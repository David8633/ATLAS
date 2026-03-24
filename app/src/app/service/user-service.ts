import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Opinion, UsuarioType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private HttpClient : HttpClient = inject(HttpClient);
  private url = "http://localhost:3000/usuarios";

  private _opinionUserId = signal<UsuarioType>({
    id: "",
    nombre:"",
    apellidos:"",
    email:"",
  });
  opinionUserId = this._opinionUserId.asReadonly();

  getUsetWithId(id:number){
    return this.HttpClient.get<UsuarioType>(this.url+'/'+id).subscribe({
      next: (data) => {
        return this._opinionUserId.set(data);
      }
    })
  }
}
