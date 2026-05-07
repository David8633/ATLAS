import { Component, computed, inject } from '@angular/core';
import { AlojamientoService } from '../../service/alojamiento-service';
import { Loading } from "../loading/loading";
import { RouterLink } from "@angular/router";
// CORRECCIÓN: Importa directamente de @angular/common
import { NgClass } from "@angular/common";
import { AlojamientoType } from '../../types/types';
import { FavoritesService } from '../../service/favorites-service';
import Swal from 'sweetalert2';

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

 togle(alojamiento: AlojamientoType) {
  const status = this.serviceFavorites.toggleFav(alojamiento);

  if (status) {
    Swal.fire({
      icon: 'success',
      title: 'Añadido a favoritos',
      text: `${alojamiento.nombre} se ha guardado en tus favoritos`,
      timer: 1500,
      showConfirmButton: false
    });
  } else {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: "¿Eliminar de favoritos?",
      text: "Este viaje ya no aparecerá en tu lista",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        swalWithBootstrapButtons.fire({
          title: "Eliminado",
          text: "Se ha quitado de tus favoritos",
          icon: "success",
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  }
}


}