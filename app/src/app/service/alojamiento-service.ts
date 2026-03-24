import { inject, Injectable, signal } from '@angular/core';
import { AlojamientoType, FavouriteType } from '../types/types';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlojamientoService {

  private urlAlojamiento = "http://localhost:3000/alojamientos";
  private httpClient = inject(HttpClient);

  private _allAlojamiento = signal<AlojamientoType[]>([]);
  allAlojamiento = this._allAlojamiento.asReadonly();

  private idFavCounter = 0;

  constructor() {
    this.getAllAlojamiento();
  }

  getAllAlojamiento() {
    this.httpClient.get<AlojamientoType[]>(this.urlAlojamiento).subscribe({
      next: (alojamientos) => {
        this._allAlojamiento.set(alojamientos);
      }
    })
  }


  getRandomAlojamiento(countNumber: number): AlojamientoType[] {
    const allAlojamientos = this._allAlojamiento;

    if (allAlojamientos() == null) { return []; }

    return [...allAlojamientos()]
      .sort(() => Math.random() - 0.5)
      .slice(0, countNumber);
  }

  findById(id: string): AlojamientoType {
    const allAlojamientos = this._allAlojamiento;
    return allAlojamientos().filter(alojamiento => alojamiento.id == id)[0];
  }

}
