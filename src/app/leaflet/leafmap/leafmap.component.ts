import { Component, ViewChild, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import * as firebase from 'firebase/app'
import 'firebase/storage'

import { LeafMapService } from '../leafmap.service'

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.css']
})
export class LeafmapComponent implements OnDestroy {

  @ViewChild('mapDiv') mapDiv;

  map: any;
  geoJson: any;

  layerkey = {};
  subscriptions = [];

  layer1: boolean;

  options = {
    layers: [
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
    ],
    zoom: 10,
    center: L.latLng([21.440066, -157.999602])
  };

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase, private leafservice: LeafMapService) { }

  setMap(map: L.Map) {
    this.map = map;
    this.leafservice.setMap(this.map);
    this.leafservice.checkActiveLayers();
  }


  public resize(width: number, height: number) {
    this.mapDiv.nativeElement.style.height = height + 'px';
    this.mapDiv.nativeElement.style.width = width + 'px';
    this.map.invalidateSize();
  }

  ngOnDestroy() {
    this.leafservice.hideMap();
  }

}
