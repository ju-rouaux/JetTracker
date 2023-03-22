import { Component, Input, OnInit } from '@angular/core';
import { PersonneService, Personne, Flight } from 'src/app/services/personne.service';

@Component({
  selector: 'boarding-pass',
  templateUrl: './boarding-pass.component.html',
  styleUrls: ['./boarding-pass.component.css']
})
export class BoardingPassComponent implements OnInit {
    @Input()
    index_vol : number;

    nom : String = "Prénom Nom"
    immatriculation : String = "XXXXXX";

    depart_aeroport : String = "XXX";
    depart_heure : String = "00h00";
    depart_date : String = "01/01/1970";

    arrivee_aeroport : String = "XXX";
    arrivee_heure : String = "00h00";
    arrivee_date : String = "01/01/1970";

    listePersonne: Personne[] = [];

    constructor(
        // Initialiser le PersonneService
        private personneService: PersonneService
    ) {}

    // Récupérer la liste des personnes
    async chargerListePersonne(){
        this.listePersonne = await this.personneService.getListePersonne();
        this.derniers_vols();
    }

    async ngOnInit() {
        await this.chargerListePersonne();
    }

    derniers_vols() {
        let vols : Array<Flight> = new Array<Flight>();
        let personnes : Array<Personne> = new Array<Personne>();

        //Créer une liste des vols
        this.listePersonne.forEach(p => {
            p.vols?.forEach(vol => {
                vols.push(vol);
                personnes.push(p);
            });
        });

        console.log(vols);
        //Trier les vols du plus ancien au plus récent
        vols = vols.sort((a, b) => {
            return new Date(a.departure.scheduledTimeUtc) < new Date(b.departure.scheduledTimeUtc) ? 1 : -1;
        });


        //Charger le vol à l'index donné dans le composant
        let vol = vols[this.index_vol];
        let d : Date;
        // this.nom = this.personne.prenom + " " + this.personne.nom;
        this.immatriculation = vol.aircraft.model;
        this.depart_aeroport  = "XXX";
        d = new Date(vol.departure.scheduledTimeUtc)
        this.depart_heure  = d.getHours().toString() + "h" + d.getMinutes().toString();
        this.depart_date = d.getDay().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
        this.arrivee_aeroport = "XXX";
        d = new Date(vol.arrival.scheduledTimeUtc)
        this.arrivee_heure = d.getHours().toString() + "h" + d.getMinutes().toString();
        this.arrivee_date = d.getDay().toString() + "/" + d.getMonth().toString() + "/" + d.getFullYear().toString();
    }

}
