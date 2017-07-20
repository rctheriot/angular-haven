import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';


@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit, OnChanges {

  dataObs: FirebaseListObservable<any[]>;
  parent: FirebaseListObservable<any[]>;
  tableData: any[] = [];
  chartData: any[] = [{ name: 'Load', series: [] }];

  constructor(private db: AngularFireDatabase) {
  }

  ngOnInit() {
    this.getData({ year: 2016, month: 1, day: 1 });
  }

  ngOnChanges(changes: SimpleChanges): void {

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
