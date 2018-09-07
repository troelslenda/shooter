import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './views/login/login.component';
import { SettingsComponent } from './views/settings/settings.component';
import { StartComponent } from './views/start/start.component';
import { ResultsComponent } from './views/results/results.component';
import { ScoreComponent } from './views/score/score.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'settings', component: SettingsComponent },
  { path: '', component: StartComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'score', component: ScoreComponent }

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }