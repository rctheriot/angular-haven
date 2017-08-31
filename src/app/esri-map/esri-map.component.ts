import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';

declare const require: (moduleId: string) => any;
const OBJLoader = require('three-obj-loader')(THREE)

import { EsriLoaderService } from 'angular2-esri-loader';

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {

  // for JSAPI 4.x you can use the 'any for TS types
  public SceneView: any;
  public TileLayer: any;

  // this is needed to be able to create the MapView at the DOM element in this component
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;

  constructor(private esriLoader: EsriLoaderService) { }
  public ngOnInit() {
    // only load the ArcGIS API for JavaScript when this component is loaded
    return this.esriLoader.load({
      // use a specific version of the JSAPI
      url: 'https://js.arcgis.com/4.4/'
    }).then(() => {
      // load the needed Map and MapView modules from the JSAPI
      this.esriLoader.loadModules([
        'esri/Map',
        'esri/views/SceneView',
        //'esri/layers/TileLayer',
        'esri/views/3d/externalRenderers',
        // 'esri/geometry/SpatialReference',
        // 'esri/request',
        'dojo/dom',
        'dojo/on',
        'dojo/domReady!'
      ]).then(([
        Map,
        SceneView,
         externalRenderers,
        // SpatialReference,
        // esriRequest,
        //TileLayer,
        dom,
        on
      ]) => {

        // const transportationLyr = new TileLayer({
        //   url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer',
        //   // This property can be used to uniquely identify the layer
        //   id: 'streets',
        //   visible: true
        // });

        // const housingLyr = new TileLayer({
        //   url: 'https://tiles.arcgis.com/tiles/nGt4QxSblgDfeJn9/arcgis/rest/services/New_York_Housing_Density/MapServer',
        //   id: 'ny-housing',
        //   opacity: 0.9
        // });

        const mapProperties: any = {
          basemap: 'satellite',
          ground: 'world-elevation',
          //layers: [housingLyr, transportationLyr]
        };

        const map: any = new Map(mapProperties);

        const sceneViewProperties: any = {
          // create the map view at the DOM element in this component
          container: this.mapViewEl.nativeElement,
          // supply additional options
          map,
          viewingMode: 'global',
          camera: {
            position: {
              x: -9932671,
              y: 2380007,
              z: 1687219,
              spatialReference: { wkid: 102100 }
            },
            heading: 0,
            tilt: 35
          },
        };

        this.SceneView = new SceneView(sceneViewProperties);
        this.SceneView.environment.lighting.cameraTrackingEnabled = true;

        var myExternalRenderer = {
          setup: function (context) {
          },
          render: function (context) {
          }
        };

        console.log(externalRenderers);
        console.log(SceneView);
        console.log(myExternalRenderer);
        externalRenderers.add(SceneView, myExternalRenderer);

      })
    })
  }
}
