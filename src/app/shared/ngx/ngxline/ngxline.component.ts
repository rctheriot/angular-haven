import { Component, Input, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-ngxline',
  templateUrl: './ngxline.component.html',
  styleUrls: ['./ngxline.component.css']
})
export class NgxlineComponent implements OnInit {

  dataObs: FirebaseListObservable<any[]>;
  chartData: any[] = [{ name: 'Load', series: [] }];
  loaded = false;

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = true;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Time of Day';
  showYAxisLabel = true;
  yAxisLabel = 'Energy';
  autoScale = true;

  year: number;
  month: number;
  day: number;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  @Input() public view: [number, number];

  constructor(private db: AngularFireDatabase) { }

  ngOnInit() {
    this.year = 2020;
    this.month = 2;
    this.day = 4;
    this.getData();
  }

  getData() {
    this.dataObs = this.db.list(`/oahu-load-e3/${this.year}/${this.month}/${this.day}`, { preserveSnapshot: true });
    this.dataObs.subscribe(snapshots => {
      this.chartData = [{ name: `${this.day}/${this.month}/${this.year}`, series: [] }];
      snapshots.forEach(snapshot => {
        this.chartData[0].series.push({ name: snapshot.key, value: snapshot.val() })
      });
      this.loaded = true;
    })
  }

}
