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

  typeColors = {
    'Fossil': '#2C3E50',
    'Biofuel': '#F39C12',
    'Biomass': '#2ECC71',
    'Solar': '#E74C3C',
    'Wind': '#3498DB',
    'Offshore Wind': '#8E44AD',
    'Hydro': '#1ABC9C',
  }

  constructor(private plotlySerivce: PlotlyChartsService) {
    this.loaded = false;
  }

  ngOnInit() {
    firebase.database().ref().child(`/key/`).once('value').then((stations) => {
      stations.forEach(station => {
        this.stations.push({ type: station.val().type, id: station.key });
      })
      switch (this.query.valueType) {
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

  loadDemand() {

  }

  loadSupply() {

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
      switch (this.query.chartType) {
        case 'line':
          this.loadCapacityChart(this.loadLineChart(data), `${this.query.scope} - Capacity`, 'Time (Year)', 'Capacity (MW)');
          break;
        case 'bar':
          this.loadCapacityChart(this.loadBarChart(data), `${this.query.scope} - Capacity`, 'Time (Year)', 'Capacity (MW)');
          break;
        case 'heatmap':
          this.loadCapacityChart(this.loadHeatMap(data), `${this.query.scope} - Capacity`, 'Time (Year)', 'Capacity (MW)');
          break;
        default:
          break;
      }
    });
  }

  loadCapacityChart(plotlyData: any[], title: string, xaxis: string, yaxis: string) {
    this.plotlyInfo.data = plotlyData;
    this.plotlyInfo.title = title;
    this.plotlyInfo.valueType = this.query.valueType;
    this.plotlyInfo.xaxisLabel = xaxis;
    this.plotlyInfo.yaxisLabel = yaxis;
    this.plotlyInfo.showLegend = true;
    this.plotlyInfo.rangeObs = this.plotlySerivce.capacityRangeObs;
    this.loaded = true;
  }

  loadBarChart(data: Object) {
    const plotlyData = [];
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      const xvalues = [];
      const yvalues = [];
      for (const innerKey in data[key]) {
        if (!data[key].hasOwnProperty(innerKey)) { continue; }
        xvalues.push(innerKey.toString());
        yvalues.push(Number(data[key][innerKey]));
      }
      let color = '#a9b6bc';
      if (this.typeColors[key]) { color = this.typeColors[key]; }
      const trace = {
        x: xvalues,
        y: yvalues,
        name: key,
        type: 'bar',
        marker: { color: color, }
      }
      plotlyData.push(trace);
    }
    return plotlyData;
  }

  loadLineChart(data: Object) {
    const plotlyData = [];
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      const xvalues = [];
      const yvalues = [];
      for (const innerKey in data[key]) {
        if (!data[key].hasOwnProperty(innerKey)) { continue; }
        xvalues.push(innerKey.toString());
        yvalues.push(Number(data[key][innerKey]));
      }
      let color = '#a9b6bc';
      if (this.typeColors[key]) { color = this.typeColors[key]; }
      const trace = {
        x: xvalues,
        y: yvalues,
        name: key,
        mode: 'lines+markers',
        type: 'scatter',
        line: { shape: 'spline', smootheing: 0.75, color: color },
      }
      plotlyData.push(trace);
    }
    return plotlyData;
  }

  loadHeatMap(data: Object) {
    const xvalues = [];
    const yvalues = [];
    const zvalues = [];
    const colorscaleValue = [
      [0, '#6699CC'],
      [1, '#EC5f67']
    ];

    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      if (yvalues.indexOf(key) === -1) { yvalues.push(key); }
      for (const innerKey in data[key]) {
        if (!data[key].hasOwnProperty(innerKey)) { continue; }
        if (xvalues.indexOf(innerKey) === -1) { xvalues.push(innerKey); }
      }
    }
    xvalues.sort();
    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      const zElement = [];
      xvalues.forEach(xEl => {
        if (data[key][xEl] === undefined) { zElement.push(null); } else { zElement.push(data[key][xEl]) }
      })
      zvalues.push(zElement);
    };

    const heatData = [{
      x: xvalues,
      y: yvalues,
      z: zvalues,
      colorscale: colorscaleValue,
      type: 'heatmap',
    }]
    console.log(heatData);
    return heatData;
  }

  getStationType(id: number) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) { return this.stations[i].type; }
    }
  }

  public resize(width: number, height: number) {
    if (this.loaded) {
      this.childDiv.resize(width, height);
    }
  }

}
