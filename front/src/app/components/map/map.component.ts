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

import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { icon, Marker } from 'leaflet';

import 'leaflet-routing-machine';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnInit {
  ngOnInit(): void {
    let depart_coord: [number, number] = [48.2, 2.3522];
    let end_coord: [number, number] = [51.5074, -0.1278];

    const iconRetinaUrl =
      'https://unpkg.com/leaflet@1.2.0/dist/images/marker-icon-2x.png';
    const iconUrl = 'assets/marker-icon.png';
    const shadowUrl = 'assets/marker-shadow.png';
    const iconDefault = icon({
      iconRetinaUrl,
      iconUrl,
      shadowUrl,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41],
    });
    Marker.prototype.options.icon = iconDefault;

    // v0(a, b);
    // function v0(depart_coord: [number, number], end_coord: [number, number]) {
    const mymap = L.map('map').setView([48.8566, 2.3522], 13);
    const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    const attribution =
      'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors';
    const tiles = L.tileLayer(tileUrl /*{ attribution }*/);
    tiles.addTo(mymap);

    var greenIcon = L.icon({
      iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
      shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',

      iconSize: [38, 95], // size of the icon
      shadowSize: [50, 64], // size of the shadow
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      shadowAnchor: [4, 62], // the same for the shadow
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });

    var control = L.Routing.control({
      waypoints: [
        L.latLng(depart_coord), // Paris
        L.latLng(end_coord), // Londres
      ],
    }).addTo(mymap);

    control.hide();

    // var greenIcon = L.icon({
    //   iconUrl: 'leaf-green.png',
    //   shadowUrl: 'leaf-shadow.png',

    //   iconSize: [38, 95], // size of the icon
    //   shadowSize: [50, 64], // size of the shadow
    //   iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //   shadowAnchor: [4, 62], // the same for the shadow
    //   popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    // });

    // let iconOptions = {
    //   title: 'company name',
    //   draggable: true,
    //   icon: greenIcon,
    // };
    document.getElementById('voiture-checkbox')?.addEventListener(
      'click',
      () => {
        if (
          document.getElementById('voiture-checkbox')?.getAttribute('checked')
        ) {
          var polygon = L.polygon([depart_coord, end_coord]).addTo(mymap);
          document.getElementById('jet-checkbox')?.removeAttribute('checked');
          alert('voiture checked');
        }
      },
      false
    );

    document.getElementById('jet-checkbox')?.addEventListener(
      'click',
      () => {
        var polygon = L.polygon([depart_coord, end_coord]).addTo(mymap);
        // document.getElementById('voiture-checkbox')?.removeAttribute('checked');
        //document.getElementById('voiture-checkbox')?.checked = false
      },
      false
    );

    // }

    // Object.values(document.getElementsByClassName("leaflet-marker-icon")).forEach(element => {
    //   element.src
    // });
  }
}
