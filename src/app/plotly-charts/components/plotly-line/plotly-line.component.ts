import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyQuery } from '../../shared/plotlyQuery';

@Component({
  selector: 'app-plotly-line',
  templateUrl: './plotly-line.component.html',
  styleUrls: ['./plotly-line.component.css']
})
export class PlotlyLineComponent implements OnInit {

  @Input() chartInfo: PlotlyInfo;
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  loaded = false;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.createChart();
  }

  createChart() {
    const layout = {
      margin: {
        l: 50,
        r: 30,
        b: 40,
        t: 20,
        pad: 0
      },
      xaxis: {
        title: this.chartInfo.xaxisLabel,
        range: this.chartInfo.xrange,
      },
      yaxis: {
        title: this.chartInfo.yaxisLabel,
        range: this.chartInfo.yrange,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      title: false,
      showLegend: this.chartInfo.showLegend,
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    this.loaded = true;
    this.changeDetector.detectChanges();
    this.chart = this.chartDiv.nativeElement;
    Plotly.newPlot(this.chart, this.chartInfo.data, layout);

  }

  public resize(width: number, height: number) {
    const update = {
      width: width,
      height: height,
    };

    if (this.loaded) {
      Plotly.relayout(this.chart, update);
    }

  }

}
