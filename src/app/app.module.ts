import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NavigationComponent } from './partials/navigation/navigation.component';
import { LoginComponent } from './views/login/login.component';
import { SettingsComponent } from './views/settings/settings.component';
import { StartComponent } from './views/start/start.component';
import { ScoreComponent } from './views/score/score.component';
import { ResultsComponent } from './views/results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    SettingsComponent,
    StartComponent,
    ScoreComponent,
    ResultsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
