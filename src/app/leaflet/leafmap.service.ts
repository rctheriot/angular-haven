import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as L from 'leaflet';
import * as firebase from 'firebase/app'
import 'firebase/storage'

@Injectable()
export class LeafMapService {

  layers = [];
  layersObs = new Subject();

  mapEnabled: boolean;
  mapEnabledObs = new Subject<boolean>();

  leafmap: any;
  colorNumber = 0;
  colorScheme = ['#dd1c5c', '#ee7733', '#7ae380', '#40ecbe', '#44aaff', '#8844ff', '#8844ff'];

  constructor() {
    this.mapEnabled = false;
    this.mapEnabledObs.next(this.mapEnabled);
    this.loadFeatureLayer('mapdata/DOD_Parcels.json', this.colorScheme[this.colorNumber++], 'DOD');
    this.loadFeatureLayer('mapdata/Flood_Zones.json', this.colorScheme[this.colorNumber++], 'Flood Zones');
    this.loadFeatureLayer('mapdata/Important_Agricultural_Lands_IAL.json', this.colorScheme[this.colorNumber++], 'Agricultural');
    this.loadFeatureLayer('mapdata/Oahu_Land_Use_1998.json', this.colorScheme[this.colorNumber++], 'Land Use');
    this.loadFeatureLayer('mapdata/Parks_State_Polygon.json', this.colorScheme[this.colorNumber++], 'State Parks');
    this.loadFeatureLayer('mapdata/Volcano_Lava_Flow_Hazard_Zones.json', this.colorScheme[this.colorNumber++], 'Lava Flow');
    this.loadGeometryLayer('mapdata/PVdoc.json', this.colorScheme[this.colorNumber++], 'PV Doc');
  }

  hideMap() {
    this.mapEnabled = false;
    this.mapEnabledObs.next(this.mapEnabled);
  }

  showMap() {
    this.mapEnabled = true;
    this.mapEnabledObs.next(this.mapEnabled);
  }

  addLayer(layer: any) {
    this.layers.push(layer);
    this.layersObs.next(this.layers);
  }

  setMap(map: any) {
    this.leafmap = map;
  }

  checkActiveLayers() {
    this.layers.forEach(el => {
      if (el.active) {
        this.leafmap.addLayer(el.layer);
      }
    });
  }

  hideLayer(layername: any) {
    this.layers.forEach(el => {
      if (el.name === layername) {
        el.active = false;
        this.leafmap.removeLayer(el.layer);
      }
    });
  }

  showLayer(layername: any) {
    this.layers.forEach(el => {
      if (el.name === layername) {
        el.active = true;
        this.leafmap.addLayer(el.layer);
      }
    });
  }

  loadGeometryLayer(mapUrl: string, color: string, name: string) {
    const geojsonFeature = {
      'type': 'GeometryColleciton',
      'features': []
    };

    const storageRef = firebase.storage().ref().child(mapUrl);
    storageRef.getDownloadURL().then(url => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = (event) => {

        const geometries = xhr.response.geometries;
        geometries.forEach(element => {
          geojsonFeature.features.push(element);

        });

        const newLayer = (L.geoJSON(geojsonFeature, {
          style: (feature) => ({ color: color }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        }));

      this.addLayer({name: name, layer: newLayer, active: false});

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

  loadFeatureLayer(mapUrl: string, color: string, name: string) {
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
          style: (feature) => ({ color: color }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        }));

      this.addLayer({name: name, layer: newLayer, active: false});

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


}
