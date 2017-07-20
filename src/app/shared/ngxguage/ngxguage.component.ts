import { Component } from '@angular/core';
import {single} from '../../shared/data';

@Component({
  selector: 'app-ngxguage',
  templateUrl: './ngxguage.component.html',
  styleUrls: ['./ngxguage.component.css']
})
export class NgxguageComponent  {
  view: any[] = [700, 400];
  data: any[];

  colorScheme = {
    domain: ['#e2b02e', '#9757bc', '#31bc98', '#409228', '#cd4325']
  };

  constructor() {
    this.data = single;
  };

  onSelect(event) {
    console.log(event);
  }

}
