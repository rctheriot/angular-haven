import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

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

  dataObs: FirebaseListObservable<any[]>;
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

    // Get Key Reference
    const key = this.db.list('/key/', { preserveSnapshot: true });

    // Get all stations
    key.subscribe(stations => {
      stations.forEach(station => {
        if (station.child('resource').val() === 'Fossil') { return; }
        stationArray.push({ id: station.key, resource: station.child('resource').val() });
      });

      // Get each stations Capacity
      stationArray.forEach(el => {
        const capacity = this.db.object(`/scenarios/${scenario}/capacity/${el.id}/${year}`, { preserveSnapshot: true });
        capacity.subscribe(snapshot => {
          let cap = snapshot.val()
          if (cap == null) { cap = 0; }
          el['capacity'] = cap;
        })
      })

      // Get each stations Profile and Supply
      stationArray.forEach(el => {
        const profile = this.db.object(`/scenarios/${scenario}/profile/${el.resource}/${year}/${month}/${day}/`, { preserveSnapshot: true });
        el['profile'] = [];
        el['supply'] = [];
        profile.subscribe(snapshots => {
          snapshots.forEach(hr => {
            let prof = hr.val()
            if (prof == null) { prof = 0; }
            el['profile'].push({ [hr.key]: prof });
            el['supply'].push({ 'name': hr.key, 'value': Number(prof * el.capacity) });
          })
        })
      })

      // Obtain the hourly Demand and fossil supply
      const demandObj = {
        'name': 'Demand',
        'series': [],
      }
      const fossilObj = {
        'name': 'Fossil',
        'series': [],
      }
      const demand = this.db.object(`/scenarios/${scenario}/demand//${year}/${month}/${day}/`, { preserveSnapshot: true });
      demand.subscribe(snapshots => {
        snapshots.forEach(dem => {
          let hourDemand = dem.val();
          const hr = dem.key;
          demandObj['series'].push({ 'name': hr, 'value': hourDemand });

          // Get Fossil hourly supply  = Demand - RenewableSupply
          stationArray.forEach(el => {
            el['supply'].forEach(stationhoursupply => {
              if (stationhoursupply['name'] == hr) {
                hourDemand -= stationhoursupply['value'];
              }
            })
          });
          fossilObj['series'].push({ 'name': hr, 'value': hourDemand });
        })
      })

      this.graphData.push(demandObj);
      this.graphData.push(fossilObj);
      stationArray.forEach(el => {
        this.graphData.push({
          'name': el.resource + ' : ' + el.id,
          'series': el['supply'],
        });
      });

      setTimeout(() => { this.loaded = true; }, 1000);

    })

  }

  getMultiData(dataQuery: string) {
    this.dataObs = this.db.list(dataQuery, { preserveSnapshot: true });
    this.dataObs.subscribe(snapshots => {
      //
      const name = dataQuery.split('/')[3] + '/' + dataQuery.split('/')[4] + '/' + dataQuery.split('/')[5];
      //
      const data = new MultiData(name);
      snapshots.forEach(snapshot => {
        const snapData = new SingleData(snapshot.key);
        snapData.value = snapshot.val();
        data.series.push(snapData);
      });
      this.graphData.push(data);
      this.loaded = true;
    })
  }

  getSingleData(dataQuery: string) {
    this.dataObs = this.db.list(dataQuery, { preserveSnapshot: true });
    this.dataObs.subscribe(snapshots => {
      const data = [];
      snapshots.forEach(snapshot => {
        const snapData = new SingleData(snapshot.key);
        snapData.value = snapshot.val();
        data.push(snapData);
      });
      data.forEach(el => {
        this.graphData.push(el);
      })
      this.loaded = true;
    })
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

  getCapacity() {
    this.dataObs = this.db.list('/e3genmod/capacity', { preserveSnapshot: true });
    this.dataObs.subscribe(snapshots => {
      const data = []
      snapshots.forEach(snapshot => {
        const innerdata = new MultiData(snapshot.child('station').val());
        snapshot.child('capacity').forEach(yearsnap => {
          const snapData = new SingleData(yearsnap.key);
          snapData.value = yearsnap.val();
          innerdata.series.push(snapData);
        });
        data.push(innerdata);
      });
      data.forEach(el => {
        this.graphData.push(el);
      })
      this.loaded = true;
    });
  }

}
