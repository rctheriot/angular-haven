import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gmap',
  templateUrl: './gmap.component.html',
  styleUrls: ['./gmap.component.css']
})
export class GmapComponent implements OnInit {

  title: 'My first AGM project';
  lat = 21.2969;
  lng = -157.8171;

  constructor() { }

  ngOnInit() { }

}
