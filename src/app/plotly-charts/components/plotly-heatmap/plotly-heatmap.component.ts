import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyInfo } from '../../shared/plotlyInfo';

@Component({
  selector: 'app-plotly-heatmap',
  templateUrl: './plotly-heatmap.component.html',
  styleUrls: ['./plotly-heatmap.component.css']
})
export class PlotlyHeatmapComponent implements OnInit {

  @Input() chartInfo: PlotlyInfo;
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  loaded = false;

  rangeId: number;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.createChart();
  }


  createChart() {
    const layout = {
      margin: {
        l: 70,
        r: 30,
        b: 20,
        t: 30,
        pad: 0
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      yaxis: {
        tickangle: -45,
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
