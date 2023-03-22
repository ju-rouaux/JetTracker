import { Component, OnInit } from '@angular/core';
import { PersonneService, Personne, Flight } from 'src/app/services/personne.service';

@Component({
  selector: 'app-carrousel',
  templateUrl: './carrousel.component.html',
  styleUrls: ['./carrousel.component.css']
})
export class CarrouselComponent implements OnInit {
  listePersonne: Personne[] = [];

  constructor(
    // Initialiser le PersonneService
    private personneService: PersonneService
  ) {}

  // Récupérer la liste des personnes
  async chargerListePersonne(){
    this.listePersonne = await this.personneService.getListePersonne()
    this.derniers_vols();
  }

  async ngOnInit() {
    await this.chargerListePersonne();
  }

  derniers_vols() {
    let liste : Array<Flight> = new Array<Flight>();

    console.log("this.listePersonnesqdqsd:");
    console.log(this.listePersonne);
    console.log(this.listePersonne.length);

    // this.listePersonne.forEach(p => {
    //   console.log("bruh1");

    //   p.vols?.forEach(vol => {
    //     console.log("bruh2");
    //     liste.push(vol);
    //   });
    // });

    // this.listePersonne.forEach( (element) => {
    //   console.log("bruh");
    //   console.log(element);
    // });

    // let heures = liste.map(function(v) {
    //   v.departure.scheduledTimeUtc;
    // });

    // console.log(heures);
    // console.log(liste);
  }
}
