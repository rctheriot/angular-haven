import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.css']
})
export class LeafmapComponent implements OnInit {

  @ViewChild('mapDiv') mapDiv;

  map: any;
  options = {
    layers: [
      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
    ],
    zoom: 5,
    center: L.latLng([46.879966, -121.726909])
  };

  constructor() { }

  ngOnInit() {
  }

  setMap(map: L.Map) {
    this.map = map;
  }

  public resize(width: number, height: number) {
    this.mapDiv.nativeElement.style.height = height - 50 + 'px';
    this.mapDiv.nativeElement.style.width = width - 50 + 'px';
    this.map.invalidateSize();
  }

}
