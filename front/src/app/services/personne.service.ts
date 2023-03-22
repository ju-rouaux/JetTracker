import {HttpClient} from '@angular/common/http';
import {Injectable, OnInit} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  personnes: Personne[] = [];
  personnes_chargees : boolean = false;

  constructor(private http: HttpClient) {
    this.chargerPersonnes().then(personnes => {
      console.log(`Loaded ${personnes.length} people successfully.`);
    });
  }

  /**

   Retourne la liste de toutes les personnes.

   @returns la liste de toutes les personnes.
   */
  async chargerPersonnes(): Promise<Personne[]> {
    try {
      const jsonData = await this.http.get<any>('/assets/parse.json').toPromise();
      for (const personneKey of Object.keys(jsonData)) {
        const data = jsonData[personneKey];
        const jets: Jet[] = [];
        const flights: Flight[] = [];
        const immat: string[] = [];
        let nbHeuresVol = 0;
        let distanceParcourue = 0;
        let co2 = 0;
        if (data.jets) {
          for (const jetKey of Object.keys(data.jets)) {
            const jetData = data.jets[jetKey];
            for (const innerJetKey of Object.keys(jetData)) {
              const jet = jetData[innerJetKey];
              for (const innerInnerJetKey of Object.keys(jet)) {
                immat.push(innerInnerJetKey)
              }
              jets.push(jet);
            }
          }
        }
        if (data.flights) {
          for (const flightKey of Object.keys(data.flights)) {
            const flightData = data.flights[flightKey];
            const greatCircleDistance = flightData.greatCircleDistance?.km;
            if (greatCircleDistance) {
              distanceParcourue += greatCircleDistance;
            }
            if (flightData.hasOwnProperty('departure') && flightData.hasOwnProperty('arrival')) {
              const departureTimeStr = flightData.departure.scheduledTimeUtc;
              const arrivalTimeStr = flightData.arrival.scheduledTimeUtc;
              if (departureTimeStr && arrivalTimeStr) {
                const departureTime = new Date(departureTimeStr).getTime();
                const arrivalTime = new Date(arrivalTimeStr).getTime();
                const nbHoursMillis = arrivalTime - departureTime;
                nbHeuresVol += Math.floor(nbHoursMillis / (1000 * 60));
              }
            }
            flights.push(flightData);
          }
        }
        co2 = distanceParcourue * 0.49 * 1, 609;
        const nameParts = personneKey.split(' ');
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join(' ');
        const existingPersonne = this.personnes.find(p => p.prenom === prenom && p.nom === nom);
        if (existingPersonne) {
          existingPersonne.emission = data.emission;
          existingPersonne.nbHeuresVol = data.nbHeuresVol;
          existingPersonne.distanceParcourue = distanceParcourue;
          existingPersonne.immatriculation = immat;
          existingPersonne.vols = flights;
        } else {
          const personne = new Personne(
            this.personnes.length,
            prenom,
            nom,
            "/assets/img/" + prenom + ".jpg",
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

  getListePersonne(): Personne[] {
    return this.personnes;
  }

}

export interface Jet {
  max_speed: string | null;
  model: string | null;
}

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
  };
  departure: {
    location: {
      lat: number;
      lon: number;
    };
    scheduledTimeUtc: string;
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

  getVols(){
    return this.vols;
  }

  getNom(){
    return this.nom;
  }
}
