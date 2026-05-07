import { Component, inject, OnInit } from '@angular/core';
import { AlojamientoType } from '../../types/types';
import { CommonModule } from '@angular/common'; // Importante para el @for
import { FavoritesService } from '../../service/favorites-service';
import { RouterLink } from "@angular/router";
import Swal from 'sweetalert2';
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

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger"
    },
    buttonsStyling: false
  });

  swalWithBootstrapButtons.fire({
    title: "¿Eliminar de favoritos?",
    text: "Este viaje se quitará de tu lista",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true
  }).then((result) => {

    if (result.isConfirmed) {

      // 🔥 AHORA SÍ: solo se elimina si confirma
      this.serviceFavorites.removeFavorites(id);

      swalWithBootstrapButtons.fire({
        title: "Eliminado",
        text: "Se ha quitado de tus favoritos",
        icon: "success",
        timer: 1500,
        showConfirmButton: false
      });

    } else if (result.dismiss === Swal.DismissReason.cancel) {

      swalWithBootstrapButtons.fire({
        title: "Cancelado",
        text: "No se ha eliminado",
        icon: "error",
        timer: 1200,
        showConfirmButton: false
      });

    }

  });

 }}
