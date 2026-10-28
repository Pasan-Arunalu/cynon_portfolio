import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { vertexShader, fragmentShader } from './shaders';

export const PointCloudMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffffff'),
  },
  vertexShader,
  fragmentShader
);

// Register with R3F so <pointCloudMaterial /> JSX works
extend({ PointCloudMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    pointCloudMaterial: any;
  }
}
