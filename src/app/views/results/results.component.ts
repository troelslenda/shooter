import { Component, OnInit } from '@angular/core';
import { SessionService } from '../../services/session.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {

  sessions: Observable<any>

  constructor(sessionService: SessionService) {
    this.sessions = sessionService.sessions
  }

  ngOnInit() {
  }

}
