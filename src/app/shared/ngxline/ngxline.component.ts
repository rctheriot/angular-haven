import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ngxline',
  templateUrl: './ngxline.component.html',
  styleUrls: ['./ngxline.component.css']
})
export class NgxlineComponent  {

 // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time of Day';
  showYAxisLabel = true;
  yAxisLabel = 'Energy';
  autoScale = true;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  @Input() public data: Array<any>;

  constructor() {
  }

  remove(event) {
  }

}
