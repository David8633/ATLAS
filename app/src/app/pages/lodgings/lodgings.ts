import { Component, inject } from '@angular/core';
import { LoadgingService } from '../../service/loadging-service';
import { CardLodging } from "../../components/card-lodging/card-lodging";
import { FavoritesService } from '../../service/favorites-service';
import { RouterLink } from "@angular/router";
import { AlojamientoService } from '../../service/alojamiento-service';
import { AlojamientoType } from '../../types/types';

@Component({
  selector: 'app-lodgings',
  imports: [CardLodging, RouterLink],
  templateUrl: './lodgings.html',
  styleUrl: './lodgings.css',
})
export class Lodgings {

  favoriteService = inject(FavoritesService);

  allLoading = inject(LoadgingService);

  alojamientoService = inject(AlojamientoService);
  allAlojamiento = this.alojamientoService.getRandomAlojamiento(10);

  allFavorite = this.favoriteService.favsList;

  findByFavorite(id :string){
    return this.allFavorite().find(fav => fav.id == id) != null;
  }

  findById(id :string){
    return this.allLoading.allLoading().find(lod => lod.id == id);
  }

  togle(alojamiento : AlojamientoType){
    this.favoriteService.toggleFav(alojamiento);
  }
}
