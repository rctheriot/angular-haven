import { Component, Input, } from '@angular/core';

@Component({
  selector: 'app-ngxradar',
  templateUrl: './ngxradar.component.html',
  styleUrls: ['./ngxradar.component.css']
})
export class NgxradarComponent {

  @Input() data: any[];
  @Input() view: [number, number];

  colorScheme = {
    domain: [
      '#51574a', '#447c69', '#74c493',
      '#8e8c6d', '#e4bf80', '#e9d78e',
      '#e2975d', '#f19670', '#e16552',
      '#c94a53', '#be5168', '#a34974',
      '#993767', '#65387d', '#4e2472',
      '#9163b6', '#e279a3', '#e0598b',
      '#7c9fb0', '#5698c4', '#9abf88']
  };


  constructor() {
    // this.colorScheme.domain.sort(function () {
    //   return .5 - Math.random();
    // });
  };

}
