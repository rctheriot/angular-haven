import { Component, OnInit, Input, ViewChild } from '@angular/core';

declare var esri: any;

@Component({
  selector: 'app-arcgis-3d-map',
  templateUrl: './arcgis-3d-map.component.html',
  styleUrls: ['./arcgis-3d-map.component.css']
})
export class Arcgis3dMapComponent implements OnInit {

  @Input() public view: [number, number];
  @ViewChild('map') mapDiv;

  constructor() { }

  ngOnInit() {
    const esriScript = document.createElement('script');
    esriScript.async = true;
    esriScript.defer = true;
    esriScript.onload = (respone) => {
      this.loadThree();
    }
    esriScript.src = 'https://js.arcgis.com/4.4/';
    document.body.appendChild(esriScript);
  }

  private loadThree() {
    const threeScript = document.createElement('script');
    threeScript.async = true;
    threeScript.defer = true;
    threeScript.onload = (respone) => {
      this.loadObj();
    }
    threeScript.src = '../../assets/libs/THREE.js';
    document.body.appendChild(threeScript);
  }

  private loadObj() {
    const objScript = document.createElement('script');
    objScript.async = true;
    objScript.defer = true;
    objScript.onload = (respone) => {
      this.loadArcScript();
    }
    objScript.src = '../../assets/libs/OBJLoader.js';
    document.body.appendChild(objScript);
  }

  private loadArcScript() {
    const myScript = document.createElement('script');
    myScript.async = true;
    myScript.defer = true;
    myScript.onload = (respone) => {
    }
    myScript.src = '../../assets/libs/arctest.js';
    document.body.appendChild(myScript);
  }

  public resize(x, y) {
    this.view = [x - 40, y - 60];
    this.mapDiv.nativeElement.style.width = this.view[0] + 'px';
    this.mapDiv.nativeElement.style.height = this.view[1] + 'px';
  }

}
