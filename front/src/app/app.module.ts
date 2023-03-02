import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommentaireComponent } from './components/commentaire/commentaire.component';
import { BoardingPassComponent } from './components/boarding-pass/boarding-pass.component';
import { CarteProfilComponent } from './components/carte-profil/carte-profil.component';
import { SelecteurPersonneComponent } from './components/selecteur-personne/selecteur-personne.component';

@NgModule({
  declarations: [
    AppComponent,
    CommentaireComponent,
    BoardingPassComponent,
    CarteProfilComponent,
    SelecteurPersonneComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
