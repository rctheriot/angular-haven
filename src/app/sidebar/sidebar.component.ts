import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  solarActive: boolean;
  windActive: boolean;
  hydroActive: boolean;
  bioActive: boolean;
  oilActive: boolean;
  curtActive: boolean;
  geneActive: boolean;
  storActive: boolean;
  landActive: boolean;
  loaded: boolean;

  year = 2016;
  month = 1;
  day = 1;

  @Output()add = new EventEmitter<object>();
  @Output()reset = new EventEmitter<object>();


  constructor() { }

  ngOnInit() {
    this.solarActive = false;
    this.windActive = false;
    this.hydroActive = false;
    this.bioActive = false;
    this.oilActive = false;
    this.loaded = false;

  }

  addDataRequest() {
    this.add.emit({year: this.year, month: this.month, day: this.day});
  }

  resetData() {
     this.reset.emit({year: this.year, month: this.month, day: this.day});
  }

  solarClicked() {
    this.solarActive = !this.solarActive;
  }
  windClicked() {
    this.windActive = !this.windActive;
  }
  hydroClicked() {
    this.hydroActive = !this.hydroActive;
  }
  bioClicked() {
    this.bioActive = !this.bioActive;
  }
  oilClicked() {
    this.oilActive = !this.oilActive;
  }
  curtClicked() {
    this.curtActive = !this.curtActive;
  }
  geneClicked() {
    this.geneActive = !this.geneActive;
  }
  storClicked() {
    this.storActive = !this.storActive;
  }
  landClicked() {
    this.landActive = !this.landActive;
  }

}
