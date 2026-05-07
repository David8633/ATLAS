import { Component, computed, inject, signal } from '@angular/core';
import { LoadgingService } from '../../service/loadging-service';
import { CardLodging } from "../../components/card-lodging/card-lodging";
import { FavoritesService } from '../../service/favorites-service';
import { RouterLink } from "@angular/router";
import { AlojamientoService } from '../../service/alojamiento-service';
import { AlojamientoType } from '../../types/types';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-lodgings',
  standalone: true,
  imports: [CardLodging, RouterLink, FormsModule],
  templateUrl: './lodgings.html',
  styleUrl: './lodgings.css',
})
export class Lodgings {

  favoriteService = inject(FavoritesService);
  allLoading = inject(LoadgingService);
  alojamientoService = inject(AlojamientoService);

  allAlojamiento = this.alojamientoService.allAlojamiento;

  allFavorite = this.favoriteService.favsList;

  findByFavorite(id: string) {
    return this.allFavorite().some(fav => fav.id === id);
  }

  findById(id: string) {
    return this.allLoading.allLoading().find(lod => lod.id === id);
  }

  togle(alojamiento: AlojamientoType) {
    this.favoriteService.toggleFav(alojamiento);
  }

  // 🔥 Buscador reactivo
  searchTerm = signal("");

  allAlojamientoFiltered = computed(() => {
    const term = this.searchTerm().toLowerCase().trim();

    return this.allAlojamiento().filter(item =>
      item.nombre.toLowerCase().includes(term) )
  });

}
