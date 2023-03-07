import {Component} from '@angular/core';
import Chart from 'chart.js/auto';
import {Personne, PersonneService} from "src/app/services/personne.service";

@Component({
  selector: 'app-graphique',
  templateUrl: './graphique.component.html',
  styleUrls: ['./graphique.component.css']
})
export class GraphiqueComponent {
  listePersonnes: Personne[] = this.personneService.getListePersonne();
  public chart: any;

  constructor(
    private personneService: PersonneService) {
  }

  ngOnInit(): void {
    this.createChart();
  }

  createChart() {

    this.chart = new Chart("monGraphique", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: this.listePersonnes.map((personne) => personne.prenom + " " + personne.nom),
        datasets: [
          {
            label: "Nombre d'heures de vol",
            data: ['467', '576', '572', '79', '92',
              '574', '573', '576', '572', '79', '92','574', '573','576', '572', '79', '92','574', '573'],
            backgroundColor: 'grey'
          },
          {
            label: "Distance parcourue",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541', '542', '542', '536', '327', '17','542', '542', '536', '327', '17',],
            backgroundColor: 'limegreen'
          },
          {
            label: "Emissions de CO2",
            data: ['542', '542', '536', '327', '17',
              '0.00', '538', '541', '542', '542', '536', '327', '17','542', '542', '536', '327', '17',],
            backgroundColor: 'red'
          }
        ]
      },
      options: {
        aspectRatio: 2.5
      }

    });
  }
}
