import { Lodgings } from '../pages/lodgings/lodgings';
// ===============================
// Alojamiento (Lodging)
// ===============================
export interface LodgingsType {
  id: number;
  name: string;
  address: string;
  description: string;
  type: string;
  capacity: number;
  pricePerNight: number;
  rating: number;
  latitude: number;
  longitude: number;
  destinationName: string;
  active: boolean;
}

export type LodgingsTypeSinId = Omit<LodgingsType,'id'>;
// ===============================
// Destino (Destination)
// ===============================
export interface DestinationType {
  id: number;
  countryName: string;
  cityName: string;
  description: string;
  latitude: number;
  longitude: number;
}

// ===============================
// Reserva (Booking)
// ===============================
export interface BookingType {
  id: number;
  totalPrice: number;
  status: string;
  bookingDate: string;
  checkinDate: string;
  checkoutDate: string;
  lodgingName: string;
  lodgingAddress: string;
  destinationName: string;
  nights: number;
  paymentDate: string;
  paymentMethod: string;
  isPaid: boolean;
  lodgingId:number;
  UserId:number;
}

export interface BookingRequest {
  lodgingId: number;
  checkinDate: string;
  checkoutDate: string;
  paymentMethod: string;
}

// ===============================
// Opinión (Opinion)
// ===============================
export interface OpinionType {
  id: number;
  rating: number;
  comments: string;
  publicationDate: string;
  userId: number;
  lodgingId: number;
  userName: string;
  lodgingName: string;
}

export interface OpinionRequest {
  rating: number;
  comments: string;
  lodgingId: number;
}

// ===============================
// Usuario (User)
// ===============================
// types.ts
export interface UserType {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  username: string;
}

// src/app/types/types.ts
export interface OpinionRequest {
    rating: number;
    comments: string;
    lodgingId: number;
}

export interface OpinionType {
    id: number;
    rating: number;
    comments: string;
    userName: string;
    userEmail: string;
    lodgingId: number;
    createdAt: string;
    updatedAt?: string;
}

export interface PageResponse<T> {
    content: T[];
    pageable: {
        pageNumber: number;
        pageSize: number;
        sort: {
            sorted: boolean;
            unsorted: boolean;
            empty: boolean;
        };
        offset: number;
        paged: boolean;
        unpaged: boolean;
    };
    last: boolean;
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    sort: {
        sorted: boolean;
        unsorted: boolean;
        empty: boolean;
    };
    first: boolean;
    numberOfElements: number;
    empty: boolean;
}

// ===============================
// Destino
// ===============================
export interface DestinationType {
  id: number;
  countryName: string;
  cityName: string;
  description: string;
  latitude: number;
  longitude: number;
  lodgingCount?: number;
}

// ===============================
// Login
// =============================
export interface LoginRequest {
  email: string;
  password: string;
}


// ===============================
// Register
// =============================
export interface RegisterRequest {
  name: string;
  lastname: string;
  email: string;
  password: string;
  username: string;
}



// ===============================
// Respuesta de Autenticado
// =============================
export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}
