// import { Component } from '@angular/core';
// import * as L from '@asymmetrik/ngx-leaflet';
// @Component({
//   selector: 'app-map',
//   templateUrl: './map.component.html',
//   styleUrls: ['./map.component.css']
// })
// export class MapComponent {
//   var map = L.map( 'map' /* the id of the tag used for map injection */ );
//     map.setView( [43.7991 /*latitude*/, 6.72545 /*longitude*/], 12 /*zoom*/ );

//     // --- We add a layer based on OpenStreetMap ---
//     L.tileLayer( 'http://tile.openstreetmap.org/{z}/{x}/{y}.png' ).addTo(map);   // Base Map

//     // --- We add a circle to the map ---
//     var circle = L.circle( [ 43.7991, 6.72545 ] , {
//         color: 'red',
//         fillColor: '#f03',
//         fillOpacity: 0.5,
//         radius: 200
//     }).addTo(map);

//     // --- We add a polygon to the map ---
//     var polygon = L.polygon([
//         [ 43.7949098,6.7109003 ],
//         [ 43.773007,6.7012349 ],
//         [ 43.7779801,6.7306691 ]
//     ]).addTo(map);

//     // --- We add a marker, with events, to the map ---
//     var marker = L.marker( [ 43.7991, 6.72545 ] )
//                   .bindPopup( "Infini Software" )
//                   .addTo( map );

//     // --- We add a new layer to the map that contains some markers ---
//     var seranon = L.marker( [ 43.773007,6.7012349 ] )
//                    .bindPopup( 'Village de Seranon' ),
//     caille      = L.marker( [ 43.7779801,6.7306691 ] )
//                    .bindPopup( 'Village de Caille' ),
//     valderoure  = L.marker( [ 43.7949098,6.7109003 ] )
//                    .bindPopup( 'Village de Valderoure' ),
//     laFerriere  = L.marker( [ 43.7990248,6.7306592 ] )
//                    .bindPopup( 'Village de La Ferriere' );

//     L.layerGroup([seranon, caille, valderoure, laFerriere])
//      .addTo( map );
// }

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
      iconUrl: '',
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
  }

  ngAfterViewInit(): void {
    this.display_car = false;
    this.display_jet = false;
    this.initAll();
    this.centerView(this.departure_coord);
    // this.displayJet();
    // this.displayCar();
  }
}
