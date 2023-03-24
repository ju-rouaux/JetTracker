import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PersonneService, Personne } from 'src/app/services/personne.service';

@Component({
  selector: 'app-selecteur-personne',
  templateUrl: './selecteur-personne.component.html',
  styleUrls: ['./selecteur-personne.component.css'],
})
export class SelecteurPersonneComponent implements OnInit {
  // Récupérer la liste des personnes

  @Output() selected = new EventEmitter<number>();

  listePersonne: Personne[] = [];

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  async ngOnInit() {
    this.listePersonne = await this.personneService.getListePersonne();

  }

  // Lorsqu'un élément de la liste est sélectionné
  onSelected(idPersStr: string) {
    let id = Number.parseInt(idPersStr);
    this.selected.emit(id);
  }
}
