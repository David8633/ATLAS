import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DestinationType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class DestinationService {
  
  private httpClient = inject(HttpClient);
  private _allDestinations = signal<DestinationType[]>([]);
  allDestination = this._allDestinations.asReadonly();
  
  constructor(){
    this.getAllDestinations();
  }

  getAllDestinations(){
    this.httpClient.get<DestinationType[]>("http://localhost:3000/destinos").subscribe({
      next: (destinations) => {
        this._allDestinations.set(destinations);
      }
    }
      
    )
  }

  getRandomDestinations(countNumber: number): DestinationType[] {
    const all = this._allDestinations();

    if (!all || all.length === 0) {
      return [];
    }

    return [...all]
      .sort(() => Math.random() - 0.5)
      .slice(0, countNumber);
  }  
}
