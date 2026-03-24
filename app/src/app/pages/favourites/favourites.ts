import { Component, inject, OnInit } from '@angular/core';
import { AlojamientoType } from '../../types/types';
import { CommonModule } from '@angular/common'; // Importante para el @for
import { FavoritesService } from '../../service/favorites-service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-favorites',
  standalone: true, // Si usas Angular moderno
  imports: [CommonModule, RouterLink],
  templateUrl: './favourites.html',
  styleUrl: './favourites.css',
})
export class Favourites {

  serviceFavorites = inject(FavoritesService)
  allFavourites = this.serviceFavorites.favsList;

  remove(id: string) {
    this.serviceFavorites.removeFavorites(id);
  }
}