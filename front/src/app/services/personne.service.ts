import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  personnes: Personne[] = []; // Crée un tableau vide pour stocker les données des personnes

  constructor(private http: HttpClient) {
    this.chargerPersonnes().then(personnes => {
      console.log(`Loaded ${personnes.length} people successfully.`); // Charge les données des personnes et affiche un message de confirmation
    });
  }

  /**

   Retourne la liste de toutes les personnes.
   @returns la liste de toutes les personnes.
   */
  async chargerPersonnes(): Promise<Personne[]> {
    try {
      const jsonData = await this.http.get<any>('/assets/parse.json').toPromise(); // Récupère les données depuis un fichier JSON et les stocke dans la variable jsonData
// On peut utiliser un serveur express en mettant l'ip ci-dessous
// const jsonData = await this.http.get<any>('192.168.1.51');
      for (const personneKey of Object.keys(jsonData)) { // Parcourt toutes les données de personne dans jsonData
        const data = jsonData[personneKey]; // Stocke les données de la personne courante dans la variable data
        const jets: Jet[] = [];
        const flights: Flight[] = [];
        const immat: string[] = [];
        let nbHeuresVol = 0;
        let distanceParcourue = 0;
        let co2 = 0;
        if (data.jets) { // Vérifie s'il y a des données de jets pour la personne courante
          for (const jetKey of Object.keys(data.jets)) { // Parcourt toutes les données de jet pour la personne courante
            const jetData = data.jets[jetKey]; // Stocke les données du jet courant dans la variable jetData
            for (const innerJetKey of Object.keys(jetData)) {
              const jet = jetData[innerJetKey]; // Stocke les données de l'immatriculation du jet courant dans la variable jet
              for (const innerInnerJetKey of Object.keys(jet)) {
                immat.push(innerInnerJetKey) // Ajoute l'immatriculation du jet courant dans le tableau immat
              }
              jets.push(jet); // Ajoute les données du jet courant dans le tableau jets
            }
          }
        }
        if (data.flights) { // Vérifie s'il y a des données de vol pour la personne courante
          for (const flightKey of Object.keys(data.flights)) { // Parcourt toutes les données de vol pour la personne courante
            const flightData = data.flights[flightKey];
            const greatCircleDistance = flightData.greatCircleDistance?.km; // Stocke la distance de vol dans greatCircleDistance s'il existe
            if (greatCircleDistance) {
              distanceParcourue += greatCircleDistance; // Ajoute la distance de vol dans la variable distanceParcourue
            }
            if (flightData.hasOwnProperty('departure') && flightData.hasOwnProperty('arrival')) { // Vérifie s'il y a des données de départ et d'arrivée pour le vol courant
              const departureTimeStr = flightData.departure.scheduledTimeUtc;
              const arrivalTimeStr = flightData.arrival.scheduledTimeUtc;
              if (departureTimeStr && arrivalTimeStr) { // Vérifie s'il y a des données d'heure de départ et d'arrivée pour le vol courant
                const departureTime = new Date(departureTimeStr).getTime();
                const arrivalTime = new Date(arrivalTimeStr).getTime();
                const nbHoursMillis = arrivalTime - departureTime; // Stocke le nombre d'heures de vol en millisecondes dans nbHoursMillis
                nbHeuresVol += Math.floor(nbHoursMillis / (1000 * 60)); // Ajoute le nombre d'heures de vol dans la variable nbHeuresVol
              }
            }
            flights.push(flightData);
          }
        }
        co2 = distanceParcourue * 0.49 * 1.609; // Calcule le CO2 émis en fonction de la distance parcourue. 0.49 est le coefficient de conversion de kg en g et 1.609 est le coefficient de conversion de miles en km
        const nameParts = personneKey.split(' ');
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join(' ');
        const existingPersonne = this.personnes.find(p => p.prenom === prenom && p.nom === nom);
        if (existingPersonne) { // Vérifie si la personne courante existe déjà dans le tableau personnes
          // @ts-ignore
          existingPersonne.emission += co2;
          // @ts-ignore
          existingPersonne.nbHeuresVol += nbHeuresVol;
          // @ts-ignore
          existingPersonne.distanceParcourue += distanceParcourue;
          existingPersonne.immatriculation = immat;
          existingPersonne.vols = flights;
        } else { // Si la personne courante n'existe pas dans le tableau personnes, on l'ajoute
          const personne = new Personne(
            this.personnes.length,
            prenom,
            nom,
            "/assets/img/" + prenom + "_" + nom + ".jpg",
            co2,
            nbHeuresVol,
            distanceParcourue,
            immat,
            flights
          );
          this.personnes.push(personne);
        }
      }
      return this.personnes;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Retourne la liste de toutes les personnes.
  async getListePersonne(): Promise<Personne[]> {
    try {
      const listePersonne = await this.chargerPersonnes();
      this.personnes = listePersonne;
      return this.personnes;
    } catch (error) {
      console.error('Error while getting list of persons:', error);
      return [];
    }
  }

}

// Définition des interfaces pour les données de la personne et du jet.
export interface Jet {
  max_speed: string | null;
  model: string | null;
}

// Définition des interfaces pour les données de la personne et du vol.
export interface Flight {
  aircraft: {
    modeS: string;
    model: string;
    reg: string;
  };
  arrival: {
    location: {
      lat: number;
      lon: number;
    };
    scheduledTimeUtc: string;
    airport: string;
  };
  departure: {
    location: {
      lat: number;
      lon: number;
    };
    scheduledTimeUtc: string;
    airport: string;
  };
  greatCircleDistance?: {
    km: number;
  };
}

/**

 Contient toutes les données d'une personne.
 */
export class Personne {
  constructor(
    public id: number,
    public prenom: string,
    public nom: string,
    public imageLocation?: string,
    public emission?: number,
    public nbHeuresVol?: number,
    public distanceParcourue?: number,
    public immatriculation?: string[],
    public vols?: Flight[],
  ) {
  }
}
