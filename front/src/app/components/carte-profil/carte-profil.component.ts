import { Component } from '@angular/core';

@Component({
  selector: 'app-carte-profil',
  templateUrl: './carte-profil.component.html',
  styleUrls: ['./carte-profil.component.css']
})
export class CarteProfilComponent {
  personnes = [{
    nom: "Elon Musk",
    emission: "5.5",
    image: "../../assets/elon.jpg"
  },
  {
    nom: "Elon Musk",
    emission: "5.5",
    image: "../../assets/elon.jpg"
  },
  {
    nom: "Elon Musk",
    emission: "5.5",
    image: "../../assets/elon.jpg"
  }]
}
