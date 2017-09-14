import { Component, OnInit  } from '@angular/core';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { Chart } from '../shared/chart';
import { ChartServiceService } from '../shared/chart-service.service';

@Component({
  selector: 'app-example2',
  templateUrl: './example2.component.html',
  styleUrls: ['./example2.component.css'],
  providers: [ChartServiceService]
})
export class Example2Component implements OnInit {

  dataObs: FirebaseListObservable<any[]>;
  parent: FirebaseListObservable<any[]>;
  threeObs: FirebaseListObservable<any[]>;

  tableData: any[] = [];
  chartData: any[] = [{ name: 'Load', series: [] }];
  threeData: any[] = [];
  loaded: boolean;

  charts: Chart[];
  chartTypes = ['line', 'guage',
  'radar'];

  model = new Chart();

  constructor(private db: AngularFireDatabase, private chartService: ChartServiceService) {
    this.loaded = false;
  }

  ngOnInit() {
    this.getData({ year: 2016, month: 1, day: 1 });
    this.getCharts();
  }

  getCharts() {
    this.chartService.getCharts().then(charts => this.charts = charts);
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
      setTimeout(() => { this.loaded = true; }, 1000);
      ;
    })

  }

  createChart() {
    this.chartService.addChart(this.model.name, this.model.type);
  }


}
