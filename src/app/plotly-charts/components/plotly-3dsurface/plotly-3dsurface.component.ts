import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyQuery } from '../../shared/plotlyQuery';

@Component({
  selector: 'app-plotly-3dsurface',
  templateUrl: './plotly-3dsurface.component.html',
  styleUrls: ['./plotly-3dsurface.component.css']
})
export class Plotly3dsurfaceComponent implements OnInit {

  @Input() query: PlotlyQuery;
  @ViewChild('chart') chartDiv: ElementRef;
  private chart: ElementRef
  chartInfo: PlotlyInfo;
  loaded = false;

  constructor(private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.createChart(this.query);

  }

  createChart(query: PlotlyQuery) {
    const demandArray = [];
    firebase.database().ref().child(`/scenarios/${query.scenario}/demand/${query.year}/`).once('value').then((demands) => {
      demands.forEach(month => {
        const m = month.key - 1;
        month.forEach(day => {
          const d = day.key;
          const theDailyDemand = [];
          day.forEach(hour => {
            theDailyDemand.push(hour.val());
          })
          demandArray.push(theDailyDemand);
        })
      })
      const info = new PlotlyInfo();
      info.data =  [{
        z: demandArray,
        type: 'surface'
     }];
      info.layout = {
        margin: {
          l: 30,
          r: 30,
          b: 30,
          t: 30,
          pad: 0
        },
        title: false,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)'
      }
      this.chartInfo = info;
      this.loaded = true;
      this.changeDetector.detectChanges();
      this.chart = this.chartDiv.nativeElement;
      Plotly.newPlot(this.chart, this.chartInfo.data, this.chartInfo.layout);
    })
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
