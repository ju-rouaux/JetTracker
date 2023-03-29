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

// Liste des personnes sélectionnées
  listePersonnesSelectionnees: Personne[] = [];

// Labels sélectionnés par défaut (tous les labels)
  selectedLabels: number[] = [0, 1, 2];

  chart: any;

  // Option de label
  labelOptions = [
    {label: "Temps de vol", datasetIndex: 0},
    {label: 'Distance parcourue', datasetIndex: 1},
    {label: 'Emissions de CO2', datasetIndex: 2}
  ];

  constructor(private personneService: PersonneService) {
  }

  async ngOnInit() {
// Récupérer la liste des personnes depuis le service
    this.listePersonnes = await this.personneService.getListePersonne();
// Créer le graphique
    this.createChart();
  }

  createChart() {
// Créer une nouvelle instance de chart.js avec les données initiales
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
                size: 16 // changer la taille de police à la valeur désirée
              }
            }
          },
        },
      },
    });
  }

  onCheckboxChange(event: any, i: number) {
// Mettre à jour la liste des personnes sélectionnées en fonction de la case cochée ou non
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
// Mettre à jour le graphique en conséquence
    this.updateChart();
  }


  updateChart() {
    // Pour chaque dataset du graphique, cacher ou afficher en fonction des options de labels sélectionnées
    this.chart.data.datasets.forEach((dataset: any, index: number) => {
      dataset.hidden = !this.selectedLabels.includes(index);
      dataset.data = this.listePersonnesSelectionnees.map((personne) => {
        // Récupérer les données correspondantes en fonction de l'index de dataset
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
    // Mettre à jour les labels du graphique en fonction des personnes sélectionnées
    this.chart.data.labels = this.listePersonnesSelectionnees.map(
      (personne) => personne.prenom + ' ' + personne.nom
    );
    // Mettre à jour le graphique avec les nouvelles données
    this.chart.update();
  }


  onLabelChange(event: any) {
    const value = parseInt(event.target.value);
    if (event.target.checked) {
      // Ajouter l'option de label sélectionnée
      this.selectedLabels.push(value);
    } else {
      // Retirer l'option de label désélectionnée
      const index = this.selectedLabels.indexOf(value);
      if (index >= 0) {
        this.selectedLabels.splice(index, 1);
      }
    }
    // Mettre à jour le graphique avec les nouvelles options de labels sélectionnées
    this.updateChart();
  }


}
