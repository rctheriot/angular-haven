import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import * as THREE from 'three';

@Component({
  selector: 'app-threejs',
  templateUrl: './threejs.component.html',
  styleUrls: ['./threejs.component.css']
})
export class ThreejsComponent implements OnInit {
  @ViewChild('threejsSceneContainer') sceneContainer: ElementRef;
  sceneWidth = 555;
  sceneHeight = 278;

  constructor() { }

  ngOnInit() {
    this.createScene();
  }

  createScene() {
    const sceneWidth = this.sceneWidth
    const sceneHeight = this.sceneHeight
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      sceneWidth / sceneHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( sceneWidth, sceneHeight );
    this.sceneContainer.nativeElement.replaceWith(renderer.domElement);

    const geometry = new THREE.BoxGeometry( 1, 1, 1 );
    const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
    const cube = new THREE.Mesh( geometry, material );
    scene.add( cube );

    camera.position.z = 5;

    const animate = function () {
      requestAnimationFrame( animate );

      cube.rotation.x += 0.1;
      cube.rotation.y += 0.1;

      renderer.render(scene, camera);
    };

    animate();
  }

}
