import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

import 'leaflet-routing-machine';
import 'leaflet.geodesic';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements AfterViewInit {
  private map: L.Map;
  private departure_coord: L.Marker;
  private arrival_coord: L.Marker;
  private geodesic_path: L.Geodesic;
  private display_jet: boolean;
  private display_car: boolean;

  private initMap(): void {
    this.map = L.map('map', {
      zoom: 0,
    });

    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
      }
    );

    const iconDefault = icon({
      iconRetinaUrl:
        'https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon-2x.png',
      shadowUrl: '',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });

    Marker.prototype.options.icon = iconDefault;

    tiles.addTo(this.map);
  }

  public setDeparture(lat: number, lng: number): void {
    this.departure_coord = L.marker([lat, lng], { draggable: false }).addTo(
      this.map
    );
  }

  public setArrival(lat: number, lng: number): void {
    this.arrival_coord = L.marker([lat, lng], { draggable: false }).addTo(
      this.map
    );
  }

  public centerView(marker: L.Marker): void {
    this.map.setView(marker.getLatLng(), 5);
  }

  public displayJet(): void {
    this.geodesic_path = new L.Geodesic(
      [this.departure_coord.getLatLng(), this.arrival_coord.getLatLng()],
      {
        weight: 5,
        opacity: 0.5,
        color: 'red',
        steps: 4,
      }
    ).addTo(this.map);
    //alert('ok');
  }

  public displayCar(): void {
    L.Routing.control({
      waypoints: [
        this.departure_coord.getLatLng(),
        this.arrival_coord.getLatLng(),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
    }).addTo(this.map);

    document.getElementsByClassName('leaflet-top leaflet-right')[0].remove();
  }

  public toggleCheckbox(event: any) {
    if (event.target.checked) {
      // Si la checkbox est coché
      switch (event.target.id) {
        case 'voiture-checkbox':
          this.displayCar();
          this.display_car = true;
          break;
        case 'jet-checkbox':
          this.displayJet();
          this.display_jet = true;
          break;
      }
    } else {
      // Si la checkbox est décoché
      switch (event.target.id) {
        case 'voiture-checkbox':
          //this.hideCar();
          this.display_car = false;
          this.map.remove();
          this.initAll();
          if (this.display_jet) this.displayJet();
          break;
        case 'jet-checkbox':
          this.display_jet = false;
          this.map.remove();
          this.initAll();
          if (this.display_car) this.displayCar();
          break;
      }
    }
    // do something else based on the checkbox status
  }

  constructor() {}

  private initAll(): void {
    this.initMap();
    this.setDeparture(48.2, 2.3522); // Paris
    //this.setArrival(51.5074, -0.1278); // Londre
    this.setArrival(40.712784, -74.005941); // New York
    this.centerView(this.departure_coord);

    if (this.display_jet) this.displayJet();

    if (this.display_car) this.displayCar();
  }

  ngAfterViewInit(): void {
    this.display_car = false;
    this.display_jet = true;
    this.initAll();
    this.centerView(this.departure_coord);
    // this.displayJet();
    // this.displayCar();
  }
}
