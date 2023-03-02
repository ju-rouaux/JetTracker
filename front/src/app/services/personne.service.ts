import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PersonneService {

  constructor() { }

  /**
   * Retourne la liste de toutes les personnes.
   * @returns la liste de toutes les personnes.
   */
  getListePersonne() : Personne[] {
    return PERSONNES;
  }
}

/**
 * Contient toutes les données d'une personne.
 */
export class Personne {
  id: number;
  prenom: string;
  nom: string;
  imageLocation: string;
  // Insérer d'autres données à votre guise
  emission: number; //temporaire
}

const PERSONNES: Personne[] = [
  {
    id: 0,
    prenom: "Elon",
    nom: "Musk",
    imageLocation: "/assets/elon.jpg",
    emission: 5.5
  },
  {
    id: 1,
    prenom: "Jean",
    nom: "Françoise",
    imageLocation: "/assets/elon.jpg",
    emission: 5.7
  },
  {
    id: 2,
    prenom: "Marie",
    nom: "Serge",
    imageLocation: "/assets/elon.jpg",
    emission: 5.1
  }
]