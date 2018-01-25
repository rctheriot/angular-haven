import { Component, OnInit, OnDestroy, SimpleChanges, SimpleChange, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/plotlyRange';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';
import { PlotlyQuery } from '../../haven-plotly-shared/plotlyQuery';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenDateSelectorService } from '../../../../../haven-shared/haven-services/haven-date-selector.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';
import { HavenFirestoreQuery } from 'app/haven-shared/haven-services/haven-firestore-query';

@Component({
  selector: 'app-plotly-line',
  templateUrl: './plotly-line.component.html',
  styleUrls: ['./plotly-line.component.css']
})
export class PlotlyLineComponent implements HavenAppInterface, OnInit, OnDestroy {

  appInfo: any;
  plotlyData: PlotlyData;
  rangeId: number;

  @ViewChild('chart') chartDiv: ElementRef;
  loaded = false;

  dateSelSub: any;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private havenPlotlyQueryService: HavenPlotlyQueryService,
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
  }

  getData() {
    this.havenPlotlyQueryService.getData(this.appInfo.query).then((data) => {
      this.plotlyData = data;
      this.plotlyData.data = this.formatData(this.plotlyData.data);
      this.createChart();
    })
  }

  formatData(data: any): PlotlyLineTrace[] {
    const newData = [];
    for (const element in data) {
      const x = element;
      for (const innerElement in data[element]) {
        const traceName = innerElement;
        let trace = newData.find(el => el.name === traceName);
        if (!trace) {
          trace = new PlotlyLineTrace(traceName, this.havenPlotlyQueryService.plotlyColors[traceName]);
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
      plot_bgcolor: 'rgba(0,0,0,0)'
    }

    Plotly.newPlot(this.chartDiv.nativeElement, this.plotlyData.data, layout);

    if (this.appInfo.query.firestoreQuery.type === 'supply' || this.appInfo.query.firestoreQuery.type === 'load') {
      this.chartDiv.nativeElement.on('plotly_click', (data) => {
        let scope = this.appInfo.query.firestoreQuery.scope;
        let title = '';
        const queryClone = JSON.parse(JSON.stringify(this.appInfo.query.firestoreQuery)) as HavenFirestoreQuery;
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        if (scope === 'yearly') {
          const year = Number(data.points[0].x);
          queryClone.year = year;
          scope = 'monthly';
          title = `${queryClone.scenario.toUpperCase()} ${queryClone.type} - ${year}`;
        } else if (scope === 'monthly') {
          const year = Number(data.points[0].x.split('-')[0]);
          const month = Number(data.points[0].x.split('-')[1]);
          queryClone.year = year;
          queryClone.month = month;
          scope = 'daily';
          title = `${queryClone.scenario.toUpperCase()} ${queryClone.type} - ${monthNames[month]} ${year}`;
        } else if (scope === 'daily') {
          const year = Number(data.points[0].x.split('-')[0]);
          const month = Number(data.points[0].x.split('-')[1]);
          const day = Number(data.points[0].x.split('-')[2]);
          queryClone.year = year;
          queryClone.month = month;
          queryClone.day = day;
          scope = 'hourly';
          title = `${queryClone.scenario.toUpperCase()} ${queryClone.type} - ${monthNames[month]} ${day}, ${year}`;
        } else {
          return;
        };

        queryClone.scope = scope;
        this.havenPlotlyQueryService.createPlotlyWindow(queryClone, title);
      });
    }
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

class PlotlyLineTrace {
  x: any[];
  y: any[];
  name: string;
  type: string;
  line: any;

  constructor(name: string, color: string) {
    this.x = [];
    this.y = [];
    this.type = 'lines';
    this.name = name;
    this.line = { width: 3, color: color };
  }

  addDataPoint(x: any, y: any) {
    this.x.push(x);
    this.y.push(y);
  }

}
