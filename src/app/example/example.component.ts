import { Component, OnInit, Input } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {

  dataObs: FirebaseListObservable<any[]>;
  parent: FirebaseListObservable<any[]>;
  threeObs: FirebaseListObservable<any[]>;

  tableData: any[] = [];
  chartData: any[] = [{ name: 'Load', series: [] }];
  threeData: any[] = [];
  loaded: boolean;

  constructor(private db: AngularFireDatabase) {
    this.loaded = false;
  }

  ngOnInit() {
    this.getData({ year: 2016, month: 1, day: 1 });
  }

  getData(data) {
    this.dataObs = this.db.list(`/oahu-load-e3/${data.year}/${data.month}/${data.day}`, { preserveSnapshot: true });
    this.parent = this.db.list(`/oahu-load-e3/${data.year}/${data.month}`);
    this.dataObs.subscribe(snapshots => {
      this.chartData = [{ name: `${data.day}/${data.month}/${data.year}`, series: [] }];
      this.tableData = [];
      snapshots.forEach(snapshot => {
        this.chartData[0].series.push({ name: snapshot.key, value: snapshot.val() })
        this.tableData.push({ name: snapshot.key, value: snapshot.val() });
      });
    })

     //THREEJS
    this.threeObs = this.db.list(`/test-items/`, { preserveSnapshot: true });
    this.threeObs.subscribe(snapshots => {
      snapshots.forEach(snapshot => {
          const day = [];
          snapshot.forEach(snap => {
            day.push({value: snap.val()})
          })
          this.threeData.push(day);
      })
      this.loaded = true;
    })
  }



  addData(data) {
    this.dataObs = this.db.list(`/oahu-load-e3/${data.year}/${data.month}/${data.day}`, { preserveSnapshot: true });
    this.dataObs.subscribe(snapshots => {
      const newData = { name: `${data.day}/${data.month}/${data.year}`, series: [] };
      snapshots.forEach(snapshot => {
        newData.series.push({ name: snapshot.key, value: snapshot.val() })
      });
      this.chartData.push(newData);
      this.chartData = [...this.chartData];
    })
  }

}
