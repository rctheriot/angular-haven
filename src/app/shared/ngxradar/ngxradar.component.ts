import { Component } from '@angular/core';
import { polarData } from '../data';

@Component({
  selector: 'app-ngxradar',
  templateUrl: './ngxradar.component.html',
  styleUrls: ['./ngxradar.component.css']
})
export class NgxradarComponent {

  // options
  gradient = true;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Time of Day';
  showYAxisLabel = false;
  yAxisLabel = 'Energy';
  autoScale = false;
  xAxis = true;
  yAxis = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  polarData: Array<any>;

  constructor() {
    Object.assign(this, { polarData });
  }

}
