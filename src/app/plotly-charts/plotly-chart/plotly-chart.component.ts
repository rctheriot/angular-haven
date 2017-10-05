import { Component, ViewChild, Input } from '@angular/core';

import { PlotlyQuery } from '../shared/plotlyQuery';

@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.css']
})
export class PlotlyChartComponent  {

  @Input() query: PlotlyQuery;
  @ViewChild('child') childDiv;

  constructor() { }

  public resize(width: number, height: number) {
      this.childDiv.resize(width, height);
  }

}
