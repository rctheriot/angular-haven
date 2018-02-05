import { Component, OnInit, OnDestroy, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/haven-range';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';
import { PlotlyQuery } from '../../haven-plotly-shared/plotlyQuery';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenDateSelectorService } from '../../../../../haven-shared/haven-services/haven-date-selector.service';
import { HavenPlotlyRangeService } from '../../haven-plotly-services/haven-plotly-range.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';
import { isUndefined } from 'util';

@Component({
  selector: 'app-plotly-bar',
  templateUrl: './plotly-bar.component.html',
  styleUrls: ['./plotly-bar.component.css']
})
export class PlotlyBarComponent implements HavenAppInterface, OnInit, OnDestroy {

  appInfo: any;
  plotlyData: PlotlyData;
  rangeId: number;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  dateSelSub: any;

  rangeSub: any;
  rangeName: string;
  plotlyRange: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private havenPlotlyQueryService: HavenPlotlyQueryService,
    private havenPlotlyRangeService: HavenPlotlyRangeService,
    private havenDateSelectorService: HavenDateSelectorService) { }

  ngOnInit() {
    this.getData();
    this.dateSelSub = this.havenDateSelectorService.ScenarioProfilesSubs[this.appInfo.query.firestoreQuery.scenario].subscribe((profile) => {
      if (!this.appInfo.windowLock) {
        this.loaded = false;
        this.appInfo.query.firestoreQuery.year = profile.year;
        this.appInfo.query.firestoreQuery.month = profile.month;
        this.appInfo.query.firestoreQuery.day = profile.day;
        this.havenPlotlyQueryService.UpdateWindowName(this.appInfo.winId, this.appInfo.query.firestoreQuery);
        this.getData();
      }
    })
  }

  ngOnDestroy() {
    this.dateSelSub.unsubscribe();
    this.havenPlotlyRangeService.removeRange(this.rangeName, this.plotlyRange.id);
    this.rangeSub.unsubscribe();
  }

  getData() {
    this.havenPlotlyQueryService.getData(this.appInfo.query).then((data) => {
      this.plotlyData = data;
      this.plotlyData.data = this.formatData(this.plotlyData.data);
      this.createChart();
    })
  }

  formatData(data: any): PlotlyBarTrace[] {
    const newData = [];
    const xRange = [];
    const yRange = [];
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
    newData.forEach((el) => {
      for (let i = 0; i < el.y.length; i++) {
        yRange.push(0);
      }
      for (let i = 0; i < el.y.length; i++) {
        yRange[i] += Number(el.y[i]);
      }
    })
    if (!isUndefined(this.plotlyRange)) { this.havenPlotlyRangeService.removeRange(this.rangeName, this.plotlyRange.id); }
    this.plotlyRange = new PlotlyRange(null, [0, 0], [Math.min(...yRange), Math.max(...yRange)]);
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

    this.rangeName = this.appInfo.query.firestoreQuery.type + this.appInfo.query.firestoreQuery.scope + 'bar';
    this.plotlyRange.id = this.havenPlotlyRangeService.addRange(this.rangeName, this.plotlyRange);
    this.rangeSub = this.havenPlotlyRangeService.getRangeObserver(this.rangeName).subscribe((rangeInfo) => {
      const update = { 'yaxis.range': rangeInfo.yrange  };
      if (!isUndefined(this.chartDiv)) {
        Plotly.relayout(this.chartDiv.nativeElement, update)
      }
    })
    this.havenPlotlyRangeService.updateRange(this.rangeName);

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
