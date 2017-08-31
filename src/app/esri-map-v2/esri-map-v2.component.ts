import { Component, OnInit } from '@angular/core';

declare var esri: any;

@Component({
  selector: 'app-esri-map-v2',
  templateUrl: './esri-map-v2.component.html',
  styleUrls: ['./esri-map-v2.component.css']
})
export class EsriMapV2Component implements OnInit {



  constructor() {

   }

  ngOnInit() {
    console.log("Init");
    var esriScript = document.createElement('script');
    esriScript.async = true;
    esriScript.defer = true;
    esriScript.onload = (respone) => {
      this.loadThree();
    }
    esriScript.src = 'https://js.arcgis.com/4.4/';
    esriScript.onerror = () => {console.log("Error loading ARCGIS");};
    document.body.appendChild(esriScript);
  }

  private loadThree() {
    var threeScript = document.createElement('script');
    threeScript.async = true;
    threeScript.defer = true;
    threeScript.onload = (respone) => {
      this.loadObj();
    }
    threeScript.src = '../../assets/data/THREE.js';
    threeScript.onerror = () => {console.log("Error loading THREE");};
    document.body.appendChild(threeScript);
  }

  private loadObj() {
    var objScript = document.createElement('script');
    objScript.async = true;
    objScript.defer = true;
    objScript.onload = (respone) => {
      this.loadArcScript();
    }
    objScript.src = '../../assets/data/OBJLoader.js';
    objScript.onerror = () => {console.log("Error loading OBJ");};
    document.body.appendChild(objScript);
  }

  private loadArcScript() {

    var myScript = document.createElement('script');
    myScript.async = true;
    myScript.defer = true;
    myScript.onload = (respone) => {
      console.log("Finsihed loading");
    }
    myScript.src = '../../assets/images/arctest.js';
    document.body.appendChild(myScript);
  }
}
