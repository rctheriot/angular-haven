import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyInfo } from '../../shared/plotlyInfo';

@Component({
  selector: 'app-plotly-heatmap',
  templateUrl: './plotly-heatmap.component.html',
  styleUrls: ['./plotly-heatmap.component.css']
})
export class PlotlyHeatmapComponent implements OnInit, OnChanges {

  @Input() plotlyInfo: PlotlyInfo;
  @Input() size: [number, number];
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
      width: this.size[0],
      height: this.size[1],
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
      showLegend: this.plotlyInfo.showLegend,
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    this.loaded = true;
    this.plotlyInfo.layout = layout;
    this.changeDetector.detectChanges();
    this.chart = this.chartDiv.nativeElement;
    Plotly.newPlot(this.chart, this.plotlyInfo.data, this.plotlyInfo.layout);

  }

  ngOnChanges(changes: SimpleChanges) {
    const size: SimpleChange = changes.size;
    this.size = size.currentValue;
    if (this.loaded) {
      const update = {
        width: this.size[0],
        height: this.size[1],
      };
      Plotly.relayout(this.chart, update);
    }
  }

}
