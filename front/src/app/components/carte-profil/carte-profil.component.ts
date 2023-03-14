import { Component } from '@angular/core';
import { PersonneService, Personne } from 'src/app/services/personne.service';

@Component({
  selector: 'app-carte-profil',
  templateUrl: './carte-profil.component.html',
  styleUrls: ['./carte-profil.component.css']
})
export class CarteProfilComponent {
  // Récupérer la liste des personnes
  listePersonne : Personne[] = this.personneService.getListePersonne();

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}
}
