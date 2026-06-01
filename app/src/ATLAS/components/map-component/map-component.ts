import { Component, Input, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';

// Fix para los iconos de Leaflet
const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-component.html',
  styleUrls: ['./map-component.css']
})
export class MapComponent implements OnInit, AfterViewInit {
  @Input() latitude: number = 40.416775; // Madrid por defecto
  @Input() longitude: number = -3.703790;
  @Input() name: string = 'Ubicación';
  @Input() address: string = '';

  @ViewChild('mapElement') mapElement!: ElementRef;
  private map!: L.Map;
  private marker!: L.Marker;

  ngOnInit(): void { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Crear el mapa
    this.map = L.map(this.mapElement.nativeElement).setView([this.latitude, this.longitude], 15);

    // Añadir capa de OpenStreetMap
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
      minZoom: 3
    }).addTo(this.map);
    // Crear icono personalizado con Bootstrap Icons
    const customIcon = L.divIcon({
      html: '<i class="bi bi-pin-fill" style="font-size: 20px; color: #394557;"></i>',
      className: 'custom-pin-icon', 
      iconSize: [40, 40],
      iconAnchor: [20, 40]
    });

    // Añadir marcador
    const popupContent = `
      <div style="text-align: center;">
        <strong>${this.name}</strong><br>
        ${this.address ? `<small>${this.address}</small><br>` : ''}
        <small>📍 ${this.latitude.toFixed(4)}, ${this.longitude.toFixed(4)}</small>
      </div>
    `;

    this.marker = L.marker([this.latitude, this.longitude], { icon: customIcon })
      .addTo(this.map)
      .bindPopup(popupContent)
      .openPopup();

  }

  // Método para actualizar la ubicación si cambia
  updateLocation(lat: number, lng: number, name: string, address?: string): void {
    if (this.map) {
      this.map.setView([lat, lng], 15);
      if (this.marker) {
        this.marker.setLatLng([lat, lng]);
        const popupContent = `
          <div style="text-align: center;">
            <strong>${name}</strong><br>
            ${address ? `<small>${address}</small><br>` : ''}
            <small> ${lat.toFixed(4)}, ${lng.toFixed(4)}</small>
          </div>
        `;
        this.marker.bindPopup(popupContent);
      }
    }
  }
}