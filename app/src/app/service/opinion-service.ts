import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Opinion } from '../types/types';
import { UserService } from './user-service';

@Injectable({
  providedIn: 'root',
})
export class OpinionService {
  private httpClient : HttpClient = inject(HttpClient);
  private url = "http://localhost:3000/opiniones";

  private _allOpinions = signal<Opinion[]>([]);
  allOpinions = this._allOpinions.asReadonly();

  private _allOpinionsId = signal<Opinion[]>([]);
  allOpinionsId = this._allOpinionsId.asReadonly();

  constructor(){
    this.getAllOpinions();
  }

  getAllOpinions(){
    this.httpClient.get<Opinion[]>(this.url).subscribe({
      next: (data) => {
        this._allOpinions.set(data);
      }
    })
  }

  service = inject(UserService);

  getAllOpinionWithId(id: string): Opinion[] {
    const filtradas = this._allOpinions().filter(op => op.id_alojamiento.toString() === id);
    console.log('Opiniones filtradas para ID:', id, filtradas); 
    return filtradas;
  }
}
