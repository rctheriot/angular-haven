import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/plotlyRange';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenPlotlyRangeService } from '../../haven-plotly-services/haven-plotly-range.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';

@Component({
  selector: 'app-plotly-heatmap',
  templateUrl: './plotly-heatmap.component.html',
  styleUrls: ['./plotly-heatmap.component.css']
})
export class PlotlyHeatmapComponent implements HavenAppInterface, OnInit {

  appInfo: any;
  plotlyData: PlotlyData;
  rangeId: number;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  constructor(private changeDetector: ChangeDetectorRef, private havenPlotlyQueryService: HavenPlotlyQueryService, private havenPlotlyRangeService: HavenPlotlyRangeService) { }

  ngOnInit() {
    this.havenPlotlyQueryService.getData(this.appInfo.query).then((data) => {
      this.plotlyData = data;
      this.plotlyData.data = this.formatData(this.plotlyData.data);
      this.createChart();
    })
  }

  formatData(data: any): any {
    const newData = [{
      z: [],
      x: [],
      y: [],
      xgap: 1,
      ygap: 1,
      type: 'heatmap',
      colorscale: 'Portland'
    }];
    const traces = [];
    for (const element in data) {
      const x = element;
      newData[0].x.push(x);
      for (const innerElement in data[element]) {
        const traceName = innerElement;
        let trace = traces.find(el => el.name === traceName);
        if (!trace) {
          trace = new HeatmapTrace(traceName);
          traces.push(trace);
        }
        trace.name = traceName;
        trace.addDataPoint(data[element][traceName]);
      }
    }
    traces.forEach(el => {
      newData[0].y.push(el.name);
      newData[0].z.push(el.z);
    })
    return newData;
  }

  createChart() {
    this.loaded = true;
    this.changeDetector.detectChanges();
    const layout = {
      height: this.chartDiv.nativeElement.getBoundingClientRect().height,
      width: this.chartDiv.nativeElement.getBoundingClientRect().width,
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
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)'
    }
    Plotly.newPlot(this.chartDiv.nativeElement, this.plotlyData.data, layout);

  }

  resize() {
    if (this.loaded) {
      const update = {
        height: this.chartDiv.nativeElement.getBoundingClientRect().height,
        width: this.chartDiv.nativeElement.getBoundingClientRect().width
      };
      Plotly.relayout(this.chartDiv.nativeElement, update);
    }
  }

}

class HeatmapTrace {
  z: any[];
  name: string;

  constructor(name: string) {
    this.z = [];
  }

  addDataPoint(z: any) {
    this.z.push(z);
  }

}
