import { Component } from '@angular/core';
import { PersonneService, Personne } from 'src/app/services/personne.service';

@Component({
  selector: 'app-selecteur-personne',
  templateUrl: './selecteur-personne.component.html',
  styleUrls: ['./selecteur-personne.component.css'],
})
export class SelecteurPersonneComponent {
  // Récupérer la liste des personnes
  listePersonne: Personne[] = [];

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  async ngOnInit() {
    this.personneService.chargerPersonnes().then((listePersonne) => {
      console.log("Liste personnes " + listePersonne);
      console.log(listePersonne[0].getNom());
    });


    console.log("Liste personnes " + this.listePersonne)
    console.log(this.listePersonne[0].getNom())
  }

  // Lorsqu'un élément de la liste est sélectionné
  onSelected(idPersStr: string) {
    let id = Number.parseInt(idPersStr);
    console.log(this.listePersonne[id]);
  }
}
