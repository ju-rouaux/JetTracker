import { Component, OnInit } from '@angular/core';
import { PersonneService, Personne } from 'src/app/services/personne.service';

@Component({
  selector: 'app-carte-profil',
  templateUrl: './carte-profil.component.html',
  styleUrls: ['./carte-profil.component.css']
})
export class CarteProfilComponent implements OnInit {

  listePersonne: Personne[] = [];

  // Récupérer la liste des personnes
  async chargerListePersonne(){
    this.listePersonne = await this.personneService.getListePersonne();
    console.log("Liste personnes : " + this.listePersonne);
  }

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  async ngOnInit() {
    await this.chargerListePersonne();
  }
}
