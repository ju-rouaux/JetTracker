import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  constructor(private http: HttpClient) {
  }

  /**
   * Retourne la liste de toutes les personnes.
   * @returns la liste de toutes les personnes.
   */
  async getListePersonne(): Promise<Personne[]> {
    try {
      const jsonData = await this.http.get<any>('/assets/parse.json').toPromise();

      const personnes: Personne[] = [];
      let i = 0;
      for (const personneKey of Object.keys(jsonData)) {
        const data = jsonData[personneKey];
        const jets: Jet[] = [];
        if (data.jets) {
          for (const jetKey of Object.keys(data.jets)) {
            const jetData = data.jets[jetKey];
            for (const innerJetKey of Object.keys(jetData.jet)) {
              const jet = jetData.jet[innerJetKey];
              jets.push(jet);
            }
          }
        }
        const nameParts = personneKey.split(' ');
        const prenom = nameParts[0];
        const nom = nameParts.slice(1).join(' ');
        const personne = new Personne(
          i++,
          prenom,
          nom,
          data.imageLocation,
          data.emission,
          data.nbHeuresVol,
          data.distanceParcourue,
          data.immatriculation,
          jets
        );
        personnes.push(personne);
      }

      return personnes;
    } catch (error) {
      console.error(error);
      return [];
    }
  }

}

interface Jet {
  max_speed: string | null;
  model: string | null;
}

interface Flight {
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
    scheduledTimeLocal: string;
  };
  greatCircleDistance: {
    km: number;
  };
}

interface Jets {
  [key: string]: {
    jet: {
      [key: string]: Jet;
    };
  };
}

interface Flights {
  [key: string]: {
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
      scheduledTimeLocal: string;
    };
    greatCircleDistance: {
      km: number;
    };
  };
}

interface People {
  [key: string]: {
    jets?: Jets;
    flights?: Flights;
  };
}

/**
 * Contient toutes les données d'une personne.
 */
export class Personne {
  constructor(
    public id: number,
    public prenom: string,
    public nom: string,
    public imageLocation?: string,
    public emission?: string,
    public nbHeuresVol?: number,
    public distanceParcourue?: number,
    public immatriculation?: string,
    public jets?: Jet[]
  ) {
  }
}
