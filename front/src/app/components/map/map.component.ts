// Import des modules nécessaires
import {Component, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {icon, Marker} from 'leaflet';
import {PersonneService} from 'src/app/services/personne.service';
import 'leaflet-routing-machine';
import 'leaflet.geodesic';
import {GeodesicLine} from 'leaflet.geodesic';

// Définition du composant Angular
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})

// Définition de la classe du composant
export class MapComponent implements OnInit {
  [x: string]: any;

// Déclaration des propriétés de la classe
  private map: L.Map;
  private display_jet: boolean;
  private display_car: boolean;

  constructor(
// Initialiser le PersonneService
private personneService: PersonneService
  ) {
  }

  // Créer un nouveau trajet en Jet à partir de deux marqueurs (départ et arrivée)
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

  // Créer un nouveau trajet en Voiture à partir de deux marqueurs (départ et arrivée)
  public addCarPath(
    departure_coord: L.Marker,
    arrival_coord: L.Marker
  ): L.Routing.Control {
    return L.Routing.control({
      waypoints: [departure_coord.getLatLng(), arrival_coord.getLatLng()],
      draggableWaypoints: false,
      addWaypoints: false,
    } as any);
  }

// a partir de coordonnées passé en paramètre
  public newPath(
    departure_lat: number,
    departure_lng: number,
    arrival_lat: number,
    arrival_lng: number
  ): L.Marker[] {
    let markers: L.Marker[] = [];

// Création d'un marker A à partir des coordonnées de départ
    let markerA: L.Marker = L.marker([departure_lat, departure_lng], {
      draggable: false,
    }).addTo(this.map);
    markerA.dragging?.disable();

// Création d'un marker B à partir des coordonnées d'arrivée
    let markerB: L.Marker = L.marker([arrival_lat, arrival_lng], {
      draggable: false,
    }).addTo(this.map);
    markerB.dragging?.disable();

// Ajout des deux markers au tableau de markers
    markers.push(markerA);
    markers.push(markerB);

// Retourne le tableau de markers
    return markers;
  }

// Créer un nouveau trajet sous forme de deux marker

  // Initialisation de la carte avec les données d'une personne spécifique
  public async Initialize(id: number): Promise<void> {
// Suppression de la carte si elle existe déjà
    if (this.map) this.map.remove();

// Affichage des trajets en voiture et en jet
    this.display_car = true;
    this.display_jet = true;

// Récupération des données de personnes
    let data = await this.personneService.getListePersonne();

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
    let Markers: L.Marker[][] = [];

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
    await this.Initialize(-1);
  }

  // Lorsque l'utilisateur sélectionne un propriétaire dans la liste déroulante
  async onSelected(value: number) {
    // Initialisation de la carte avec les données du propriétaire sélectionné
    await this.Initialize(value);
  }

// Initialise la carte Leaflet en utilisant les tuiles OpenStreetMap.
  private initMap(): void {
// Initialisation de la carte
    this.map = L.map('map', {
      minZoom: 0,
      scrollWheelZoom: false,
    });

    // Ajout des tuiles OpenStreetMap
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 18,
        minZoom: 3,
      }
    );

// Définition de l'icône par défaut pour les marqueurs
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

// Ajout des tuiles à la carte
    tiles.addTo(this.map);
  }

  // Affiche tout les trajet passé en paramètre
  private displayPaths(FlightArray: (L.Routing.Control | L.Geodesic)[]): void {
    FlightArray.forEach((Flight) => {
      if (Flight instanceof L.Routing.Control) {
// Affichage du trajet en voiture si la variable display_car est true
        if (this.display_car) {
          Flight.addTo(this.map);
        }
      } else if (Flight instanceof L.Geodesic) {
// Affichage du trajet en jet si la variable display_jet est true
        if (this.display_jet) {
          Flight.addTo(this.map);
        }
      }

      // Suppression de la boîte de dialogue pour les instructions de trajet
      if (Flight instanceof L.Routing.Control)
        if (document.getElementsByClassName('leaflet-top leaflet-right')[0])
          document
            .getElementsByClassName('leaflet-top leaflet-right')[0]
            .remove();
    });
  }


}
