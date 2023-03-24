import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';
import { PersonneService, Personne, Flight } from 'src/app/services/personne.service';

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

    let markerA: L.Marker = L.marker([departure_lat, departure_lng], { draggable: false }).addTo(
      this.map
    )
    markerA.dragging?.disable();


    let markerB: L.Marker = L.marker([arrival_lat, arrival_lng], { draggable: false }).addTo(this.map)
    markerB.dragging?.disable();


    markers.push(
      markerA
    );

    markers.push(
      markerB
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

    this.addFlight(48.2, 2.3522, 40.712784, -74.005941);
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

  public async Initialize(id: number): Promise<void> {
    if (this.map)
      this.map.remove();

    this.display_car = true;
    this.display_jet = true;

    var data = await this.personneService.getListePersonne();

    interface Vol {
      owner: string;
      departure: { date: string; lat: number; lon: number };
      arrival: { lat: number; lon: number };
    }


    let lesVols: Vol[] = [];
    data.forEach((personne) => {
      personne.vols?.forEach((vol) => {

        let dep_lat = vol?.departure?.location.lat;
        let dep_lon = vol?.departure?.location.lon;
        let arr_lat = vol?.arrival?.location.lat;
        let arr_lon = vol?.arrival?.location.lon

        console.log("Departure : " + dep_lat + ";" + dep_lon);
        console.log("Arrival : " + arr_lat + ";" + arr_lon);
        
        let leVol: Vol = {
          owner: personne.prenom + " " + personne.nom,
          departure: {
            date : vol.departure.scheduledTimeUtc,
            lat: dep_lat,
            lon: dep_lon
          },
          arrival: {
            lat: arr_lat,
            lon: arr_lon
          }
        }

    
        // leVol.push(dep_lat, dep_lon, arr_lat, arr_lon);
        lesVols.push(leVol);

        // this.addFlight(
        //         dep_lat,
        //         dep_lon,
        //         arr_lat,
        //         arr_lon
        //       );

        // console.log(vol.departure.location.lat+";"+
        //   vol.departure.location.lon+"  "+
        //   vol.arrival.location.lat+";"+
        //   vol.arrival.location.lon
        // );

        //console.log(typeof vol.departure.location.lat);
      })
    });

    console.log(lesVols);
    this.initMap();

    let Paths: (L.Routing.Control | GeodesicLine)[] = [];
    let Markers: L.Marker<any>[][] = [];

    // lesVols.forEach(vol => {

    //   //Markers.push(this.newPath(vol[0],vol[1],vol[2],vol[3]))
    //   //console.log(vol[0],vol[1],vol[2],vol[3]);
    // })

    let OWNER_Name = document.getElementsByTagName('select')[0].options[id].innerText;
    OWNER_Name = OWNER_Name.substring(1, OWNER_Name.length - 1);

    let ownerFlight: Vol[]
    ownerFlight = lesVols.filter((vol) => vol.owner === OWNER_Name)
    


    //Markers.push(this.newPath(lesVols[OWNER_ID][0], lesVols[OWNER_ID][1], lesVols[OWNER_ID][2], lesVols[OWNER_ID][3]));
    console.log("lesVols de _"+OWNER_Name+"_ : ");
    console.log(lesVols.filter((vol) => vol.owner === OWNER_Name)[0]);


    console.log("ownerFlight : ");
    console.log(ownerFlight.sort((a, b) => {
      if (a.departure.date < b.departure.date) {
          return -1;
      }
      if (a.departure.date > b.departure.date) {
          return 1;
      }
      return 0;
  }));
    
    // Markers.push(this.newPath(42.2, 1.3522, 40.712784, -34.005941));

    Markers.forEach((marker) => {
      Paths.push(this.addCarPath(marker[0], marker[1]));
      Paths.push(this.addJetPath(marker[0], marker[1]));
    });

    this.displayPaths(Paths);
  }

  async ngOnInit() {

    this.Initialize(0);


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

    // this.initAll();

    // document.getElementsByTagName("select")[0].addEventListener("change", function  (event) {
    //   this.Initialize(document.getElementsByTagName("select")[0].value);
    // }); 
  }

  onSelected(value: number) {
    //alert("Button clicked "+value);
    // Do something with the value
    this.Initialize(value);
  }

}

