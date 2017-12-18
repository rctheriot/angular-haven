import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import * as L from 'leaflet';
import * as firebase from 'firebase/app'
import 'firebase/storage'

@Injectable()
export class HavenLeafletService {

  layers = [];

  constructor() {
    this.loadFeatureLayer('mapdata/DOD_Parcels.json', 'DOD', 0);
    this.loadFeatureLayer('mapdata/nrel_pv_10pct.json', 'Solar', 1);
    this.loadFeatureLayer('mapdata/nrel_wind.json', 'Wind', 2);
    this.loadFeatureLayer('mapdata/Oahu_Land_Use_1998.json', 'Agricultural', 3);
    this.loadFeatureLayer('mapdata/Flood_Zones.json', 'Flood Zones', 4);
    this.loadFeatureLayer('mapdata/Oahu_Land_Use_1998.json', 'Land Use', 5);
    this.loadFeatureLayer('mapdata/Parks_State_Polygon.json', 'State Parks', 6);
  }

  public getLayers(): Promise<any> {
    const lays = [];
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      lays.push({'name': layer.name, 'data': JSON.parse(JSON.stringify(layer.data)), 'id': layer.id})
    }
    return Promise.resolve(lays);
  }

  public getLayer(layerName: string): Promise<any> {
    let lay = {};
    for (let i = 0; i < this.layers.length; i++) {
      const layer = this.layers[i];
      if (layerName === layer.name) {
        lay = {'name': layer.name, 'data': JSON.parse(JSON.stringify(layer.data))};
      }
    }
    return Promise.resolve(lay);
  }

  loadFeatureLayer(mapUrl: string, name: string, id: number) {
    const storageRef = firebase.storage().ref().child(mapUrl);
    storageRef.getDownloadURL().then(url => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'json';
      xhr.onload = (event) => { this.layers.push({ 'name': name, 'data': xhr.response, 'id': id }); };
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

}
