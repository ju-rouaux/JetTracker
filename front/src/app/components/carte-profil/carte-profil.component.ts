import {Component, OnInit} from '@angular/core';
import {Personne, PersonneService} from 'src/app/services/personne.service';

@Component({
  selector: 'app-carte-profil',
  templateUrl: './carte-profil.component.html',
  styleUrls: ['./carte-profil.component.css']
})
export class CarteProfilComponent implements OnInit {

  listePersonne: Personne[] = []; // une propriété qui contiendra la liste des personnes récupérées depuis le service

  constructor(
// initialisation du service "PersonneService"
private personneService: PersonneService
  ) {
  }

// fonction pour récupérer la liste des personnes depuis le service
  async chargerListePersonne() {
    this.listePersonne = await this.personneService.getListePersonne(); // appel à la méthode getListePersonne() du service pour récupérer la liste
    console.log("Liste personnes : " + this.listePersonne); // affichage de la liste des personnes dans la console
  }

  async ngOnInit() {
    await this.chargerListePersonne(); // appel à la fonction chargerListePersonne() pour récupérer la liste des personnes au moment de l'initialisation du composant
  }
}
