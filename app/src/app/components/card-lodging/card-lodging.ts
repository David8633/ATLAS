import { Component, computed, inject } from '@angular/core';
import { AlojamientoService } from '../../service/alojamiento-service';
import { Loading } from "../loading/loading";
import { RouterLink } from "@angular/router";
// CORRECCIÓN: Importa directamente de @angular/common
import { NgClass } from "@angular/common"; 
import { AlojamientoType } from '../../types/types';
import { FavoritesService } from '../../service/favorites-service';

@Component({
  selector: 'app-card-lodging',
  standalone: true,
  imports: [
    Loading, 
    RouterLink, 
    NgClass 
  ],
  templateUrl: './card-lodging.html',
  styleUrl: './card-lodging.css',
})
export class CardLodging {
  private serviceAlojamiento = inject(AlojamientoService);
  private serviceFavorites = inject(FavoritesService);

  allAlojamientos = computed(() => {
    return this.serviceAlojamiento.getRandomAlojamiento(6);
  });

  allAlojamientoFavs = this.serviceFavorites.favsList;

  togle(alojamiento : AlojamientoType){
    this.serviceFavorites.toggleFav(alojamiento);
  }

}