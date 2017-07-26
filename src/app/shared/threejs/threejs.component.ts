import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as THREE from 'three';
import * as d3 from 'd3';
import * as _ from 'underscore';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit {
  @ViewChild('tjs') sceneContainer: ElementRef;
  sceneWidth = 555;
  sceneHeight = 278;

  dataObs: FirebaseListObservable<any[]>;

  constructor(private db: AngularFireDatabase) {

   }

  ngOnInit() {
    this.dataObs = this.db.list(`/test-items`, { preserveSnapshot: true });
        this.dataObs.subscribe(snapshots => {
            this.createScene(snapshots);
    })

  }

  createScene(snapShot) {

    let glScene, glRenderer, camera;
    // let controls;
    let light;

    const windowWidth = 1000;
    const windowHeight = 500;

    let startPosition;
    const realData = snapShot;

    const data = {
      labels: {
        y: ['400', '600', '800', '1000', '1200', '1400'],
        z: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
           '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
        x: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      }
    };

    const graphDimensions = {
      w: 3600,
      d: 2400,
      h: 1400
    };

    init();
    render();

    function init() {
      console.log(2);
      const fov = 50;
      startPosition = new THREE.Vector3(0, 0, 3000);
      camera = new THREE.PerspectiveCamera(fov, windowWidth / windowHeight, 1, 30000);
      camera.position.set(startPosition.x, startPosition.y, startPosition.z);

      // controls = new THREE.c(camera, container);
      // controls.damping = 0.2;
      // controls.addEventListener('change', render);

      glScene = new THREE.Scene();

      light = new THREE.DirectionalLight(0xffffff);
      light.position.set(0, 0, 1);
      glScene.add(light);

      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;

      const context = canvas.getContext('2d');

      gridInit();

      const floorGeometry = new THREE.PlaneGeometry(graphDimensions.w, graphDimensions.d, 23, 365);
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

        for (const key of Object.keys(realData[i])) {

          let colIndex = (realData[i][key] - 300) / (1500 - 300);
          colIndex *= colors.length;
          colIndex = Math.floor(colIndex);
          colIndex = Math.max(0, Math.min(30, colIndex));
          faceColors.push(colors[colIndex]);

          const value = (realData[i][key]) / (1000) * (realData[i][key]);
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

      const wireframeMaterial = new THREE.MeshBasicMaterial({
        side: THREE.DoubleSide,
        vertexColors: THREE.VertexColors
      });

      const lineMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 5,
      });

      // grid lines
      for (let i = 0; i < _.size(yLines); i++) {
        const graphLine = new THREE.Line(yLines[i], lineMat);

        graphLine.rotation.x = -Math.PI / 2;
        graphLine.position.y = -graphDimensions.h / 2;

        graphLine.rotation.z = Math.PI / 2;

        glScene.add(graphLine);
      }
      for (let i = 0; i < _.size(xLines); i++) {

        const graphLine = new THREE.Line(xLines[i], lineMat);

        graphLine.rotation.x = -Math.PI / 2;
        graphLine.position.y = -graphDimensions.h / 2;

        graphLine.rotation.z = Math.PI / 2;

        glScene.add(graphLine);
      }

      const floor = new THREE.Mesh(floorGeometry, wireframeMaterial);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -graphDimensions.h / 2;

      floor.rotation.z = Math.PI / 2;
      glScene.add(floor);

      // set up webGL renderer
      glRenderer = new THREE.WebGLRenderer();
      glRenderer.setPixelRatio(window.devicePixelRatio);
      glRenderer.setClearColor(0xf0f0f0);
      glRenderer.setSize(windowWidth, windowHeight);

      this.sceneContainer.replaceWith(glRenderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
      animate();
    }

    // ----------------------------------------------------------
    // Initialize grids
    // ----------------------------------------------------------
    function gridInit() {

      const boundingGrid = new THREE.Object3D(),
        depth = graphDimensions.w / 2, // depth
        width = graphDimensions.d / 2, // width
        height = graphDimensions.h / 2, // height
        a = data.labels.y.length,
        b = data.labels.x.length,
        c = data.labels.z.length;

      // pink
      const newGridXY = createAGrid({
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
      const newGridYZ = createAGrid({
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
      const newGridXZ = createAGrid({
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

      glScene.add(boundingGrid);

      const labelsW = labelAxis(width, data.labels.x, 'x');
      labelsW.position.x = width + 40;
      labelsW.position.y = -height - 40;
      labelsW.position.z = depth;
      glScene.add(labelsW);

      const labelsH = labelAxis(height, data.labels.y, 'y');
      labelsH.position.x = width;
      labelsH.position.y = -height + (2 * height / a) - 20;
      labelsH.position.z = depth;
      glScene.add(labelsH);

      const labelsD = labelAxis(depth, data.labels.z, 'z');
      labelsD.position.x = width;
      labelsD.position.y = -(height) - 40;
      labelsD.position.z = depth - 40;
      glScene.add(labelsD);
    };

    function labelAxis(width, d, direction) {

      const separator = 2 * width / d.length,
        p = {
          x: 0,
          y: 0,
          z: 0
        },
        dobj = new THREE.Object3D();

      for (let i = 0; i < d.length; i++) {
        const label = makeTextSprite(data[i]);

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
    function makeTextSprite(message) {
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


    function createAGrid(opts) {
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


    function animate() {
      requestAnimationFrame(animate);
      // controls.update();
    }

    function render() {
      camera.lookAt(glScene.position);
      glRenderer.render(glScene, camera);

    }

    function onWindowResize() {

      camera.aspect = windowWidth / windowHeight;
      camera.updateProjectionMatrix();

      glRenderer.setSize(windowWidth, windowHeight);
      render();

    }
  }

}
