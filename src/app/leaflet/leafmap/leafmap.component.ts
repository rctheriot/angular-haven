import { Component, OnInit, OnChanges, OnDestroy, ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import * as firebase from 'firebase/app'
import 'firebase/storage'

import { LeaflayersService } from '../leaflayers.service'

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.css']
})
export class LeafmapComponent implements OnInit, OnChanges, OnDestroy {

  @ViewChild('mapDiv') mapDiv;

  map: any;
  geoJson: any;

  layerkey = {};
  subscriptions = [];

  colorNumber = 0;
  colorScheme = ['#dd1c5c', '#ee7733', '#7ae380', '#40ecbe', '#44aaff', '#8844ff'];

  layer1: boolean;

  options = {
    layers: [
      //L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
    ],
    zoom: 10,
    center: L.latLng([21.440066, -157.999602])
  };

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase, private layerservice: LeaflayersService) { }

  ngOnDestroy() {
    this.subscriptions[0].unsubscribe();
  }

  ngOnInit() {
    const sub1 = this.layerservice.dod$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('dod');
      } else {
        this.removeLayer('dod');
      }
    });
    this.subscriptions.push(sub1);

    this.layerservice.flood$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('flood');
      } else {
        this.removeLayer('flood');
      }
    });

    this.layerservice.agr$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('agr');
      } else {
        this.removeLayer('agr');
      }
    });

    this.layerservice.landuse$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('land');
      } else {
        this.removeLayer('land');
      }
    });

    this.layerservice.parks$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('parks');
      } else {
        this.removeLayer('parks');
      }
    });

    this.layerservice.lava$.subscribe((newBool: boolean) => {
      if (newBool) {
        this.addLayer('lava');
      } else {
        this.removeLayer('lava');
      }
    });

  }

  ngOnChanges() {

  }

  setMap(map: L.Map) {
    this.map = map;
    this.loadMap('mapdata/DOD_Parcels.json', this.colorScheme[this.colorNumber++], 'dod');
    this.loadMap('mapdata/Flood_Zones.json', this.colorScheme[this.colorNumber++], 'flood');
    this.loadMap('mapdata/Important_Agricultural_Lands_IAL.json', this.colorScheme[this.colorNumber++], 'agr');
    this.loadMap('mapdata/Oahu_Land_Use_1998.json', this.colorScheme[this.colorNumber++], 'land');
    this.loadMap('mapdata/Parks_State_Polygon.json', this.colorScheme[this.colorNumber++], 'parks');
    this.loadMap('mapdata/Volcano_Lava_Flow_Hazard_Zones.json', this.colorScheme[this.colorNumber++], 'lava');
  }

  loadMap(mapUrl: string, c: string, key: string) {
    const geojsonFeature = {
      'type': 'FeatureCollection',
      'features': []
    };

    const storageRef = firebase.storage().ref().child(mapUrl);
    storageRef.getDownloadURL().then(url => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = (event) => {

        const features = xhr.response.features;
        features.forEach(element => {
          element.properties['name'] = mapUrl.split('/')[1];
          element.properties['popupContent'] = mapUrl.split('/')[1];
          geojsonFeature.features.push(element);

        });

        const newLayer = (L.geoJSON(geojsonFeature, {
          style: (feature) => ({ color: c }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        }));

        const index = this.layerservice.addLayer(newLayer);
        this.layerkey[key] = index;

      };
      xhr.open('GET', url);
      xhr.send();

    }).catch(function (error: any) {
      switch (error.code) {
        case 'storage/object_not_found':
          console.log('file doesnt exist');
          break;
        case 'storage/unauthorized':
          console.log('User doesnt have permission to access the object');
          break;
        case 'storage/unknown':
          console.log('Unknown error occurred, inspect the server response');
          break;
      }
    });
  }

  onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
    }
  }

  addLayer(key: string) {
    const index = this.layerkey[key];
    this.layerservice.getLayer(index).then(layer => this.map.addLayer(layer));
  }

  removeLayer(key: string) {
    const index = this.layerkey[key];
    this.layerservice.getLayer(index).then(layer => this.map.removeLayer(layer));
  }

  public resize(width: number, height: number) {
    this.mapDiv.nativeElement.style.height = height - 60 + 'px';
    this.mapDiv.nativeElement.style.width = width - 30 + 'px';
    this.map.invalidateSize();
  }

}
