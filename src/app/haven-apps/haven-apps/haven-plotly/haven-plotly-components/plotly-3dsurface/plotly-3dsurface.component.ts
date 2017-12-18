import { Component, OnInit, OnDestroy, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'

import { PlotlyRange } from '../../haven-plotly-shared/plotlyRange';
import { PlotlyData } from '../../haven-plotly-shared/plotlyData';

import { HavenPlotlyQueryService } from '../../haven-plotly-services/haven-plotly-query.service';
import { HavenDateSelectorService } from '../../../../../haven-shared/haven-services/haven-date-selector.service';

import { HavenAppInterface } from '../../../../haven-apps-shared/haven-app-interface';

@Component({
  selector: 'app-plotly-3dsurface',
  templateUrl: './plotly-3dsurface.component.html',
  styleUrls: ['./plotly-3dsurface.component.css']
})
export class Plotly3dsurfaceComponent implements HavenAppInterface, OnInit, OnDestroy {

  appInfo: any;
  plotlyData: PlotlyData;
  rangeId: number;
  xaxis: string;
  yaxis: string;
  yticktext = null;
  ytickvals = null;

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
      this.loaded = false;
      this.appInfo.query.firestoreQuery.year = profile.year;
      this.appInfo.query.firestoreQuery.month = profile.month;
      this.appInfo.query.firestoreQuery.day = profile.day;
      this.havenPlotlyQueryService.UpdateWindowName(this.appInfo.winId, this.appInfo.query.firestoreQuery);
      this.getData();
    })
  }

  ngOnDestroy() {
    this.dateSelSub.unsubscribe();
  }

  getData() {
    this.havenPlotlyQueryService.getData(this.appInfo.query).then((data) => {
      this.plotlyData = data;
      this.plotlyData.data = [{
        z: this.formatData(this.plotlyData.data),
        type: 'surface',
        colorscale: 'Portland'
      }];
      console.log(this.plotlyData.data);
      this.createChart();
    })
  }


  formatData(data: any): any {
    const zData = [];
    let currentX = 0;
    let pastX = 1;
    for (const element in data) {
      currentX = this.parseDate(element);
      if (pastX !== currentX) { zData.push([]); }
      for (const innerElement in data[element]) {
        zData[zData.length - 1].push(data[element][innerElement]);
      }
      pastX = currentX;
    }
    return zData;
  }

  parseDate(date: string): any {
    const dArray = date.split(' ');
    if (dArray.length === 1) {
      const dateArray = dArray[0].split('-')
      if (dateArray.length === 2) {
        this.xaxis = 'Month';
        this.yaxis = 'Year';
        this.yticktext = [];
        this.ytickvals = [];
        for (let i = 0; i <= 2045 - 2016; i = i + 5) { this.ytickvals.push(i); }
        for (let i = 2016; i <= 2045; i = i + 5) { this.yticktext.push(i); }
        return dateArray[0];
      } else {
        this.xaxis = 'Day';
        this.yaxis = 'Month';
        return dateArray[1];
      }
    } else {
      const dateArray = dArray[0].split('-');
      this.xaxis = 'Hour';
      this.yaxis = 'Day';
      return dateArray[2];
    }
  }

  createChart() {
    this.loaded = true;
    this.changeDetector.detectChanges();
    const layout = {
      height: this.chartDiv.nativeElement.getBoundingClientRect().height,
      width: this.chartDiv.nativeElement.getBoundingClientRect().width,
      scene: {
        xaxis: {
          title: this.xaxis,
        },
        yaxis: {
          title: this.yaxis,
          tickvals: this.ytickvals,
          ticktext: this.yticktext,
        },
        zaxis: {
          title: 'Load'
        },
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
