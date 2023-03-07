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
  immatriculation : Array<String>;


}

const PERSONNES: Personne[] = [
  {
    id: 0,
    prenom: "Elon",
    nom: "Musk",
    imageLocation: "/assets/elon.jpg",
    emission: 5.5,
    immatriculation : ["N628TS", "N272BG", "N502SX"]
  },
  {
    id: 1,
    prenom: "Bill",
    nom: "Gates",
    imageLocation: "/assets/bill.jpg",
    emission: 5.7,
    immatriculation : ["N194WM", "N887WM"]
  },
  {
    id: 2,
    prenom: "Michael",
    nom: "Jordan",
    imageLocation: "/assets/micheal.jpg",
    emission: 5.1,
    immatriculation : ["N236MJ"]
  },
  {
    id : 3,
    prenom: "Taylor",
    nom : "Swift",
    imageLocation: "/assets/taylor",
    emission: 5.1,
    immatriculation : ["N898TS"]
  },
  {
    id : 4,
    prenom : "Jim",
    nom : "Carrey",
    imageLocation: "/assets/jim",
    emission: 5.1,
    immatriculation : ["N162JC"]
  },{
    id : 5,
    prenom : "Alan",
    nom : "Sugar",
    imageLocation: "/assets/alan",
    emission: 5.1,
    immatriculation : ["G-SUGA"]
  },
  {
    id : 6,
    prenom : "John",
    nom : "Travolta",
    imageLocation: "/assets/john",
    emission : 5,
    immatriculation : ["N707JT"]

  },
  {
    id : 7,
    prenom : "Donald",
    nom : "Trump",
    imageLocation: "/assets/donald",
    emission : 5,
    immatriculation : ["N757AF"]
  },
  {
    id : 8,
    prenom : "Roman",
    nom : "Abramovich",
    imageLocation: "/assets/roman",
    emission : 5,
    immatriculation : ["P4-MES"]
  },
  {
    id : 9,
    prenom : "Magic",
    nom : "Johnson",
    imageLocation: "/assets/magic",
    emission : 5,
    immatriculation : ["N32MJ"]
  },
  {
    id : 10,
    prenom : "Matt",
    nom : "Damon",
    imageLocation: "/assets/matt",
    emission : 5,
    immatriculation : ["N444WT"]
  },
  {
    id : 11,
    prenom : "",
    nom : "Windsors",
    imageLocation: "/assets/windosors",
    emission : 5,
    immatriculation : ["G-XXEB"]
  },
  {
    id : 12,
    prenom : "Harrison",
    nom : "Ford",
    imageLocation: "/assets/harrison",
    emission : 5,
    immatriculation : ["LX-DEC"]
  },
  {
    id : 13,
    prenom : "",
    nom : "Jay-Z",
    imageLocation: "/assets/jayz",
    emission : 5,
    immatriculation : ["N444SC"]
  }
]
