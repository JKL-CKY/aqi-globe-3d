import * as THREE from 'three';
import { eventBus } from './eventBus.ts';

const MAX_PARTICLES = 3000;
const BATCH_SIZE = 300;
const PARTICLE_RADIUS = 1.02;

const vertexShader = `
  attribute vec3 aColor;
  attribute float aSize;
  varying vec3 vColor;
  uniform float time;

  void main() {
    vColor = aColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    float breath = 1.0 + 0.15 * sin(time * 3.14159);
    gl_PointSize *= breath;
  }
`;

const fragmentShader = `
  varying vec3 vColor;
  uniform float opacity;

  void main() {
    float dist = length(gl_PointCoord - vec2(0.5));
    if (dist > 0.5) discard;
    float alpha = 1.0 - smoothstep(0.2, 0.5, dist);
    gl_FragColor = vec4(vColor, alpha * opacity);
  }
`;

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const x = radius * Math.cos(latRad) * Math.sin(lngRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lngRad);
  return new THREE.Vector3(x, y, z);
}

function aqiToColor(aqi: number): [number, number, number] {
  const stops: [number, [number, number, number]][] = [
    [0, [0, 1, 0.53]],
    [50, [0, 1, 0.53]],
    [51, [1, 0.87, 0]],
    [100, [1, 0.87, 0]],
    [101, [1, 0.53, 0]],
    [150, [1, 0.53, 0]],
    [151, [1, 0.13, 0]],
    [200, [1, 0.13, 0]],
  ];

  if (aqi <= 0) return [0, 1, 0.53];
  if (aqi >= 200) return [1, 0.13, 0];

  for (let i = 0; i < stops.length - 1; i++) {
    const [lo, loColor] = stops[i];
    const [hi, hiColor] = stops[i + 1];
    if (aqi >= lo && aqi <= hi) {
      const t = (aqi - lo) / (hi - lo);
      return [
        loColor[0] + (hiColor[0] - loColor[0]) * t,
        loColor[1] + (hiColor[1] - loColor[1]) * t,
        loColor[2] + (hiColor[2] - loColor[2]) * t,
      ];
    }
  }

  return [1, 0.13, 0];
}

function aqiToSize(aqi: number): number {
  return Math.min(6, Math.max(2, 2 + (aqi / 200) * 4));
}

export function createParticleSystem(scene: THREE.Scene) {
  const positions = new Float32Array(MAX_PARTICLES * 3);
  const colors = new Float32Array(MAX_PARTICLES * 3);
  const sizes = new Float32Array(MAX_PARTICLES);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      time: { value: 0 },
      opacity: { value: 0.85 },
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  let currentData: any[] = [];
  const updateQueue: { start: number; end: number }[] = [];

  eventBus.on('DATA_UPDATE', (data: any[]) => {
    currentData = data.slice(0, MAX_PARTICLES);

    updateQueue.length = 0;
    for (let i = 0; i < currentData.length; i += BATCH_SIZE) {
      updateQueue.push({
        start: i,
        end: Math.min(i + BATCH_SIZE, currentData.length),
      });
    }
  });

  function processNextBatch() {
    if (updateQueue.length === 0) return;

    const batch = updateQueue.shift()!;
    const posAttr = geometry.getAttribute('position') as THREE.BufferAttribute;
    const colAttr = geometry.getAttribute('aColor') as THREE.BufferAttribute;
    const sizeAttr = geometry.getAttribute('aSize') as THREE.BufferAttribute;

    for (let i = batch.start; i < batch.end; i++) {
      const city = currentData[i];
      const pos = latLngToVector3(city.lat, city.lng, PARTICLE_RADIUS);
      posAttr.setXYZ(i, pos.x, pos.y, pos.z);

      const color = aqiToColor(city.aqi);
      colAttr.setXYZ(i, color[0], color[1], color[2]);

      sizeAttr.setX(i, aqiToSize(city.aqi));
    }

    posAttr.needsUpdate = true;
    colAttr.needsUpdate = true;
    sizeAttr.needsUpdate = true;

    geometry.setDrawRange(0, Math.min(currentData.length, batch.end));
  }

  function update(time: number) {
    material.uniforms.time.value = time;
    processNextBatch();
  }

  return { points, update };
}
