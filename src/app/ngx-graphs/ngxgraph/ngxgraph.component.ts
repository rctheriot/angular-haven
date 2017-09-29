import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs/Rx'
import 'rxjs/add/operator/take';
import * as firebase from 'firebase';

import { SingleData } from '../shared/singledata';
import { MultiData } from '../shared/multidata';

import { NgxguageComponent } from '../components/ngxguage/ngxguage.component';
import { NgxlineComponent } from '../components/ngxline/ngxline.component';
import { NgxradarComponent } from '../components/ngxradar/ngxradar.component';

@Component({
  selector: 'app-ngxgraph',
  templateUrl: './ngxgraph.component.html',
  styleUrls: ['./ngxgraph.component.css']
})
export class NgxgraphComponent implements OnInit {

  @Input() dataType: string;
  @Input() view: [number, number];
  @Input() dbQuery: string;
  @Input() type: string;

  graphData: any[];
  loaded: boolean;

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.loaded = false;
    this.graphData = [];
    const parse = this.dbQuery.split('/');
    const scenario = parse[1];
    const year = parseInt(parse[2], 10);
    const month = parseInt(parse[3], 10);
    const day = parseInt(parse[4], 10);
    this.createDayGraph(scenario, year, month, day);
  }

  createDayGraph(scenario: string, year: number, month: number, day: number) {

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
      firebase.database().ref().child(`/scenarios/${scenario}/capacity/${year}`).once('value').then((capacities) => {
        capacities.forEach(capacity => {
          capacityArray.push({ 'value': capacity.val(), 'id': capacity.key });
        })
      }).then(() => {
        firebase.database().ref().child(`/profiles/${year}/${month}/${day}/`).once('value').then((profiles) => {
          profiles.forEach(profile => {
            const value = profile.val();
            value['hour'] = profile.key;
            profileArray.push(value);
          })
        }).then(() => {
          firebase.database().ref().child(`/scenarios/${scenario}/demand/${year}/${month}/${day}/`).once('value').then((demands) => {
            demands.forEach(demand => {
              demandArray.push({ 'name': demand.key, 'value': Number(demand.val()) });
              fossilArray.push({ 'name': demand.key, 'value': Number(demand.val()) });
            })
          }).then(() => {
            data.push(this.makeMulti('Demand', demandArray));
            capacityArray.forEach(capacity => {
              const id = capacity.id;
              const cap = capacity.value;
              let resource = null;
              const hourlySupply = [];
              stationArray.forEach(station => {
                if (station.id === id) {
                  resource = station.resource;
                }
              })
              profileArray.forEach(profile => {
                const hour = profile['hour'];
                let supply = cap * Number(profile[resource]);
                if (isNaN(supply) || supply < 0 ) { supply = 0; }
                hourlySupply.push({ 'name': profile['hour'], 'value': Number(supply) });
                fossilArray.forEach(fossil => {
                  if (fossil['name'] === hour) {
                    if (!isNaN(supply)) {
                      fossil['value'] -= supply;
                    }
                  }
                })
              })
              if (resource !== 'Fossil') {
                data.push(this.makeMulti(`${resource} - ${id}`, hourlySupply));
              }
            })
            data.push(this.makeMulti('Fossil', fossilArray));
            this.graphData = data;
            this.loaded = true;
          });
        });
      });
    });
  }

  makeMulti(name: string, series: any[]) {
    return {
      'name': name,
      'series': series,
    }
  }

  public resize(width: number, height: number) {
    this.view = [width - 20, height - 50];
  }

  getDataType() {
    if (
      this.type === 'line' ||
      this.type === 'radar' ||
      this.type === 'heatmap') {
      return 'multi';
    } else {
      return 'single';
    }
  }

}
