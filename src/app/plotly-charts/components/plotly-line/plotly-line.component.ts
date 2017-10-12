import { Component, OnInit, ViewChild, Input, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';

import { PlotlyInfo } from '../../shared/plotlyInfo';
import { PlotlyQuery } from '../../shared/plotlyQuery';

@Component({
  selector: 'app-plotly-line',
  templateUrl: './plotly-line.component.html',
  styleUrls: ['./plotly-line.component.css']
})
export class PlotlyLineComponent implements OnInit {

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

    const stationArray = [];
    const capacityArray = [];
    const profileArray = [];
    const demandArray = [];
    const fossilArray = []
    const data = [];

    firebase.database().ref().child(`/key/`).once('value').then((stations) => {
      stations.forEach(station => {
        const sta = station.val();
        sta['id'] = station.key;
        stationArray.push(sta);
      })
    }).then(() => {
      firebase.database().ref().child(`/scenarios/${query.scenario}/capacity/${query.year}`).once('value').then((capacities) => {
        capacities.forEach(capacity => {
          capacityArray.push({ 'value': capacity.val(), 'id': capacity.key });
        })
      }).then(() => {
        firebase.database().ref().child(`/profiles/${query.year}/${query.month}/${query.day}/`).once('value').then((profiles) => {
          profiles.forEach(profile => {
            const value = profile.val();
            value['hour'] = profile.key;
            profileArray.push(value);
          })
        }).then(() => {
          firebase.database().ref().child(`/scenarios/${query.scenario}/demand/${query.year}/${query.month}/${query.day}/`).once('value').then((demands) => {
            demands.forEach(demand => {
              demandArray.push({ 'name': demand.key, 'value': Number(demand.val()) });
              fossilArray.push({ 'name': demand.key, 'value': Number(demand.val()) });
            })
          }).then(() => {

            const info = new PlotlyInfo();
            capacityArray.forEach(capacity => {
              const id = capacity.id;
              const cap = capacity.value;
              let resource = null;
              const hourlySupply = [];

              const newLine = {
                x: [],
                y: [],
                mode: 'lines+markers',
                type: 'scatter',
                line: { shape: 'spline', smootheing: 0.75 },
              }

              stationArray.forEach(station => {
                if (station.id === id) {
                  resource = station.resource;
                }
              })
              profileArray.forEach(profile => {
                const hour = profile['hour'];
                let supply = cap * Number(profile[resource]);
                if (isNaN(supply) || supply < 0) { supply = 0; }
                //fossilArray.


                newLine.x.push(hour);
                newLine.y.push(Number(supply));
                newLine['name'] = resource;

              })
              if (resource !== 'Fossil') {
                data.push(newLine);
              }
            })

            info.data = data;
            info.layout = {
              margin: {
                l: 30,
                r: 30,
                b: 30,
                t: 30,
                pad: 0
              },
              title: false,
              hovermode: 'closest',
              paper_bgcolor: 'rgba(0,0,0,0)',
              plot_bgcolor: 'rgba(0,0,0,0)'
            }

            this.chartInfo = info;
            this.loaded = true;
            this.changeDetector.detectChanges();
            this.chart = this.chartDiv.nativeElement;
            Plotly.newPlot(this.chart, this.chartInfo.data, this.chartInfo.layout);

          });
        });
      });
    });
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
