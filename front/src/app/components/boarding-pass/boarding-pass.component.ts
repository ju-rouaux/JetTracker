import { Component, Input } from '@angular/core';

@Component({
  selector: 'boarding-pass',
  templateUrl: './boarding-pass.component.html',
  styleUrls: ['./boarding-pass.component.css']
})
export class BoardingPassComponent {
    @Input()
    nom : String = "Unknown";

    @Input()
    immatriculation : String = "XXXXXX";

    @Input()
    depart = {
        aeroport : String,
        heure : String,
        date : String
    }

    @Input()
    arrivee = {
        aeroport : String,
        heure : String,
        date : String
    }
}
