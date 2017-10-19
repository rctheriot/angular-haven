import { Component, OnInit, OnDestroy, OnChanges, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyRange } from '../../shared/plotlyRange';
import { PlotlyChartsService } from '../../service/plotly-charts.service';

@Component({
  selector: 'app-plotly-3dsurface',
  templateUrl: './plotly-3dsurface.component.html',
  styleUrls: ['./plotly-3dsurface.component.css']
})
export class Plotly3dsurfaceComponent implements OnInit, OnDestroy, OnChanges {

  @Input() plotlyInfo: PlotlyInfo;
  @Input() size: [number, number];
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  loaded = false;
  rangeId: number;

  constructor(private changeDetector: ChangeDetectorRef, private chartService: PlotlyChartsService) { }

  ngOnInit() {
    this.createChart();
  }

  ngOnDestroy() {
    this.chartService.removeRange(this.rangeId, this.plotlyInfo.valueType);
  }

  createChart() {
    const layout = {
      width: this.size[0],
      height: this.size[1],
      scene: {
        xaxis: {title: this.plotlyInfo.xaxisLabel},
        yaxis: {title: this.plotlyInfo.yaxisLabel},
        zaxis: {title: this.plotlyInfo.zaxisLabel},
        },
      margin: {
        l: 20,
        r: 30,
        b: 10,
        t: 20,
        pad: 0
      },
      font: {
        family: 'Roboto, sans-serif',
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
