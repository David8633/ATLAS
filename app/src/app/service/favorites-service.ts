import { Injectable, signal } from '@angular/core';
import { AlojamientoType } from '../types/types';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private _favsList = signal<AlojamientoType[]>(JSON.parse(localStorage.getItem("favorite") || '[]'));

  get favsList() {
    return this._favsList;
  }

  addFavourites(alojamiento: AlojamientoType) {
    const actuales = this._favsList(); // Obtenemos el valor actual
    const existe = actuales.some(item => item.id === alojamiento.id);

    if (!existe) {
      // Para añadir, creamos un nuevo array con el nuevo elemento
      this._favsList.update(favs => [...favs, alojamiento]);
      console.log("Guardado en LocalStorage");
    } else {
      // Si ya existe, filtramos y usamos .set() o .update()
      const filtrados = actuales.filter(item => item.id !== alojamiento.id);
      this._favsList.set(filtrados); // Aquí está la corrección
      console.log("Eliminado de LocalStorage");
    }

    // Guardamos el VALOR de la señal, no la señal entera
    localStorage.setItem("favorite", JSON.stringify(this._favsList()));
  }



  toggleFav(alojamientoFav: AlojamientoType) {
    alojamientoFav.favourites = !alojamientoFav.favourites;
    if (alojamientoFav.favourites) {
      this.addFavourites(alojamientoFav);
    } else {
      this.removeFavorites(alojamientoFav.id);
    }
  }

  removeFavorites(id: string) {
    // CORRECCIÓN: Usar .update() para filtrar
    this._favsList.update(favs => favs.filter(item => item.id != id));

    // Guardar en LocalStorage llamando a la señal con ()
    localStorage.setItem('favorite', JSON.stringify(this._favsList()));
  }
}
