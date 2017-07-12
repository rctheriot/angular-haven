import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent implements OnInit {
  data: FirebaseObjectObservable<any[]>;

  constructor(private db: AngularFireDatabase) {
    this.data = db.object('/test-items');
  }

  ngOnInit() {
  }

}
