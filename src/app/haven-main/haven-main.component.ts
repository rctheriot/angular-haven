import { Component, OnInit, ViewChild } from '@angular/core';

import { HavenLeafletService } from '../haven-apps/haven-apps/haven-leaflet/haven-leaflet-services/haven-leaflet.service';


@Component({
  selector: 'app-haven-main',
  templateUrl: './haven-main.component.html',
  styleUrls: ['./haven-main.component.css']
})
export class HavenMainComponent implements OnInit {

  constructor(private havenLeafletService: HavenLeafletService) { }

  ngOnInit() {
    document.addEventListener('contextmenu', (e) => {
      // e.preventDefault();
    })
  }

}
