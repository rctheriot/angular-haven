import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

import { AngularFireAuth } from 'angularfire2/auth'
import { AngularFireDatabase } from 'angularfire2/database'
import * as firebase from 'firebase/app'
import 'firebase/storage'

@Component({
  selector: 'app-leafmap',
  templateUrl: './leafmap.component.html',
  styleUrls: ['./leafmap.component.css']
})
export class LeafmapComponent implements OnInit {

  @ViewChild('mapDiv') mapDiv;

  map: any;
  geoJson: any;

  colorNumber = 0;
  colorScheme = [ '#dd1c5c', '#ee7733', '#7ae380', '#40ecbe', '#44aaff', '#8844ff'];

  options = {
    layers: [
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
    ],
    zoom: 10,
    center: L.latLng([21.440066, -157.999602])
  };

  constructor(private afAuth: AngularFireAuth, private afDb: AngularFireDatabase) { }

  ngOnInit() {

  }

  setMap(map: L.Map) {
    this.map = map;
    this.loadMap('mapdata/DOD_Parcels.json', this.colorScheme[this.colorNumber++]);
    this.loadMap('mapdata/Flood_Zones.json', this.colorScheme[this.colorNumber++]);
    this.loadMap('mapdata/Important_Agricultural_Lands_IAL.json', this.colorScheme[this.colorNumber++]);
    this.loadMap('mapdata/Oahu_Land_Use_1998.json', this.colorScheme[this.colorNumber++]);
    this.loadMap('mapdata/Parks_State_Polygon.json', this.colorScheme[this.colorNumber++]);
    this.loadMap('mapdata/Volcano_Lava_Flow_Hazard_Zones.json', this.colorScheme[this.colorNumber++]);
  }

  loadMap(mapUrl: string, c: string) {
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

        L.geoJSON(geojsonFeature, {
          style: (feature) => ({ color: c }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) } ,
        }
        ).addTo(this.map);
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



  public resize(width: number, height: number) {
    this.mapDiv.nativeElement.style.height = height - 60 + 'px';
    this.mapDiv.nativeElement.style.width = width - 30 + 'px';
    this.map.invalidateSize();
  }

}
