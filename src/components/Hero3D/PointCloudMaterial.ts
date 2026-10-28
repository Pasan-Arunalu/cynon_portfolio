import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend, type ThreeElement } from '@react-three/fiber';
import { vertexShader, fragmentShader } from './shaders';

export const PointCloudMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#ffffff'),
  },
  vertexShader,
  fragmentShader,
);

extend({ PointCloudMaterial });

declare module '@react-three/fiber' {
  interface ThreeElements {
    pointCloudMaterial: ThreeElement<typeof PointCloudMaterial>;
  }
}