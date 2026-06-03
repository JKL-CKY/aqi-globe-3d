import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import * as d3 from 'd3';
import { eventBus } from './eventBus.ts';

interface CityData {
  name: string;
  lat: number;
  lng: number;
  country: string;
  aqi?: number;
}

function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const x = radius * Math.cos(latRad) * Math.sin(lngRad);
  const y = radius * Math.sin(latRad);
  const z = radius * Math.cos(latRad) * Math.cos(lngRad);
  return new THREE.Vector3(x, y, z);
}

export function createGlobe(container: HTMLElement) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  const earthGeometry = new THREE.SphereGeometry(1, 64, 64);
  const earthMaterial = new THREE.MeshPhongMaterial({ color: 0x0a1628 });
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  scene.add(earth);

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
    'https://unpkg.com/three-globe@2.31.1/example/img/earth-blue-marble.jpg',
    (texture) => {
      earth.material = new THREE.MeshPhongMaterial({ map: texture });
    },
    undefined,
    () => {
      // texture load failed, keep the dark blue fallback material
    }
  );

  const ambientLight = new THREE.AmbientLight(0x333355, 1.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  directionalLight.position.set(5, 3, 5);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.minDistance = 1.5;
  controls.maxDistance = 6;
  controls.enablePan = false;

  // atmospheric glow
  const glowVertexShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vNormal = normalize(normalMatrix * normal);
      vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const glowFragmentShader = `
    varying vec3 vNormal;
    varying vec3 vPosition;
    void main() {
      vec3 viewDir = normalize(-vPosition);
      float glowIntensity = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
      vec3 glowColor = vec3(0.3, 0.6, 1.0);
      gl_FragColor = vec4(glowColor, glowIntensity);
    }
  `;

  const glowMaterial = new THREE.ShaderMaterial({
    vertexShader: glowVertexShader,
    fragmentShader: glowFragmentShader,
    side: THREE.BackSide,
    transparent: true,
    depthWrite: false,
  });

  const glowGeometry = new THREE.SphereGeometry(1.12, 64, 64);
  const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
  scene.add(glowMesh);

  // load and draw country boundaries
  async function loadBoundaries() {
    try {
      const response = await fetch(
        'https://unpkg.com/world-atlas@2/countries-110m.json'
      );
      const topology = await response.json();
      const geoData = d3.geoFeature(topology, topology.objects.countries);

      const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x1a9fff,
        transparent: true,
        opacity: 0.25,
        linewidth: 1,
      });

      const features = geoData.features ?? [geoData];

      for (const feature of features) {
        const geometry = feature.geometry;
        if (!geometry) continue;

        const polygons: number[][][][] =
          geometry.type === 'MultiPolygon'
            ? (geometry.coordinates as number[][][][])
            : geometry.type === 'Polygon'
              ? [(geometry.coordinates as number[][][])]
              : [];

        for (const polygon of polygons) {
          for (const ring of polygon) {
            const positions: number[] = [];
            for (const coord of ring) {
              const [lng, lat] = coord;
              const pos = latLngToVector3(lat, lng, 1.001);
              positions.push(pos.x, pos.y, pos.z);
            }

            if (positions.length < 6) continue;

            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute(
              'position',
              new THREE.Float32BufferAttribute(positions, 3)
            );
            const line = new THREE.Line(lineGeometry, lineMaterial);
            scene.add(line);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load country boundaries:', e);
    }
  }

  loadBoundaries();

  // click detection
  let cities: CityData[] = [];

  eventBus.on('DATA_UPDATE', (data: CityData[]) => {
    cities = data;
  });

  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  renderer.domElement.addEventListener('click', (event: MouseEvent) => {
    const rect = renderer.domElement.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(earth);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const lat = (Math.asin(point.y) * 180) / Math.PI;
      const lng = (Math.atan2(point.x, point.z) * 180) / Math.PI;

      let closestCity: CityData | null = null;
      let closestDist = Infinity;

      for (const city of cities) {
        const dist = Math.sqrt(
          (city.lat - lat) ** 2 + (city.lng - lng) ** 2
        );
        if (dist < closestDist && dist <= 5) {
          closestDist = dist;
          closestCity = city;
        }
      }

      if (closestCity) {
        eventBus.emit('COUNTRY_SELECTED', closestCity);
      }
    }
  });

  // animation loop
  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();

  // resize handler
  function onResize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
  window.addEventListener('resize', onResize);

  // hide loading overlay
  const overlay = document.querySelector('#loading-overlay');
  if (overlay) {
    overlay.classList.add('hidden');
  }

  return { scene, camera, renderer };
}
