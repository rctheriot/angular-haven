import { Component, AfterViewInit, ViewChild, ElementRef, Input } from '@angular/core';
import * as THREE from 'three';
import * as _ from 'underscore';
import * as d3 from 'd3';

declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE)

@Component({
  selector: 'app-threejs',
  template: '<div #canvas (window:resize)="onResize($event)"></div>',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements AfterViewInit {

  @Input() public data: Array<any>;
  @ViewChild('canvas') private canvasRef: ElementRef;

  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private fieldOfView = 60;
  private nearClippingPane = 0.1;
  private farClippingPane = 10000;
  private controls: any;
  private width = 700;
  private height = 500;

  private dataAxis = {
    labels: {
      y: ['400', '600', '800', '1000', '1200', '1400'],
      z: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
      x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
  };
  private graphDimensions = {
    w: 3600,
    d: 2400,
    h: 1400
  };

  constructor() {
  }

  ngAfterViewInit() {
    this.createScene();
    this.createCamera();
    this.createGraph();
    this.createGrid()
    this.startRenderingLoop();
  }

  private createScene() {
    this.scene = new THREE.Scene();
    const light = new THREE.DirectionalLight(0xffffff);
    light.position.set(0, 0, 1);
    this.scene.add(light);
  }

  private createCamera() {
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = 3000;
  }

  private getAspectRatio() {
    return this.width / this.height;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor(0xffffff, 1);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.dampingFactor = 0.2;

    this.renderer.setSize(this.width, this.height);
    this.canvasRef.nativeElement.replaceWith(this.renderer.domElement);
    this.animate();
  }

  private animate() {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(() => this.animate());
  }

  private onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
  }

  private createGraph() {
    const floorGeometry = new THREE.PlaneGeometry(this.graphDimensions.w, this.graphDimensions.d, 23, 365);
    const colors = ['#FFFFFF', '#F6F8F9', '#EDF1F4', '#E4EAEF', '#DBE3EA', '#D3DDE5', '#CAD6DF',
      '#C1CFDA', '#B8C8D5', '#AFC1D0', '#A7BBCB', '#9EB4C6', '#95ADC0', '#8CA6BB',
      '#839FB6', '#7B99B1', '#7292AC', '#698BA7', '#6084A1', '#577D9C', '#4F7797',
      '#467092', '#3D698D', '#346288', '#2B5B82', '#23557D', '#1A4E78', '#114773',
      '#08406E', '#003A69'];
    const faceColors = [];
    const yLines = {};
    const xLines = {};

    // on plane Geometry, change the z value to create the 3D area surface
    let j = 0;
    for (let i = 0; i < 366; i++) {

      for (const key of Object.keys(this.data[i])) {

        const val = this.data[i][key].value;
        let colIndex = (val - 300) / (1500 - 300);
        colIndex *= colors.length;
        colIndex = Math.floor(colIndex);
        colIndex = Math.max(0, Math.min(30, colIndex));
        faceColors.push(colors[colIndex]);

        const value = (val) / (1000) * (val);
        floorGeometry.vertices[j].z = value;

        if (!yLines[floorGeometry.vertices[j].y]) {
          yLines[floorGeometry.vertices[j].y] = new THREE.Geometry();
        }
        if (i % 7 === 0) {
          yLines[floorGeometry.vertices[j].y].vertices
            .push(new THREE.Vector3(floorGeometry.vertices[j].x, floorGeometry.vertices[j].y, value + 10));
        }

        if (!xLines[floorGeometry.vertices[j].x]) {
          xLines[floorGeometry.vertices[j].x] = new THREE.Geometry();
        }
        xLines[floorGeometry.vertices[j].x].vertices
          .push(new THREE.Vector3(floorGeometry.vertices[j].x, floorGeometry.vertices[j].y, value + 10));

        j++;
      }

    }

    // vertexColors
    for (let x = 0; x < floorGeometry.faces.length; x++) {
      floorGeometry.faces[x].vertexColors[0] = new THREE.Color(faceColors[floorGeometry.faces[x].a]);
      floorGeometry.faces[x].vertexColors[1] = new THREE.Color(faceColors[floorGeometry.faces[x].b]);
      floorGeometry.faces[x].vertexColors[2] = new THREE.Color(faceColors[floorGeometry.faces[x].c]);
    }


    const lineMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      linewidth: 2,
    });

    // grid lines
    for (let i = 0; i < _.size(yLines); i++) {

      const graphLine = new THREE.Line(yLines[i], lineMat);

      graphLine.rotation.x = -Math.PI / 2;
      graphLine.position.y = -this.graphDimensions.h / 2;

      graphLine.rotation.z = Math.PI / 2;

      this.scene.add(graphLine);
    }
    for (let i = 0; i < _.size(xLines); i++) {
      
      const graphLine = new THREE.Line(xLines[i], lineMat);

      graphLine.rotation.x = -Math.PI / 2;
      graphLine.position.y = -this.graphDimensions.h / 2;

      graphLine.rotation.z = Math.PI / 2;

      this.scene.add(graphLine);
    }

    const wireframeMaterial = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    });

    const floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -this.graphDimensions.h / 2;
    floor.rotation.z = Math.PI / 2;
    this.scene.add(floor);

  }


  private createGrid() {
    const boundingGrid = new THREE.Object3D();
    const depth = this.graphDimensions.w / 2;
    const width = this.graphDimensions.d / 2;
    const height = this.graphDimensions.h / 2;
    const a = this.dataAxis.labels.y.length;
    const b = this.dataAxis.labels.x.length;
    const c = this.dataAxis.labels.z.length;

    // pink
    const newGridXY = this.createAGrid({
      height: width,
      width: height,
      linesHeight: b,
      linesWidth: a,
      color: 0x000000
    });
    // newGridXY.position.y = height;
    newGridXY.position.z = -depth;
    boundingGrid.add(newGridXY);

    // blue
    const newGridYZ = this.createAGrid({
      height: width,
      width: depth,
      linesHeight: b,
      linesWidth: c,
      color: 0x000000
    });
    newGridYZ.rotation.x = Math.PI / 2;
    newGridYZ.position.y = -height;
    boundingGrid.add(newGridYZ);

    // green
    const newGridXZ = this.createAGrid({
      height: depth,
      width: height,
      linesHeight: c,
      linesWidth: a,
      color: 0x000000
    });

    newGridXZ.position.x = width;
    // newGridXZ.position.y = height;
    newGridXZ.rotation.y = Math.PI / 2;
    boundingGrid.add(newGridXZ);

    this.scene.add(boundingGrid);

    const labelsW = this.labelAxis(width, this.dataAxis.labels.x, 'x');
    labelsW.position.x = width + 40;
    labelsW.position.y = -height - 40;
    labelsW.position.z = depth;
    this.scene.add(labelsW);

    const labelsH = this.labelAxis(height, this.dataAxis.labels.y, 'y');
    labelsH.position.x = width;
    labelsH.position.y = -height + (2 * height / a) - 20;
    labelsH.position.z = depth;
    this.scene.add(labelsH);

    const labelsD = this.labelAxis(depth, this.dataAxis.labels.z, 'z');
    labelsD.position.x = width;
    labelsD.position.y = -(height) - 40;
    labelsD.position.z = depth - 40;
    this.scene.add(labelsD);
  };

  private labelAxis(width, d, direction) {
    const separator = 2 * width / d.length,
      p = {
        x: 0,
        y: 0,
        z: 0
      },
      dobj = new THREE.Object3D();

    for (let i = 0; i < d.length; i++) {
      const label = this.makeTextSprite(d[i]);

      label.position.set(p.x, p.y, p.z);

      dobj.add(label);
      if (direction === 'y') {
        p[direction] += separator;
      } else {
        p[direction] -= separator;
      }

    }
    return dobj;
  }

  // This was written by Lee Stemkoski
  // https://stemkoski.github.io/Three.js/Sprite-Text-Labels.html
  private makeTextSprite(message) {
    const parameters = {};
    const fontface = parameters['fontface'] || 'Helvetica';
    const fontsize = parameters['fontsize'] || 100;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = fontsize + 'px ' + fontface;

    // get size data (height depends only on font size)
    const metrics = context.measureText(message);
    const textWidth = metrics.width;


    // text color
    context.fillStyle = 'rgba(0, 0, 0, 1.0)';
    context.fillText(message, 0, fontsize);

    // canvas contents will be used for a texture
    const texture = new THREE.Texture(canvas)
    texture.minFilter = THREE.LinearFilter;
    texture.needsUpdate = true;

    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(200, 100, 1.0);

    return sprite;
  }


  private createAGrid(opts) {
    const config = opts || {
      height: 500,
      width: 500,
      linesHeight: 500,
      linesWidth: 500,
      color: 0xDD006C
    };

    const material = new THREE.LineBasicMaterial({
      color: config.color,
      opacity: 1.0
    });

    const gridObject = new THREE.Object3D(),
      gridGeo = new THREE.Geometry(),
      stepw = 2 * config.width / config.linesWidth,
      steph = 2 * config.height / config.linesHeight;

    // width
    for (let i = -config.width; i <= config.width; i += stepw) {
      gridGeo.vertices.push(new THREE.Vector3(-config.height, i, 0));
      gridGeo.vertices.push(new THREE.Vector3(config.height, i, 0));

    }
    // height
    for (let i = -config.height; i <= config.height; i += steph) {
      gridGeo.vertices.push(new THREE.Vector3(i, -config.width, 0));
      gridGeo.vertices.push(new THREE.Vector3(i, config.width, 0));
    }

    const line = new THREE.Line(gridGeo, material, THREE.LinePieces);
    gridObject.add(line);

    return gridObject;
  }

}
