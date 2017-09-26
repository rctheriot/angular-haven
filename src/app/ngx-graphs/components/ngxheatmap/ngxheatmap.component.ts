import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ngxheatmap',
  templateUrl: './ngxheatmap.component.html',
  styleUrls: ['./ngxheatmap.component.css']
})
export class NgxheatmapComponent  {

  @Input() data: any[];
  @Input() view: [number, number];

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'Population';

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor() {

    console.log(this.data);
   }

}
