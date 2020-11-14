import * as THREE from 'three';
import gsap from 'gsap';

import Control from './control';

import { modelData, boxData, cubeUrls } from './constants/data';

type TObj = {
  [key: string]: any;
};

const near = 1; //bokehフィルタのフォーカス値に影響
const far = 5000; //bokehフィルタのフォーカス値に影響

class Index extends Control {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private group: THREE.Group;

  private width: number;
  private height: number;
  private aspect: number;

  private loadArr: boolean[];
  private loaders: Promise<unknown>[];

  private fov: number;

  private meshs: TObj;

  private mouse: { x: number; y: number };

  constructor() {
    super();

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.fov = 50;
    this.aspect = this.width / this.height;

    this.scene = new THREE.Scene();

    this.setEl = document.getElementById('app') as HTMLCanvasElement;

    this.setCamera = new THREE.PerspectiveCamera(
      this.fov,
      this.aspect,
      near,
      far
    );

    this.camera.position.set(0, 1.5, 6);

    this.loaders = [];
    this.meshs = {};
  }

  public async init(): Promise<void> {
    this.onListener();
    this.cameraStart();
    // this.moveCamera();
    this.setLight();
    this.setMaterial();

    await Promise.all(this.loaders);

    console.log(this.meshs);
  }

  private onListener(): void {
    this.onEvent();

    //二本指ピンチの防止（効かない）
    document.addEventListener(
      'touchstart',
      (event: TouchEvent) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      true
    );
  }

  // 最初のカメラ移動
  private cameraStart(): void {
    const cameraTarget = { x: 0, y: 1.5, z: 8 };

    gsap.to(this.camera.position, {
      ...cameraTarget,
      duration: 1,
      ease: 'power2.out'
    });
  }

  // カメラ移動
  private moveCamera(): void {
    const cameraTarget = { x: -5.5, y: 1.5, z: 5.5 };
    const cameraRotTarget = { y: 1.57 };

    gsap.to(this.camera.position, {
      ...cameraTarget,
      duration: 2
    });

    gsap.to(this.camera.rotation, {
      ...cameraRotTarget,
      duration: 2,
      onUpdate: () => {
        this.setAngleY = this.camera.rotation.y;
        this.setQuaternion(this.angleX, this.angleY);
      }
    });
  }

  // ライト設定
  private setLight(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.05);
    // const directionalLight = new THREE.DirectionalLight( 0xFFFFFF, 0.75 );
    // directionalLight.position.set( -5, 10, 10 );

    //scene.add( directionalLight );
    this.scene.add(ambientLight);
  }

  // マテリアル各要素の設定
  private setMaterial(): void {
    const loader = new THREE.TextureLoader();

    // 環境反射用キューブマップの設定
    const cubeMap = new THREE.CubeTextureLoader().load(cubeUrls);

    const imgArtObject = new Promise(
      (resolution: (value?: unknown) => void) => {
        const { path, param } = boxData;

        loader.load(path, (map: THREE.Texture) => {
          this.meshs['matArtObject'] = new THREE.MeshPhongMaterial({
            map,
            envMap: cubeMap,
            ...param
          });

          resolution();
        });
      }
    );

    this.loaders.push(imgArtObject);

    // モデル読み込み

    Object.keys(modelData).forEach((key: string) => {
      const { path, param } = modelData[key];

      if (path !== '') {
        const result = new Promise((resolution: (value?: unknown) => void) => {
          loader.load(path, (map: THREE.Texture) => {
            this.meshs[key] = new THREE.MeshPhongMaterial({
              map,
              ...param
            });

            resolution();
          });
        });

        this.loaders.push(result);
      } else {
        // 画像を読み込まない場合

        this.meshs[key] = new THREE.MeshPhongMaterial({
          ...param
        });
      }
    });
  }
}

const index = new Index();
index.init();
