import { Component } from '@angular/core';

@Component({
  selector: 'app-carte-profil',
  templateUrl: './carte-profil.component.html',
  styleUrls: ['./carte-profil.component.css']
})
export class CarteProfilComponent {
    nom : String = "Elon Musk";
    emission : number = 5.5;
    image : String = "../../assets/elon.jpg";
}
