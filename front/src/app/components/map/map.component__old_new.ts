import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { PersonneService, Personne } from 'src/app/services/personne.service';

import 'leaflet-routing-machine';
import 'leaflet.geodesic';
import { GeodesicLine } from 'leaflet.geodesic';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class MapComponent implements OnInit {
  listePersonne: Personne[] = this.personneService.getListePersonne();

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  private map: L.Map;
  private Flight: (L.Routing.Control | GeodesicLine)[] = [];
  private departure_coord: L.Marker;
  private arrival_coord: L.Marker;
  private geodesic_path: L.Geodesic;
  private display_jet: boolean;
  private display_car: boolean;

  private initMap(): void {
    this.map = L.map('map', {
      zoom: 0,
      scrollWheelZoom: false,
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

  // Centre la vu de la carte sur un marker TODO a revoir pour utiliser peut-être des coordonnées
  public centerView(marker: L.Marker): void {
    this.map.setView(marker.getLatLng(), 5);
  }

  // Créer un nouveau trajet en Jet a partir de deux marker (départ et arrivée)
  public addJetPath(
    departure_coord: L.Marker,
    arrival_coord: L.Marker
  ): L.Geodesic {
    return new L.Geodesic(
      [departure_coord.getLatLng(), arrival_coord.getLatLng()],
      {
        weight: 5,
        opacity: 0.5,
        color: 'red',
        steps: 4,
      }
    );
  }

  // Créer un nouveau trajet en Voiture a partir de deux marker (départ et arrivée)
  public addCarPath(
    departure_coord: L.Marker,
    arrival_coord: L.Marker
  ): L.Routing.Control {
    return L.Routing.control({
      waypoints: [departure_coord.getLatLng(), arrival_coord.getLatLng()],
      routeWhileDragging: false,
      addWaypoints: false,
    });
  }

  // Méthode appelé quand une checkbox change d'état
  public toggleCheckbox(event: any) {
    if (event.target.checked) {
      // Si la checkbox est coché
      switch (event.target.id) {
        case 'voiture-checkbox':
          this.display_car = true;
          break;
        case 'jet-checkbox':
          this.display_jet = true;
          break;
      }
    } else {
      // Si la checkbox est décoché
      switch (event.target.id) {
        case 'voiture-checkbox':
          this.display_car = false;
          break;
        case 'jet-checkbox':
          this.display_jet = false;
          break;
      }
    }

    this.initAll();
    // do something else based on the checkbox status
  }

  // Créer un nouveau trajet sous forme de deux marker
  // a partir de coordonnées passé en paramètre
  public newPath(
    departure_lat: number,
    departure_lng: number,
    arrival_lat: number,
    arrival_lng: number
  ): L.Marker[] {
    let markers: L.Marker[] = [];

    markers.push(
      L.marker([departure_lat, departure_lng], { draggable: false }).addTo(
        this.map
      )
    );

    markers.push(
      L.marker([arrival_lat, arrival_lng], { draggable: false }).addTo(this.map)
    );

    return markers;
  }

  // Affiche tout les trajet passé en paramètre
  private displayPaths(FlightArray: (L.Routing.Control | L.Geodesic)[]): void {
    FlightArray.forEach((Flight) => {
      if (Flight instanceof L.Routing.Control) {
        if (this.display_car) {
          Flight.addTo(this.map);
        }
      } else if (Flight instanceof L.Geodesic) {
        if (this.display_jet) {
          Flight.addTo(this.map);
        }
      }

      if (Flight instanceof L.Routing.Control)
        if (document.getElementsByClassName('leaflet-top leaflet-right')[0])
          document
            .getElementsByClassName('leaflet-top leaflet-right')[0]
            .remove();
    });
  }

  private addFlight(
    departure_lat: number,
    departure_lng: number,
    arrival_lat: number,
    arrival_lng: number
  ): void {
    let marker;
    marker = this.newPath(
      departure_lat,
      departure_lng,
      arrival_lat,
      arrival_lng
    );

    this.Flight.push(this.addCarPath(marker[0], marker[1]));
  }

  private setSelector(): void {
    let selector = document.getElementById('selector');
    let select = document.createElement('select');
  }

  private initAll(): void {
    this.initMap();
    this.displayPaths(this.Flight);
    // let Markers = [];

    // Markers.push(this.newPath(48.2, 2.3522, 40.712784, -74.005941));
    // Markers.push(this.newPath(42.2, 1.3522, 40.712784, -34.005941));

    // this.map.eachLayer((layer) => {
    //   console.log(layer);
    // });

    this.Flight.forEach((flight) => {
      console.log(flight);
    });
  }

  async ngOnInit() {
    this.display_car = true;
    this.display_jet = true;
    
    // var data = await this.personneService.test().then((personne) => {
      
    

    
    // this.listePersonne.forEach((personne) => {
    //   personne.vols?.forEach((vol) => {
    //     this.addFlight(
    //       vol.departure.location.lat,
    //       vol.departure.location.lon,
    //       vol.arrival.location.lat,  
    //       vol.arrival.location.lon
    //     );

    //     console.log(vol.departure.location.lat+";"+
    //       vol.departure.location.lon+"  "+
    //       vol.arrival.location.lat+";"+
    //       vol.arrival.location.lon
    //     );
    //   });
    // });

    this.initAll();
  }

}
