import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import {
  PersonneService,
  Personne,
  Flight,
} from 'src/app/services/personne.service';

import 'leaflet-routing-machine';
import 'leaflet.geodesic';
import { GeodesicLine } from 'leaflet.geodesic';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent {
  [x: string]: any;

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) { }

  private map: L.Map;
  private Flight: (L.Routing.Control | GeodesicLine)[] = [];
  private departure_coord: L.Marker;
  private arrival_coord: L.Marker;
  private geodesic_path: L.Geodesic;
  private display_jet: boolean;
  private display_car: boolean;
  
  // Initialise la carte Leaflet en utilisant les tuiles OpenStreetMap.
  private initMap(): void {
    this.map = L.map('map', {
      minZoom: 0,
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

    let markerA: L.Marker = L.marker([departure_lat, departure_lng], {
      draggable: false,
    }).addTo(this.map);
    markerA.dragging?.disable();

    let markerB: L.Marker = L.marker([arrival_lat, arrival_lng], {
      draggable: false,
    }).addTo(this.map);
    markerB.dragging?.disable();

    markers.push(markerA);

    markers.push(markerB);

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

  // Ajouter un nouveau vol en utilisant les coordonnées de départ et d'arrivée
  private addFlight(
    departure_lat: number,
    departure_lng: number,
    arrival_lat: number,
    arrival_lng: number
  ): void {
    let marker;
    // Création d'un nouveau trajet à partir des coordonnées fournies
    marker = this.newPath(
      departure_lat,
      departure_lng,
      arrival_lat,
      arrival_lng
    );

    // Ajout d'un nouveau trajet en voiture à la liste des vols
    this.Flight.push(this.addCarPath(marker[0], marker[1]));
  }

  // Initialisation de tous les éléments
  private initAll(): void {
    // Initialisation de la carte
    this.initMap();

    // Ajout d'un nouveau vol avec des coordonnées spécifiques
    this.addFlight(48.2, 2.3522, 40.712784, -74.005941);
    // Affichage des trajets
    this.displayPaths(this.Flight);

    // Affichage des informations de vol dans la console
    this.Flight.forEach((flight) => {
      console.log(flight);
    });
  }

  // Initialisation de la carte avec les données d'une personne spécifique
  public async Initialize(id: number): Promise<void> {
    // Suppression de la carte si elle existe déjà
    if (this.map) this.map.remove();

    // Affichage des trajets en voiture et en jet
    this.display_car = true;
    this.display_jet = true;

    // Récupération des données de personnes
    var data = await this.personneService.getListePersonne();

    // Définition de l'interface Vol
    interface Vol {
      owner: string;
      departure: { date: string; lat: number; lon: number };
      arrival: { lat: number; lon: number };
    }

    let lesVols: Vol[] = [];
    // Parcours des données de personnes pour récupérer les informations de vol
    data.forEach((personne) => {
      personne.vols?.forEach((vol) => {
        let dep_lat = vol?.departure?.location.lat;
        let dep_lon = vol?.departure?.location.lon;
        let arr_lat = vol?.arrival?.location.lat;
        let arr_lon = vol?.arrival?.location.lon;

        // Création d'un objet Vol avec les informations récupérées
        let leVol: Vol = {
          owner: personne.prenom + ' ' + personne.nom,
          departure: {
            date: vol.departure.scheduledTimeUtc,
            lat: dep_lat,
            lon: dep_lon,
          },
          arrival: {
            lat: arr_lat,
            lon: arr_lon,
          },
        };

        // Ajout du vol à la liste des vols
        lesVols.push(leVol);
      });
    });

    console.log(lesVols);
    this.initMap();

    let Paths: (L.Routing.Control | GeodesicLine)[] = [];
    let Markers: L.Marker<any>[][] = [];

    let OWNER_Name = '';

    // Récupération du nom du propriétaire en fonction de l'ID fourni
    if (id != -1) {
      OWNER_Name =
        document.getElementsByTagName('select')[0].options[id].innerText;
      OWNER_Name = OWNER_Name.substring(1, OWNER_Name.length - 1);
    } else {
      OWNER_Name = 'Bill Gates';
    }

    // Filtrage des vols pour ne garder que ceux du propriétaire sélectionné
    let ownerFlight: Vol[];
    ownerFlight = lesVols.filter((vol) => vol.owner === OWNER_Name);

    // Création d'un nouveau trajet pour le premier vol du propriétaire sélectionné
    Markers.push(
      this.newPath(
        ownerFlight[0]['departure']['lat'],
        ownerFlight[0]['departure']['lon'],
        ownerFlight[0]['arrival']['lat'],
        ownerFlight[0]['arrival']['lon']
      )
    );

    // Parcours des vols du propriétaire sélectionné
    Markers.forEach((marker) => {
      Paths.push(this.addCarPath(marker[0], marker[1]));
      Paths.push(this.addJetPath(marker[0], marker[1]));
    });

    // Affichage des trajets
    this.displayPaths(Paths);
  }

  // Lorsque la page est chargée 
  async ngOnInit() {
    this.Initialize(-1);
  }

  // Lorsque l'utilisateur sélectionne un propriétaire dans la liste déroulante
  onSelected(value: number) {
    // Initialisation de la carte avec les données du propriétaire sélectionné
    this.Initialize(value);
  }
}
