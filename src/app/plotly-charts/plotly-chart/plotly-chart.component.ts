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
  size: [number, number];
  plotlyInfo = new PlotlyInfo();
  @ViewChild('child') childDiv;
  loaded: boolean;

  stations = [];
  plotlyData = [];

  typeColors = {
    'Fossil': '#D32F2F',
    'Biofuel': '#A04000',
    'Biomass': '#1E8449',
    'Solar': '#F5B041',
    'Wind': '#8E44AD',
    'Offshore Wind': '#2E86C1',
    'Hydro': '#48C9B0',
    'Demand': '#566573',
  }

  constructor(private plotlySerivce: PlotlyChartsService) {
    this.loaded = false;
  }

  ngOnInit() {
    firebase.database().ref().child(`/key/`).once('value').then((stations) => {
      stations.forEach(station => {
        this.stations.push({ type: station.val().type, id: Number(station.key), resource: station.val().resource });
      })
    }).then(() => {
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

  loadSupply() {
    const dateQuery = `/${this.query.year}/${this.query.month}/${this.query.day}/`;
    // if (this.query.scope === 'monthly') { dateQuery += `${this.query.year}/`; }
    // if (this.query.scope === 'daily') { dateQuery += `${this.query.year}/${this.query.month}/`; }
    // if (this.query.scope === 'hourly') { dateQuery += `${this.query.year}/${this.query.month}/${this.query.day}/`; }
    const capacity = {};
    const demand = {};
    const profile = {};
    const data = {};
    firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('capacity').child(`/${this.query.year}/`).once('value').then((cap) => {
      cap.forEach(c => {
        if (!data['capacity']) { data['capacity'] = {}; }
        data['capacity'][c.key] = c.val();
      })
    }).then(() => {
      firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('demand').child(dateQuery).once('value').then((dem) => {
        dem.forEach(d => {
          if (!data['Demand']) { data['Demand'] = {}; }
          data['Demand'][d.key] = Number(d.val());
          if (!data['Fossil']) { data['Fossil'] = {}; }
          data['Fossil'][d.key] = Number(d.val());
        })
      }).then(() => {
        firebase.database().ref().child(`/profiles/`).child(dateQuery).once('value').then((prof) => {
          profile[prof.key] = prof.val();
        }).then(() => {
          for (const key in profile) {
            if (profile[key].hasOwnProperty(key)) { continue; }
            for (let i = 0; i < profile[key].length; i++) {
              const time = i;
              for (const id in data['capacity']) {
                if (data['capacity'][id].hasOwnProperty(id)) { continue; }
                const resource = this.getStationResource(Number(id));
                const type = this.getStationType(Number(id));
                if (resource === 'Fossil') { continue; }
                if (!data['capacity'][id]) { continue; }
                const percent = profile[key][time][resource];
                const cap = data['capacity'][id];
                let supply = percent * cap;
                if (Number.isNaN(supply)) { supply = 0; }
                if (!data[type]) { data[type] = {}; }
                if (!data[type][time]) { data[type][time] = 0; }
                data[type][time] += supply;
                data['Fossil'][time] -= supply;
                data['Fossil'][time] = Math.max(data['Fossil'][time], 0);

              }
            }
          }
          delete data['capacity'];
        }).then(() => {
          switch (this.query.chartType) {
            case 'line':
              this.loadSupplyChart(this.loadLineChart(data), `${this.query.scope} - Supply`, 'Time', 'Energy (MWh)');
              break;
            case 'bar':
              delete data['Demand'];
              this.loadSupplyChart(this.loadBarChart(data), `${this.query.scope} - Supply`, 'Time', 'Energy (MWh)');
              break;
            case 'heatmap':
              this.loadSupplyChart(this.loadHeatMap(data), `${this.query.scope} - Supply`, 'Time', 'Energy (MWh)');
              break;
            default:
              break;
          }
        });
      })
    });
  }

  loadSupplyChart(plotlyData: any[], title: string, xaxis: string, yaxis: string) {
    this.plotlyInfo.data = plotlyData;
    this.plotlyInfo.title = title;
    this.plotlyInfo.valueType = this.query.valueType;
    this.plotlyInfo.xaxisLabel = xaxis;
    this.plotlyInfo.yaxisLabel = yaxis;
    this.plotlyInfo.showLegend = true;
    this.plotlyInfo.rangeObs = this.plotlySerivce.supplyRangeObs;
    this.loaded = true;
  }

  loadDemand() {
    const preData = {};
    const data = {};
    let dateQuery = '/';
    if (this.query.scope === 'monthly') { dateQuery += `${this.query.year}/`; }
    if (this.query.scope === 'daily') { dateQuery += `${this.query.year}/${this.query.month}/`; }
    if (this.query.scope === 'hourly') { dateQuery += `${this.query.year}/${this.query.month}/${this.query.day}/`; }
    firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('demand').child(dateQuery).once('value').then((values) => {
      values.forEach(value => {
        let time = value.key;
        if (this.query.scope === 'monthly') { time = `${this.query.year}-${time}` }
        if (this.query.scope === 'daily') { time = `${this.query.year}-${this.query.month}-${time}` }
        if (this.query.scope === 'hourly') { time = `${this.query.year}-${this.query.month}-${this.query.day} ${time}` }
        if (!data['Demand']) { data['Demand'] = {}; }
        if (this.query.chartType === '3dsurface') {
          data['Demand'][time] = value.val();
        } else {
          data['Demand'][time] = this.arrSum(value.val());
        }
      })
    }).then(() => {
      console.log(data);
      switch (this.query.chartType) {
        case 'line':
          this.loadDemandChart(this.loadLineChart(data), `${this.query.scope} - Demand`, 'Time', 'Demand (MW)');
          break;
        case 'bar':
          this.loadDemandChart(this.loadBarChart(data), `${this.query.scope} - Demand`, 'Time', 'Demand (MW)');
          break;
        case 'heatmap':
          this.loadDemandChart(this.loadHeatMap(data), `${this.query.scope} - Demand`, 'Time', 'Demand (MW)');
          break;
        case '3dsurface':
          this.plotlyInfo.zaxisLabel = 'Demand (MW)';
          this.loadDemandChart(this.load3DSurface(data), `${this.query.scope} - Demand`, 'Hours', 'Day');
          break;
        default:
          break;
      }
    });
  }

  loadDemandChart(plotlyData: any[], title: string, xaxis: string, yaxis: string) {
    this.plotlyInfo.data = plotlyData;
    this.plotlyInfo.title = title;
    this.plotlyInfo.valueType = this.query.valueType;
    this.plotlyInfo.xaxisLabel = xaxis;
    this.plotlyInfo.yaxisLabel = yaxis;
    this.plotlyInfo.showLegend = true;
    this.plotlyInfo.rangeObs = null;
    this.loaded = true;
  }

  loadCapacity() {
    const data = {};
    firebase.database().ref().child(`/scenarios/`).child(this.query.scenario).child('capacity').once('value').then((years) => {
      years.forEach(year => {
        const yr = year.key;
        year.forEach(id => {
          const type = this.getStationType(Number(id.key));
          if (!data[type]) { data[type] = {}; }
          if (!data[type][yr]) { data[type][yr] = 0; }
          data[type][yr] += Number(id.val());
        });
      });
    }).then(() => {
      switch (this.query.chartType) {
        case 'line':
          this.loadCapacityChart(this.loadLineChart(data), `${this.query.scope} - Capacity`, 'Time', 'Capacity (MW)');
          break;
        case 'bar':
          this.loadCapacityChart(this.loadBarChart(data), `${this.query.scope} - Capacity`, 'Time', 'Capacity (MW)');
          break;
        case 'heatmap':
          this.loadCapacityChart(this.loadHeatMap(data), `${this.query.scope} - Capacity`, 'Time', 'Capacity (MW)');
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

  load3DSurface(data: Object) {
    const zvalues = [];
    const colorscaleValue = [
      [0, '#6699CC'],
      [1, '#EC5f67']
    ];

    for (const key in data) {
      if (!data.hasOwnProperty(key)) { continue; }
      for (const innerkey in data[key]) {
        if (!data[key].hasOwnProperty(innerkey)) { continue; }
        zvalues.push(data[key][innerkey]);
      }
    }
    const surfaceData = [{
      z: zvalues,
      colorscale: colorscaleValue,
      type: 'surface',
    }]
    return surfaceData;
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
    return heatData;
  }

  getStationType(id: number) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) { return this.stations[i].type; }
    }
  }

  getStationResource(id: number) {
    for (let i = 0; i < this.stations.length; i++) {
      if (this.stations[i].id === id) { return this.stations[i].resource; }
    }
  }

  arrSum(arr: any) {
    let sum = 0;
    if (arr instanceof Array) {
      arr.forEach(el => { sum += this.arrSum(el); })
    } else {
      sum += Number(arr);
    }
    return sum;
  }

  public resize(width: number, height: number) {
    this.size = [width, height];
  }

}
