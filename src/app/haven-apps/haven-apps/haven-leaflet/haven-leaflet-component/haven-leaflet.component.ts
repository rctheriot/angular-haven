import { Component, ViewChild, OnDestroy } from '@angular/core';
import * as L from 'leaflet';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import * as firebase from 'firebase/app'
import 'firebase/storage'

import { HavenLeafletService } from '../haven-leaflet-services/haven-leaflet.service'

import { HavenAppInterface } from '../../../haven-apps-shared/haven-app-interface';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css']
})
export class HavenLeafletComponent implements HavenAppInterface, OnDestroy {

  appInfo: any;

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

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase, private havenLeafletService: HavenLeafletService) { }

  setMap(map: L.Map) {
    this.map = map;
    this.havenLeafletService.setMap(this.map);
    this.havenLeafletService.checkActiveLayers();
  }


  resize() {
    this.map.invalidateSize();
  }

  ngOnDestroy() {
    this.havenLeafletService.hideMap();
  }

}
