import { Component, ElementRef } from '@angular/core';
import {single, multi, energy} from '../shared/data';

@Component({
  selector: 'app-ngxchart',
  templateUrl: './ngxchart.component.html',
  styleUrls: ['./ngxchart.component.css']
})
export class NgxchartComponent {
  single: any[];
  multi: any[];
  energy: any[];
  view: any[] = [500, 500];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Day';
  showYAxisLabel = true;
  yAxisLabel = 'Energy';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  // line, area
  autoScale = true;

  constructor(private el: ElementRef) {
    this.view[0] = el.nativeElement.width;
    Object.assign(this, {single, multi, energy});
  }

  onSelect(event) {
    console.log(event);
  }

}
