import {
  Input,
  Component,
  OnChanges,
  ElementRef,
  AfterViewInit,
  SimpleChanges,
} from '@angular/core';
import * as THREE from 'three';
import { matrizType } from '../types/matriz.type';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

@Component({
  selector: 'app-tree-js',
  standalone: true,
  imports: [],
  templateUrl: './tree-js.component.html',
  styleUrl: './tree-js.component.scss',
})
export class TreeJsComponent implements AfterViewInit, OnChanges {
  @Input({ required: true })
  public matriz!: matrizType;

  @Input({ required: true })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  @Input({ required: true })
  width!: number;

  @Input({ required: true })
  height!: number;

  private scene = new THREE.Scene();
  private renderer = new THREE.WebGLRenderer();
  private camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  ngAfterViewInit(): void {
    this.renderer.setSize(this.width, this.height);
    document.getElementById('canvas3d')?.appendChild(this.renderer.domElement);
    const controls = new OrbitControls(this.camera, this.renderer.domElement);

    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.25;

    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
      controls.update();
    });

    this.scene.background =  new THREE.Color( 0xffffff )
    this.generateTerrain();
  }

  // Carga las texturas de la grafica
  getMaterial(): THREE.MeshBasicMaterial {
    const texture = new THREE.CanvasTexture(this.canvasRef.nativeElement);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.colorSpace = THREE.SRGBColorSpace;

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });

    return material;
  }

  generateTerrain() {
    this.scene.clear();

    const planeGeometry = new THREE.PlaneGeometry(
      this.width,
      this.height,
      this.matriz.length - 1,
      this.matriz.length - 1
    );

    planeGeometry.rotateX(-Math.PI / 2);

    const vertices = planeGeometry.attributes['position']['array'];
    let matrizNueva: number[] = [];

    this.matriz.forEach((data) => matrizNueva.push(...data));

    for (let i = 0, j = 0, l = vertices.length; i < l; i++, j += 3) {
      vertices[j + 1] = matrizNueva[i] * 50;
    }

    const plane = new THREE.Mesh(planeGeometry, this.getMaterial());

    plane.rotation.x = 0.5;
    this.scene.add(plane);

    this.camera.position.z = this.height;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.generateTerrain();
  }
}
