import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { FavouriteType, LoadingType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class LoadgingService {
  
  private httpClient = inject(HttpClient);
  private _allLoading = signal<LoadingType[]>([]);
  allLoading = this._allLoading.asReadonly();  

  constructor(){
    this.cargarLoading();
  }

  cargarLoading(){
    this.httpClient.get<LoadingType[]>('http://localhost:3000/habitaciones').subscribe({
      next: (data) => {
        this._allLoading.set(data);
      }
    })
  }

}
