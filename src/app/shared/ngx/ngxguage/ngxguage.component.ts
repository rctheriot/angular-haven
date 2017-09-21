import { Component, Input } from '@angular/core';
import {single} from '../../data';

@Component({
  selector: 'app-ngxguage',
  templateUrl: './ngxguage.component.html',
  styleUrls: ['./ngxguage.component.css']
})
export class NgxguageComponent  {

  data: any[];

  @Input() public view: [number, number];

  colorScheme = {
    domain: ['#e2b02e', '#9757bc', '#31bc98', '#409228', '#cd4325']
  };

  constructor() {
    this.data = single;
  };

  onSelect(event) {
    console.log(event);
  }

  public resize(x, y) {
    this.view = [x - 20, y - 20];
  }
}
