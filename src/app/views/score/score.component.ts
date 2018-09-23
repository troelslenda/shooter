import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { AuthService } from '../../services/auth.service';
import { Router} from '@angular/router'

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss']
})
export class ScoreComponent {

  shots: any[] = [];
  exclusions : boolean[] = [];
  type: string;

  constructor(public sessionService: SessionService, public auth: AuthService, public router:Router) { }

  private toggleExclusion(index: number): void {
    this.exclusions[index] = !this.exclusions[index]
  }
  private isExcluded(index: number): boolean {
    return this.exclusions[index]
  }
  private resetScore(): void {
    this.shots = [];
    this.exclusions = [];
  }
  private async saveToPrevious() {
    await this.sessionService.saveRoundToPreviousSession({
      shots: this.validShots,
      type: this.type,
      time: new Date()
    }, this.auth.userDetails)
    this.router.navigate(['/results'])
  }
  private async saveToNew() {
    await this.sessionService.saveRoundToNewSession({
      shots: this.validShots,
      type: this.type,
      time: new Date()
    }, this.auth.userDetails)
    this.router.navigate(['/results'])
  }
  private registerShot(shot: any): void {
    this.shots.push(shot)
    console.log(this.type)
  }
  get allShots(): any[] {
    return this.shots
  }
  
  get validShots(): any[] {
    return this.shots.filter((shot, index) => 
      !this.isExcluded(index))
  }
  public
  get sum(): number {
    return this.validShots
      .reduce((result, shot) => 
        result + (typeof shot === 'string' && shot.toLowerCase()==='x' ? 10 : shot), 0)
   }
   get bullsEyes(): number {
    return this.validShots.filter((shot, index) => shot==='x').length
  }
}
