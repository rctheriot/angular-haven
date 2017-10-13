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
  colorScheme = ['#EC5f67', '#F99157', '#FAC863', '#99C794', '#6699CC', '#C594C5', '#AB7967'];

  constructor() {
    this.mapEnabled = false;
    this.mapEnabledObs.next(this.mapEnabled);
    this.loadFeatureLayer('mapdata/DOD_Parcels.json', 'DOD', 0);
    this.loadGeometryLayer('mapdata/PVdoc.json', 'PV Doc', 1);
    this.loadFeatureLayer('mapdata/Volcano_Lava_Flow_Hazard_Zones.json', 'Lava Flow', 2);
    this.loadFeatureLayer('mapdata/Important_Agricultural_Lands_IAL.json', 'Agricultural', 3);
    this.loadFeatureLayer('mapdata/Flood_Zones.json', 'Flood Zones', 4);
    this.loadFeatureLayer('mapdata/Oahu_Land_Use_1998.json', 'Land Use', 5);
    this.loadFeatureLayer('mapdata/Parks_State_Polygon.json', 'State Parks', 6);
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
    if (this.leafmap) {
      this.layers.forEach(el => {
        if (el.name === layername) {
          el.active = false;
          this.leafmap.removeLayer(el.layer);
        }
      });
    }
  }

  showLayer(layername: any) {
    if (this.leafmap) {
      this.layers.forEach(el => {
        if (el.name === layername) {
          el.active = true;
          this.leafmap.addLayer(el.layer);
        }
      });
    }
  }

  loadGeometryLayer(mapUrl: string, name: string, id: number) {
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
          style: (feature) => ({ color: this.colorScheme[id] }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        }));

        this.addLayer({ name: name, layer: newLayer, active: false, id: id });

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

  loadFeatureLayer(mapUrl: string, name: string, id: number) {
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
          style: (feature) => ({ color: this.colorScheme[id] }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        }));

        this.addLayer({ name: name, layer: newLayer, active: false, id: id });

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
