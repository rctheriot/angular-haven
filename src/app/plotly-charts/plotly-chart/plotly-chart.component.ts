import { Component, ViewChild, Input, OnInit } from '@angular/core';
import * as firebase from 'firebase';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/take';

import { PlotlyQuery } from '../shared/plotlyQuery';
import { PlotlyInfo } from '../shared/plotlyInfo';
import { PlotlyChartsService } from '../service/plotly-charts.service';
@Component({
  selector: 'app-plotly-chart',
  templateUrl: './plotly-chart.component.html',
  styleUrls: ['./plotly-chart.component.css']
})
export class PlotlyChartComponent implements OnInit {

  @Input() query: PlotlyQuery;
  plotlyInfo = new PlotlyInfo();
  @ViewChild('child') childDiv;
  loaded: boolean;

  stations = [];
  plotlyData = [];

  constructor(private plotlySerivce: PlotlyChartsService) {
    this.loaded = false;
  }

  ngOnInit() {
    console.log(this.query);
    firebase.database().ref().child(`/key/`).once('value').then((stations) => {
      stations.forEach(station => {
        this.stations.push({ type: station.val().type, id: station.key });
      })
      switch (this.query.value) {
        case 'capacity':
          this.loadCapacity();
          break;
        case 'demand':
          this.loadDemand();
          break;
        case 'supply':
          this.loadSupply();
          break;
        default:
          break;
      }
    })
  }
  getStationType(id: number) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) { return this.stations[i].type; }
    }
  }

  loadCapacity() {
    const data = {};
    firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('capacity').once('value').then((years) => {
      years.forEach(year => {
        const yr = year.key;
        year.forEach(id => {
          const type = this.getStationType(id.key);
          if (!data[type]) { data[type] = {}; }
          if (!data[type][yr]) { data[type][yr] = 0; }
          data[type][yr] += Number(id.val());
        });
      });
    }).then(() => {
      switch (this.query.type) {
        case 'line':
          this.loadLineChart(data, 'Time (Year)', 'Capacity (mW)');
          break;
        case 'bar':
          // this.loadBarChart(data);
          break;
        default:
          break;
      }
    });
  }

  loadDemand() {

  }

  loadSupply() {

  }

  loadLineChart(data: Object, xaxis: string, yaxis: string) {
    const plotlyData = [];
    let minX, minY = Number.MAX_SAFE_INTEGER;
    let maxX, maxY = Number.MIN_SAFE_INTEGER;
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      const xvalues = [];
      const yvalues = [];
      for (const innerKey in data[key]) {
        if (!data[key].hasOwnProperty(innerKey)) { continue; }
        xvalues.push(innerKey);
        yvalues.push(data[key][innerKey]);
      }
      minX = Math.min(...xvalues, minX);
      minY = Math.min(...yvalues, minY);
      maxX = Math.max(...xvalues, maxX);
      maxY = Math.max(...yvalues, maxY);
      const trace = {
        x: xvalues,
        y: yvalues,
        name: key,
        mode: 'lines+markers',
        type: 'scatter',
        line: { shape: 'spline', smootheing: 0.75 },
      }
      plotlyData.push(trace);
    }
    this.plotlyInfo.data = plotlyData;
    this.plotlyInfo.title = 'Capacity';
    this.plotlyInfo.xaxisLabel = xaxis;
    this.plotlyInfo.yaxisLabel = yaxis;
    this.plotlyInfo.showLegend = true;
    this.plotlyInfo.xrange = this.plotlySerivce.getCapacityXRange([minX, maxX]);
    this.plotlyInfo.yrange = this.plotlySerivce.getCapacityYRange([minY, maxY]);
    this.loaded = true;
  }

  public resize(width: number, height: number) {
    if (this.loaded) {
      this.childDiv.resize(width, height);
    }
  }

}
