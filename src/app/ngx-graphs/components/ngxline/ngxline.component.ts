import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ngxline',
  templateUrl: './ngxline.component.html',
  styleUrls: ['./ngxline.component.css']
})
export class NgxlineComponent {

  @Input() data: any[];
  @Input() xAxisLabel: string;
  @Input() yAxisLabel: string;
  @Input() view: [number, number];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  showYAxisLabel = true;
  autoScale = true;

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
    this.colorScheme.domain.sort(function() {
      return .5 - Math.random();
    });
  };


}
