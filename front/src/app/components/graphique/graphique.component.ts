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
  selectedLabels: number[] = [0, 1, 2]; // initialize with all labels selected


  chart: any;

  labelOptions = [
    {label: "Temps de vol", datasetIndex: 0},
    {label: 'Distance parcourue', datasetIndex: 1},
    {label: 'Emissions de CO2', datasetIndex: 2}
  ];

  constructor(private personneService: PersonneService) {
  }

  async ngOnInit() {
    this.listePersonnes = this.personneService.getListePersonne();
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
            label: "Temps de vol (en mn)",
            data: [],
            backgroundColor: 'blue',
          },
          {
            label: 'Distance parcourue (en km)',
            data: [],
            backgroundColor: 'limegreen',
          },
          {
            label: 'Emissions de CO2 (en kg)',
            data: [],
            backgroundColor: 'red',
          },
        ],
      },
      options: {
        aspectRatio: 2.5,
        plugins: {
          legend: {
            labels: {
              font: {
                size: 16 // change the font size to your desired value
              }
            }
          },
        },
      },
    });
  }

  onCheckboxChange(event
                     :
                     any, i
                     :
                     number
  ) {
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
    this.chart.data.datasets.forEach((dataset: any, index: number) => {
      dataset.hidden = !this.selectedLabels.includes(index);
      dataset.data = this.listePersonnesSelectionnees.map((personne) => {
        switch (index) {
          case 0:
            return personne.nbHeuresVol;
          case 1:
            return personne.distanceParcourue;
          case 2:
            return personne.emission;
          default:
            return null;
        }
      });
    });
    this.chart.data.labels = this.listePersonnesSelectionnees.map(
      (personne) => personne.prenom + ' ' + personne.nom
    );
    this.chart.update();
  }


  onLabelChange(event
                  :
                  any
  ) {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      this.selectedLabels.push(value);
    } else {
      const index = this.selectedLabels.indexOf(value);
      if (index >= 0) {
        this.selectedLabels.splice(index, 1);
      }
    }
    this.updateChart();
  }

}
