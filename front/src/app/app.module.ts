import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BoardingPassComponent } from './components/boarding-pass/boarding-pass.component';
import { CarteProfilComponent } from './components/carte-profil/carte-profil.component';
import { SelecteurPersonneComponent } from './components/selecteur-personne/selecteur-personne.component';
import { CarrouselComponent } from './components/carrousel/carrousel.component';
import { MapComponent } from './components/map/map.component';
import {GraphiqueComponent} from "./components/graphique/graphique.component";

@NgModule({
  declarations: [
    AppComponent,
    BoardingPassComponent,
    CarteProfilComponent,
    SelecteurPersonneComponent,
    CarrouselComponent,
    MapComponent,
    GraphiqueComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
