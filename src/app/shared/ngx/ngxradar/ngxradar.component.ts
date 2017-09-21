import { Component, Input, OnInit, OnChanges, SimpleChanges, SimpleChange } from '@angular/core';
import { polarData } from '../../data';

@Component({
  selector: 'app-ngxradar',
  templateUrl: './ngxradar.component.html',
  styleUrls: ['./ngxradar.component.css']
})
export class NgxradarComponent implements OnInit, OnChanges {

  // options
  gradient = true;
  showLegend = true;
  showXAxisLabel = false;
  xAxisLabel = 'Time of Day';
  showYAxisLabel = false;
  yAxisLabel = 'Energy';
  autoScale = true;
  xAxis = true;
  yAxis = true;

  @Input() public view: [number, number];

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  polarData: Array<any>;

  constructor() {
    Object.assign(this, { polarData });
  }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {
    const view: SimpleChange = changes.view;
    console.log(changes);
  }

  public resize(x, y) {
    this.view = [x - 20, y - 20];
  }

}
