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
    if (this.dbQuery === 'AllCapacity') {
      this.getCapacity();
    } else if (this.getDataType() === 'single') {
      this.getSingleData(this.dbQuery);
    } else if (this.getDataType() === 'multi') {
      this.getMultiData(this.dbQuery);
    }
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
