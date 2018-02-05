import {
  Component,
  ViewChild,
  OnDestroy,
  OnInit,
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes
} from '@angular/core';
import * as L from 'leaflet';

import { HavenLeafletService } from '../haven-leaflet-services/haven-leaflet.service';
import { HavenFirestoreQueryService } from '../../../../haven-shared/haven-services/haven-firestore-query.service';
import { HavenWindowService } from '../../../../haven-window/haven-window-services/haven-window.service';
import { HavenDateSelectorService } from '../../../../haven-shared/haven-services/haven-date-selector.service';

import { HavenAppInterface } from '../../../haven-apps-shared/haven-app-interface';
import { GeoJsonObject } from 'geojson';

import { EV } from './ev-mw-total';

@Component({
  selector: 'app-haven-leaflet',
  templateUrl: './haven-leaflet.component.html',
  styleUrls: ['./haven-leaflet.component.css'],
  animations: [
    trigger('movePanel', [
      state('active', style({
        transform: 'translate(10px, 0px)',
      })),
      state('inactive', style({
        transform: 'translate(-140px, 0px)',
      })),
      transition('active => inactive', animate('500ms ease-in-out')),
      transition('inactive => active', animate('500ms ease-in-out'))
    ]),
  ],
})
export class HavenLeafletComponent implements HavenAppInterface, OnInit, OnDestroy {

  appInfo: any;

  @ViewChild('mapDiv') mapDiv;
  @ViewChild('sidebartab') sidebartab;

  map: any;

  state = 'inactive';

  loaded = false;

  layers = [];

  mapState = {
    'Solar': false,
    'DOD': false,
    'Existing RE': false,
    'Wind': false,
    'State Parks': false,
    'Agricultural': false,
    'Land Use': false,
    latitude: 21.480066,
    longitude: -157.96,
    zoom: 11,
  }

  solarMWtotal: number;
  solarEnabled: boolean;
  windMWtotal: number;
  windEnabled: boolean;
  evMWtotal: number;

  dateSelSub: any;

  colorScheme = ['#EC5f67', '#F99157', '#FAC863', '#99C794', '#6699CC', '#C594C5', '#AB7967'];

