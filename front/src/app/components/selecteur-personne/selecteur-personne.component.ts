// Importer les modules nécessaires
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Personne, PersonneService} from 'src/app/services/personne.service';

@Component({
  selector: 'app-selecteur-personne',
  templateUrl: './selecteur-personne.component.html',
  styleUrls: ['./selecteur-personne.component.css'],
})
export class SelecteurPersonneComponent implements OnInit {
// Récupérer la liste des personnes

  @Output() selected = new EventEmitter<number>(); // Définir l'événement qui sera émis lorsqu'une personne est sélectionnée

  listePersonne: Personne[] = []; // Initialiser la liste des personnes

  constructor(
    private personneService: PersonneService // Initialiser le service des personnes
  ) {
  }

  async ngOnInit() {
    this.listePersonne = await this.personneService.getListePersonne(); // Récupérer la liste des personnes à partir du service
  }

// Lorsqu'un élément de la liste est sélectionné
  onSelected(idPersStr: string) {
    let id = Number.parseInt(idPersStr); // Convertir l'ID en nombre entier
    this.selected.emit(id); // Émettre l'événement avec l'ID de la personne sélectionnée
  }
}
