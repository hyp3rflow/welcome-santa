import React, { useEffect } from 'react';
import './App.css';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as THREE from 'three';
import { Geometry, GeometryUtils } from 'three';

function App() {
  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const objects = new THREE.Group();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const loader = new GLTFLoader();
    let santaObj: THREE.Group;
    loader.load(
      './scene.gltf',
      gltf => {
        santaObj = gltf.scene;
        santaObj.position.y = -1.55;
        santaObj.castShadow = true;
        santaObj.receiveShadow = true;
        objects.add(santaObj);

        santaObj.traverse(node => {
          if (node instanceof THREE.Mesh) {
            node.castShadow = true;
          }
        });
      },
      undefined,
      err => console.error(err)
    );

    camera.position.z = 5;

    scene.add(new THREE.AmbientLight(0x666666));

    const light = new THREE.PointLight(0xffffff, 1.0, 100);
    light.position.set(0, 0, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 512; // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5; // default
    light.shadow.camera.far = 500; // default
    scene.add(light);

    const pointLight = new THREE.DirectionalLight(0xdfebff, 1);
    pointLight.position.set(0, 10, 0);
    pointLight.castShadow = true;
    pointLight.shadow.mapSize.width = 512; // default
    pointLight.shadow.mapSize.height = 512; // default
    pointLight.shadow.camera.near = 0.5; // default
    pointLight.shadow.camera.far = 500; // default
    scene.add(pointLight);

    const geometry = new THREE.CylinderGeometry(3, 3, 0.4, 100);
    const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const cylinder = new THREE.Mesh(geometry, material);
    objects.add(cylinder);
    cylinder.receiveShadow = true;
    cylinder.position.set(0, -1.73, 0);

    const fontLoader = new THREE.FontLoader();
    fontLoader.load('./helvetiker_regular.typeface.json', font => {
      const geometry = new THREE.TextGeometry('Merry Christmas!', {
        font: font,
        size: 0.5,
        height: 0.05,
        bevelEnabled: false,
      });
      geometry.computeBoundingBox();
      geometry.computeVertexNormals();

      const matDark = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        side: THREE.DoubleSide,
      });

      const textMesh = new THREE.Mesh(geometry, matDark);
      textMesh.position.set(-2.5, 1, 0);
      textMesh.castShadow = true;
      textMesh.receiveShadow = true;

      objects.add(textMesh);
    });

    scene.add(objects);

    const controls = new OrbitControls(camera, renderer.domElement);
    const animate = function () {
      const { x, y, z } = camera.position;
      light.position.set(x, y, z);

      objects.rotateY(0.03);

      requestAnimationFrame(animate);
      controls.update();

      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <div className="App"></div>;
}

export default App;
