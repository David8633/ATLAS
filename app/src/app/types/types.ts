import { ɵHttpInterceptingHandler } from "@angular/common/http";

export interface AlojamientoType {
  id: string;
  nombre: string;
  direccion: string;
  calificacion: number | number;
  descripcion: string;
  tipo: string;
  latitud: number;
  longitud: number;
  id_destino: number;
  favourites :boolean;
  opiniones ?: Opinion[];
}

export interface FavouriteType {
  id_favourite: number,
  nombre :string,
  calificacion :number,
  id_alojamiento: string
}

export interface Opinion {
  id: string;
  calificacion: number;
  comentarios: string;
  fecha_publicacion: string;
  id_usuario: number;
  id_alojamiento: number;
}

export interface UsuarioType {
  id: string;
  nombre: string;
  apellidos: string;
  email: string;
}


export interface LoadingType {
  id: string;
  tipo: string;
  capacidad: number;
  precio_noche: number | number;
  id_alojamiento: number;
}

