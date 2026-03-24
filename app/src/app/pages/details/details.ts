import { Component, inject, Input, OnInit, AfterViewInit, OnDestroy, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para @if y @for
import { HttpClient } from '@angular/common/http';
import { AlojamientoService } from '../../service/alojamiento-service';
import { OpinionService } from '../../service/opinion-service';
import { AlojamientoType } from '../../types/types';
import * as L from 'leaflet';
import { UserService } from '../../service/user-service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.html',
  styleUrl: './details.css',
})
export class Details implements OnInit, AfterViewInit, OnDestroy {
  @Input() id!: string;

  private serviceAlojamiento = inject(AlojamientoService);
  private serviceOpinion = inject(OpinionService);
  private http = inject(HttpClient);

  detailsId?: AlojamientoType;
  private map?: L.Map;

  // Creamos una señal computada: 
  // Cada vez que 'allOpinions' en el servicio cambie, esto se recalcula solo
  allOpinionsId = computed(() => {
    return this.serviceOpinion.allOpinions().filter(op => op.id_alojamiento.toString() == this.id);
  });

  ngOnInit(): void {
    if (this.id) {
      this.detailsId = this.serviceAlojamiento.findById(this.id);
    }

  }

  ngAfterViewInit(): void {
    if (this.detailsId?.direccion) {
      // Un pequeño delay asegura que el div #map esté listo en el DOM
      setTimeout(() => this.buscarCoordenadas(this.detailsId!.direccion), 0);
    }
  }

  ngOnDestroy(): void {
    if (this.map) {
      this.map.remove();
    }
  }

  private buscarCoordenadas(direccion: string) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}&limit=1`;
    this.http.get<any[]>(url).subscribe(res => {
      if (res.length > 0) {
        this.cargarMapa(parseFloat(res[0].lat), parseFloat(res[0].lon));
      }
    });
  }

 private cargarMapa(lat: number, lon: number) {
    if (this.map) {
      this.map.remove();
    }

    // Configuración base del mapa
    this.map = L.map('map', {
      scrollWheelZoom: false // Mejora UX: evita que el scroll de página se trabe en el mapa
    }).setView([lat, lon], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // --- MARCADOR PERSONALIZADO SIN ICONO DE IMAGEN ---
    const customIcon = L.divIcon({
      html: '', // Contenedor HTML vacío para el icono
      className: 'custom-div-icon', // Importante: definir en CSS para quitar estilos por defecto
      iconSize: [20, 20], // Ajusta el tamaño según sea necesario
      iconAnchor: [10, 20], // Ajusta el anclaje según el tamaño del icono
    });

    L.marker([lat, lon], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(`<b>${this.detailsId?.nombre}</b><br>${this.detailsId?.direccion}`)
      .openPopup();
  }

  private serviceUser = inject(UserService);

  getNameWithOpinionId(id:number) :string{
    this.serviceUser.getUsetWithId(id);
    return this.serviceUser.opinionUserId().nombre;
  }
}