import {Component, OnInit} from '@angular/core';
import Chart from 'chart.js/auto';
import {Personne, PersonneService} from 'src/app/services/personne.service';

@Component({
  selector: 'app-graphique',
  templateUrl: './graphique.component.html',
  styleUrls: ['./graphique.component.css'],
})
export class GraphiqueComponent implements OnInit {
  listePersonnes: Personne[] = [];

  listePersonnesSelectionnees: Personne[] = [];

  chart: any;

  constructor(private personneService: PersonneService) {
  }

  async ngOnInit() {
      this.listePersonnes = await this.personneService.getListePersonne();
      console.log(this.listePersonnes)
      this.createChart();
  }

  createChart() {
    this.chart = new Chart('monGraphique', {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            label: "Nombre d'heures de vol",
            data: [],
            backgroundColor: 'blue',
          },
          {
            label: 'Distance parcourue',
            data: [],
            backgroundColor: 'limegreen',
          },
          {
            label: 'Emissions de CO2',
            data: [],
            backgroundColor: 'red',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
      },
    });
  }

  onCheckboxChange(event: any, i: number) {
    if (event.target.checked) {
      this.listePersonnesSelectionnees.push(this.listePersonnes[i]);
    } else {
      const index = this.listePersonnesSelectionnees.indexOf(
        this.listePersonnes[i]
      );
      if (index >= 0) {
        this.listePersonnesSelectionnees.splice(index, 1);
      }
    }
    this.updateChart();
  }

  updateChart() {
    this.chart.data.datasets[0].data = this.listePersonnesSelectionnees.map(
      (personne) => personne.nbHeuresVol
    );
    this.chart.data.datasets[1].data = this.listePersonnesSelectionnees.map(
      (personne) => personne.distanceParcourue
    );
    this.chart.data.datasets[2].data = this.listePersonnesSelectionnees.map(
      (personne) => personne.emission
    );
    this.chart.data.labels = this.listePersonnesSelectionnees.map( (personne) => personne.prenom + ' ' + personne.nom);
    this.chart.update();
  }
}
