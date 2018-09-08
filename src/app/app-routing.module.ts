import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IsUserGuard } from './services/is-user.guard'
import { IsUnauthorizedGuard } from './services/is-unauthorized.guard'
import { LoginComponent } from './views/login/login.component';
import { SettingsComponent } from './views/settings/settings.component';
import { StartComponent } from './views/start/start.component';
import { ResultsComponent } from './views/results/results.component';
import { ScoreComponent } from './views/score/score.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [IsUnauthorizedGuard] },
  { path: 'settings', component: SettingsComponent, canActivate: [IsUserGuard] },
  { path: '', component: StartComponent },
  { path: 'results', component: ResultsComponent },
  { path: 'score', component: ScoreComponent }
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }