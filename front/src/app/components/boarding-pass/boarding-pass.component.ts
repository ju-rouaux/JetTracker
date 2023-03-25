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
        //let vols : Array<Flight> = new Array<Flight>();
        let personnes : Array<Personne> = new Array<Personne>();

        let vols : Array<{personne : Personne, vol : Flight}> = new Array<{personne : Personne, vol : Flight}>();
    
        //Créer une liste des vols
        this.listePersonne.forEach(p => {
            p.vols?.forEach(vol => {
                vols.push({
                    "personne" : p,
                    "vol" : vol
                });
                personnes.push(p);
            });
        });

        console.log(vols);
        //Trier les vols du plus ancien au plus récent
        vols = vols.sort((a, b) => {
            return new Date(a.vol.departure.scheduledTimeUtc) < new Date(b.vol.departure.scheduledTimeUtc) ? 1 : -1;
        });


        //Charger le vol à l'index donné dans le composant
        let vol = vols[this.index_vol].vol;
        let pers = vols[this.index_vol].personne;
        let d : Date;
        this.nom = pers.prenom + " " + pers.nom;
        this.immatriculation = vol.aircraft.model;
        this.depart_aeroport  = vol.departure.airport;
        d = new Date(vol.departure.scheduledTimeUtc)
        this.depart_heure  = this.formatNumber(d.getHours()) + "h" + this.formatNumber(d.getMinutes());
        this.depart_date = this.formatNumber(d.getDay()) + "/" + this.formatNumber(d.getMonth()) + "/" + this.formatNumber(d.getFullYear());
        this.arrivee_aeroport = vol.arrival.airport;
        d = new Date(vol.arrival.scheduledTimeUtc)
        this.arrivee_heure = this.formatNumber(d.getHours()) + "h" + this.formatNumber(d.getMinutes());
        this.arrivee_date = this.formatNumber(d.getDay()) + "/" + this.formatNumber(d.getMonth()) + "/" + this.formatNumber(d.getFullYear());
    }

    formatNumber(num : number) {
        return num.toLocaleString('fr-FR', {
            minimumIntegerDigits: 2,
            useGrouping: false
        });
    }
}
