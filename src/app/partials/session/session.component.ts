import { Component, Input, OnInit } from '@angular/core';
import {map} from 'lodash';

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
  styleUrls: ['./session.component.scss']
})
export class SessionComponent implements OnInit {

  rounds : any[];

  @Input('session') session: any;

  constructor() {

  }

  ngOnInit() {
    // Convert objects to array.
    this.rounds = map(this.session.scores, item => item)
  }

}
