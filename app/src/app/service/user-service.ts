import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Opinion, UsuarioType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  
  private HttpClient : HttpClient = inject(HttpClient);
  private url = "http://localhost:3000/usuarios";

  private _allUser = signal<UsuarioType[]>([]);
  allUser = this._allUser.asReadonly();

  constructor(){
    
  }

  private _opinionUserId = signal<UsuarioType>({
    id: "",
    nombre:"",
    apellidos:"",
    email:"",
  });
  opinionUserId = this._opinionUserId.asReadonly();

  /**
   * Search user with id
   * @param id 
   * @returns user 
   */
  getUsetWithId(id:number){
    return this.HttpClient.get<UsuarioType>(this.url+'/'+id);
  }

  getAllUser(){
    this.HttpClient.get<UsuarioType[]>(this.url).subscribe({
      next: (users) => {
        this._allUser.set(users)
      }
    })
  }

  getUserIdNombre(id:string){
    this.getAllUser();
    return this._allUser()
      ?.find(u => u.id == id)
      ?.nombre ?? 'Desconocido';
  }

}
