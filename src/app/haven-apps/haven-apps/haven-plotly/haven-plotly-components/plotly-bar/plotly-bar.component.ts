import { Component, OnInit, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/plotlyRange';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenPlotlyRangeService } from '../../haven-plotly-services/haven-plotly-range.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';

@Component({
  selector: 'app-plotly-bar',
  templateUrl: './plotly-bar.component.html',
  styleUrls: ['./plotly-bar.component.css']
})
export class PlotlyBarComponent implements HavenAppInterface, OnInit {

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

  formatData(data: any): PlotlyBarTrace[] {
    const newData = [];
    for (const element in data) {
      const x = element;
      for (const innerElement in data[element]) {
        const traceName = innerElement;
        let trace = newData.find(el => el.name === traceName);
        if (!trace) {
          trace = new PlotlyBarTrace(traceName, this.havenPlotlyQueryService.plotlyColors[traceName]);
          newData.push(trace);
        }
        const y = data[element][traceName];
        trace.addDataPoint(x, y);
      }
    }
    return newData;
  }

  createChart() {
    this.loaded = true;
    this.changeDetector.detectChanges();
    const layout = {
      height: this.chartDiv.nativeElement.getBoundingClientRect().height,
      width: this.chartDiv.nativeElement.getBoundingClientRect().width,
      xaxis: {
        title: this.plotlyData.xAxisLabel,
      },
      yaxis: {
        title: this.plotlyData.yAxisLabel,
      },
      margin: {
        t: 50,
        l: 55,
        r: 20,
        b: 35,
      },
      font: {
        family: 'Roboto, sans-serif',
      },
      title: this.plotlyData.title,
      hovermode: 'closest',
      paper_bgcolor: 'rgba(0,0,0,0)',
      plot_bgcolor: 'rgba(0,0,0,0)',
      barmode: 'stack'
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

class PlotlyBarTrace {
  x: any[];
  y: any[];
  name: string;
  type: string;
  marker: any;

  constructor(name: string, color: string) {
    this.x = [];
    this.y = [];
    this.type = 'bar';
    this.name = name;
    this.marker = { color: color };
  }

  addDataPoint(x: any, y: any) {
    this.x.push(x);
    this.y.push(y);
  }
}