import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  solarActive: boolean;
  windActive: boolean;
  hydroActive: boolean;
  bioActive: boolean;
  oilActive: boolean;
  curtActive: boolean;
  geneActive: boolean;
  storActive: boolean;
  landActive: boolean;
  data: FirebaseObjectObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.data = db.object('/test-items');
  }

  ngOnInit() {
    this.solarActive = false;
    this.windActive = false;
    this.hydroActive = false;
    this.bioActive = false;
    this.oilActive = false;
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