  options = {
    layers: [
      L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        {
          maxZoom: 18,
          attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }),
    ],
    zoom: 11,
    center: L.latLng([21.480066, -157.96])
  };

  constructor(
    private havenLeafletService: HavenLeafletService,
    private fsQueryService: HavenFirestoreQueryService,
    private havenDateSelectorService: HavenDateSelectorService,
    private havenWindowService: HavenWindowService
  ) { }



  ngOnInit() {
    this.evMWtotal = 0;

    const title = `${this.appInfo.query.scenario.toUpperCase()} - Map - ${this.appInfo.query.year}`;
    this.havenWindowService.getWindow(this.appInfo.winId).then((window) => window.title = title);
    this.loaded = false;
    this.solarEnabled = false;
    this.windEnabled = false;
    this.havenLeafletService.getLayers().then((layers) => {
      layers.forEach(lay => {
        const geojsonFeature: GeoJSON.FeatureCollection<any> = {
          'type': 'FeatureCollection',
          'features': []
        };

        const features = lay.data.features;
        features.forEach(element => {
          element.properties['name'] = lay.name;
          element.properties['popupContent'] = lay.name;

          if (element.properties['cf']) {
            geojsonFeature.features.push(element);
          } else if (element.properties['MWac']) {
            if (element.properties['NAME'] === 'Oahu') {
              geojsonFeature.features.push(element);
            }
          } else if (element.properties['level1']) {
            if (element.properties['level1'] === 'developed' && lay.name === 'Land Use') {
              geojsonFeature.features.push(element);
            } else if (element.properties['level1'] === 'agriculture' && lay.name === 'Agricultural') {
              geojsonFeature.features.push(element);
            }
          } else if (element.properties['FLD_ZONE']) {
            if (element.properties['FLD_ZONE'] === 'A') {
              geojsonFeature.features.push(element);
            }
          } else {
            geojsonFeature.features.push(element);
          }

        });
        const newLayer = L.geoJSON(geojsonFeature, {
          style: (feature) => ({
            color: this.colorScheme[lay.id],
          }),
          onEachFeature: (feature, layer) => { this.onEachFeature(feature, layer) },
        });
        this.layers.push(({ name: lay.name, layer: newLayer, id: lay.id }));
      })
    }).then(() => {
      this.appInfo.query.scope = 'monthly';
      this.fsQueryService.getSolarYearlyMW(this.appInfo.query).then((total) => {
        this.solarMWtotal = total;
      }).then(() => {
        this.fsQueryService.getWindYearlyMW(this.appInfo.query).then((total) => {
          this.windMWtotal = total;
          this.loaded = true;
          this.mapStateCheck();
        })
      })
    });

    this.dateSelSub = this.havenDateSelectorService.ScenarioProfilesSubs[this.appInfo.query.scenario].subscribe((profile) => {
      if (!this.appInfo.windowLock) {
        if (profile.year && (profile.year !== this.appInfo.query.year)) { this.appInfo.query.year = profile.year; }
        else { return; }
        this.appInfo.query.month = profile.month;
        this.appInfo.query.day = profile.day;
        const titl = `${this.appInfo.query.scenario.toUpperCase()} - Map - ${this.appInfo.query.year}`;
        this.havenWindowService.getWindow(this.appInfo.winId).then(window => window.title = titl);
        this.updateSolar();
        this.updateWind();
      }
    })

  }

  ngOnDestroy() {
    this.dateSelSub.unsubscribe();
  }

  onEachFeature(feature, layer) {
    if (feature.properties && feature.properties.popupContent) {
      layer.bindPopup(feature.properties.popupContent);
      layer.setStyle({ weight: 1, fillOpacity: 0.5 });
    }
  }
  setMap(map: L.Map) {
    this.map = map;
    this.mapToggleStateCheck();
    this.map.on('zoomend', () => this.zoomEnd());
    this.map.on('moveend', () => this.moveEnd());
  }

  zoomEnd() {
    this.mapState.zoom = this.map.getZoom();
  }

  moveEnd() {
    this.mapState.latitude = this.map.getCenter().lat;
    this.mapState.longitude = this.map.getCenter().lng;
  }

  mapStateCheck() {
    if (this.appInfo.mapState === undefined) {
      this.appInfo.mapState = this.mapState;
    } else {
      this.mapState = this.appInfo.mapState;
    }
    this.options.zoom = this.mapState.zoom;
    this.options.center = L.latLng([this.mapState.latitude, this.mapState.longitude]);
  }

  mapToggleStateCheck() {
    for (const toggle in this.mapState) {
      if (this.mapState.hasOwnProperty(toggle)) {
        if (typeof this.mapState[toggle] === 'boolean') {
          if (this.mapState[toggle]) {
            const event = {}
            event['checked'] = true;
            event['source'] = {}
            event['source']['name'] = toggle;
            this.toggleLayer(event);
          }
        }
      }
    }
  }


  resize() {
    if (this.loaded) {
      this.map.invalidateSize();
    }
  }

  toggleMenu() {
    this.state = (this.state === 'inactive' ? 'active' : 'inactive');
  }

  toggleLayer(event) {
    this.mapState[event.source.name] = event.checked;
    if (event.source.name === 'Solar') { this.solarEnabled = event.checked; }
    if (event.source.name === 'Wind') { this.windEnabled = event.checked; }
    if (event.checked) {
      this.showLayer(event.source.name);
    } else {
      this.hideLayer(event.source.name);
    }
  }

  showLayer(layerName: string) {
    if (this.map) {
      this.layers.forEach(el => {
        if (el.name === layerName) {
          if (el.name === 'Solar') {
            this.loadSolar(el);
            return;
          }
          if (el.name === 'Wind') {
            this.loadWind(el);
            return;
          }
          this.map.addLayer(el.layer);
          return;
        }
      });
    }
  }

  hideLayer(layername: any) {
    if (this.map) {
      this.layers.forEach(el => {
        if (el.name === layername) {
          this.map.removeLayer(el.layer);
          return;
        }
      });
    }
  }

  loadSolar(layer: any) {

    const layerProps = [];
    for (const lay in layer.layer._layers) {
      const properties = layer.layer._layers[lay].feature.properties;
      const options = layer.layer._layers[lay].options;
      const cf = properties.cf;
      const capacity = properties.capacity;
      layerProps.push([cf, { value: capacity * cf * 8760, options }]);
    }
    layerProps.sort((a, b) => b[0] - a[0]);
    let evTotal = this.evMWtotal;
    let total = this.solarMWtotal - evTotal;
    layerProps.forEach(el => {
      el[1].options.weight = 0;
      if (total > 0) {
        total -= el[1].value;
        el[1].options.fillColor = 'rgba(251, 106, 10, 1.0)';
      } else if (evTotal > 0) {
        evTotal -= el[1].value;
        el[1].options.fillColor = 'rgba(40, 96, 141, 1.0)';
      } else {
        el[1].options.fillColor = 'rgba(240, 170, 125, 1.0)';
      }
    })
    if (this.solarEnabled) { this.map.addLayer(layer.layer); }
  }

  loadWind(layer: any) {
    const layerProps = [];
    for (const lay in layer.layer._layers) {
      const properties = layer.layer._layers[lay].feature.properties;
      const options = layer.layer._layers[lay].options;
      const mwac = properties['MWac2'];
      const sqkm = properties['SQKM'];
      let spdcls = Number(properties['SPD_CLS2'].split('-')[0]);
      if (isNaN(spdcls)) { spdcls = 8.5; }
      const cf = 0.2283942;
      layerProps.push([spdcls, { value: mwac * cf * 8760, options }]);
    }
    layerProps.sort((a, b) => b[0] - a[0]);
    let total = this.windMWtotal;
    layerProps.forEach(el => {
      total -= el[1].value;
      el[1].options.weight = 0;
      if (total > 0) {
        el[1].options.fillColor = 'rgba(197, 148, 197, 1.0)';
      } else {
        el[1].options.fillColor = 'rgba(227, 212, 227, 1.0)';
      }
    })
    if (this.windEnabled) { this.map.addLayer(layer.layer); }
  }

  updateSolar() {
    this.fsQueryService.getSolarYearlyMW(this.appInfo.query).then((total) => {
      this.solarMWtotal = total;
      if (this.evMWtotal !== 0) { this.evMWtotal = EV.values.filter((data) => data['Year'] === this.appInfo.query.year)[0]['EV']; }
      this.layers.forEach(el => {
        if (el.name === 'Solar') {
          this.map.removeLayer(el.layer);
          this.loadSolar(el);
        }
      });
    })
  }

  updateWind() {
    this.fsQueryService.getWindYearlyMW(this.appInfo.query).then((total) => {
      this.windMWtotal = total;
      this.layers.forEach(el => {
        if (el.name === 'Wind') {
          this.map.removeLayer(el.layer);
          this.loadWind(el);
        }
      });
    })
  }

  evToggle(event) {
    if (event.checked) {
      this.evMWtotal = EV.values.filter((data) => data['Year'] === this.appInfo.query.year)[0]['EV'];
    } else {
      this.evMWtotal = 0;
    }
    this.layers.forEach(el => {
      if (el.name === 'Solar') {
        this.map.removeLayer(el.layer);
        this.loadSolar(el);
      }
    });
  }
}
