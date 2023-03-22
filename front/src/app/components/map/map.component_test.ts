import { Component, OnInit } from '@angular/core';

import { PersonneService, Personne, Flight } from 'src/app/services/personne.service';


@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})

export class CarteProfilComponent implements OnInit {
  listePersonne: Personne[] = [];

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  // Récupérer la liste des personnes
  async chargerListePersonne(){
    this.personneService.chargerPersonnes().then((listePersonne) => {
      this.listePersonne = listePersonne;
      this.derniers_vols();
    });
  }

  async ngOnInit() {
    await this.chargerListePersonne();
  }

  derniers_vols() {
    let liste : Array<Flight> = new Array<Flight>();

    console.log("this.listePersonnesqdqsd:");
    console.log(this.listePersonne);
    console.log(this.listePersonne.length);
  }
}
