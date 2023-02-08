import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentaireComponent } from './components/commentaire/commentaire.component';
import { BoardingPassComponent } from './components/boarding-pass/boarding-pass.component';
import { CarteProfilComponent } from './components/carte-profil/carte-profil.component';
import { ConteneurCarteComponent } from './components/conteneur-carte/conteneur-carte.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentaireComponent,
    BoardingPassComponent,
    CarteProfilComponent,
    ConteneurCarteComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
