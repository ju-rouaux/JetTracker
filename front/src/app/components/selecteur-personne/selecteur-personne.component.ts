import { Component } from '@angular/core';
import { PersonneService, Personne } from 'src/app/services/personne.service';

@Component({
  selector: 'app-selecteur-personne',
  templateUrl: './selecteur-personne.component.html',
  styleUrls: ['./selecteur-personne.component.css']
})
export class SelecteurPersonneComponent {
  // Récupérer la liste des personnes
  listePersonne : Personne[] = this.personneService.getListePersonne();

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  // Lorsqu'un élément de la liste est sélectionné
  onSelected(idPersStr : string) {
    let id = Number.parseInt(idPersStr);
    console.log(this.listePersonne[id]);
  }
}
