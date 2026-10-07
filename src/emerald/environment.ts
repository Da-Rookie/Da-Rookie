import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
import {
  nodes,
  edges,
  PATH_WIDTH,
  places,
  presets,
  type Quality,
  isWalkable,
} from "./topology";
import { surface, waterNormal, labelTexture, random } from "./materials";
export interface Environment {
  root: THREE.Group;
  water: Water | THREE.Mesh;
  beacons: THREE.Group[];
  character: THREE.Group;
  limbs: THREE.Group[];
  boat: THREE.Group;
  lights: THREE.MeshStandardMaterial[];
  animated: THREE.Object3D[];
  reflectionTargets: THREE.WebGLRenderTarget[];
}
export function createEnvironment(
  scene: THREE.Scene,
  renderer: THREE.WebGLRenderer,
  quality: Quality,
): Environment {
  const preset = presets[quality],
    root = new THREE.Group();
  scene.add(root);
  const rng = random();
  const lights: THREE.MeshStandardMaterial[] = [],
    animated: THREE.Object3D[] = [],
    reflectionTargets: THREE.WebGLRenderTarget[] = [];
  const stone = new THREE.MeshStandardMaterial({
    map: surface(preset.texture, "stone"),
    roughness: 0.94,
    color: "#9baea0",
    bumpScale: 0.09,
  });
  stone.bumpMap = stone.map;
  const rockMat = new THREE.MeshStandardMaterial({
    map: stone.map,
    roughness: 1,
    color: "#536257",
    bumpMap: stone.map,
    bumpScale: 0.19,
  });
  const lawn = new THREE.MeshStandardMaterial({
    map: surface(preset.texture, "grass"),
    roughness: 1,
    color: "#819d63",
    bumpScale: 0.1,
  });
  lawn.bumpMap = lawn.map;
  const wood = new THREE.MeshStandardMaterial({
    map: surface(preset.texture, "wood"),
    roughness: 0.71,
    bumpScale: 0.05,
  });
  wood.bumpMap = wood.map;
  const metal = new THREE.MeshStandardMaterial({
    color: "#183c37",
    map: surface(preset.texture, "metal"),
    metalness: 0.72,
    roughness: 0.32,
  });
  const frame = new THREE.MeshStandardMaterial({
    color: "#243e3a",
    metalness: 0.8,
    roughness: 0.29,
  });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#75b5ae",
    metalness: 0.12,
    roughness: 0.13,
    transparent: true,
    opacity: 0.23,
    side: THREE.DoubleSide,
    depthWrite: false,
  });
  const white = new THREE.MeshStandardMaterial({
    color: "#d8dbc6",
    roughness: 0.76,
  });
  const glow = (color: string) => {
    const m = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 1.3,
      toneMapped: false,
    });
    lights.push(m);
    return m;
  };
  const cyan = glow("#75ecce"),
    warm = glow("#ffca85"),
    purple = glow("#cc91ef");
  const box = (
    w: number,
    h: number,
    d: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = root,
  ) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const cyl = (
    r: number,
    rt: number,
    h: number,
    mat: THREE.Material,
    x: number,
    y: number,
    z: number,
    parent: THREE.Object3D = root,
    sides = 32,
  ) => {
    const m = new THREE.Mesh(new THREE.CylinderGeometry(r, rt, h, sides), mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    parent.add(m);
    return m;
  };
  const beam = (
    a: THREE.Vector3,
    b: THREE.Vector3,
    r: number,
    mat: THREE.Material,
    parent: THREE.Object3D = root,
  ) => {
    const m = new THREE.Mesh(
      new THREE.CylinderGeometry(r, r, a.distanceTo(b), 8),
      mat,
    );
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      b.clone().sub(a).normalize(),
    );
    parent.add(m);
    return m;
  };
  const sign = (
    text: string,
    sub: string,
    x: number,
    y: number,
    z: number,
    width = 8,
    parent: THREE.Object3D = root,
  ) => {
    const m = new THREE.Mesh(
      new THREE.PlaneGeometry(width, width / 4),
      new THREE.MeshBasicMaterial({
        map: labelTexture(text, sub),
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    );
    m.position.set(x, y, z);
    parent.add(m);
    return m;
  };
  // Broad coastal landform behind the bay; sandy seabed remains visible through the water.
  const islandShape = new THREE.Shape();
  islandShape.moveTo(-27, -15);
  islandShape.bezierCurveTo(-40, 2, -34, 25, -13, 30);
  islandShape.bezierCurveTo(5, 37, 33, 24, 33, 0);
  islandShape.bezierCurveTo(31, -12, 28, -20, 23, -22);
  islandShape.lineTo(18, -12);
  islandShape.bezierCurveTo(27, 2, 14, 18, -2, 15);
  islandShape.bezierCurveTo(-21, 14, -24, -1, -19, -12);
  islandShape.closePath();
  const extrude = new THREE.ExtrudeGeometry(islandShape, {
    depth: 3,
    bevelEnabled: true,
    bevelThickness: 1.8,
    bevelSize: 1.8,
    bevelSegments: 4,
    steps: 1,
    curveSegments: 40,
  });
  extrude.rotateX(-Math.PI / 2);
  const island = new THREE.Mesh(extrude, [lawn, rockMat]);
  island.position.y = -2.1;
  island.receiveShadow = true;
  island.castShadow = true;
  root.add(island);
  const seabed = cyl(
    55,
    55,
    0.3,
    new THREE.MeshStandardMaterial({ color: "#97b69b", roughness: 1 }),
    0,
    -2.5,
    0,
    root,
    80,
  );
  seabed.receiveShadow = true;
  // PBR water with real planar reflection on Medium/High.
  let water: Water | THREE.Mesh;
  if (preset.reflection) {
    water = new Water(new THREE.PlaneGeometry(1500, 1500), {
      textureWidth: preset.reflection,
      textureHeight: preset.reflection,
      waterNormals: waterNormal(),
      sunDirection: new THREE.Vector3(-0.4, 0.5, -0.8),
      sunColor: 0xffd6af,
      waterColor: 0x087c7a,
      distortionScale: 2.8,
      fog: true,
    });
    // The renderer context is destroyed on quality changes, releasing Water's private reflector target.
    const mirror = (water.material as THREE.ShaderMaterial).uniforms
      .mirrorSampler.value as THREE.Texture;
    water.userData.mirrorTexture = mirror;
  } else {
    water = new THREE.Mesh(
      new THREE.PlaneGeometry(1500, 1500),
      new THREE.MeshStandardMaterial({
        color: "#148c87",
        roughness: 0.26,
        metalness: 0.55,
        normalMap: waterNormal(),
        normalScale: new THREE.Vector2(0.3, 0.3),
        transparent: true,
        opacity: 0.86,
      }),
    );
  }
  water.rotation.x = -Math.PI / 2;
  water.position.y = -0.2;
  root.add(water);
  // Sky and environment lighting are generated locally; no external HDR dependency.
  const sky = new Sky();
  sky.scale.setScalar(1400);
  const su = sky.material.uniforms;
  su.turbidity.value = 8;
  su.rayleigh.value = 1.7;
  su.mieCoefficient.value = 0.004;
  su.mieDirectionalG.value = 0.88;
  const sun = new THREE.Vector3().setFromSphericalCoords(
    1,
    THREE.MathUtils.degToRad(87),
    THREE.MathUtils.degToRad(245),
  );
  su.sunPosition.value.copy(sun);
  root.add(sky);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envScene = new THREE.Scene();
  const envSky = sky.clone();
  envScene.add(envSky);
  const envTarget = pmrem.fromScene(envScene, 0.04, 0.1, 1800);
  scene.environment = envTarget.texture;
  reflectionTargets.push(envTarget);
  pmrem.dispose();
  const hemi = new THREE.HemisphereLight("#b4dcdd", "#314c42", 2);
  root.add(hemi);
  const sunlight = new THREE.DirectionalLight("#ffdcad", 3.5);
  sunlight.position.set(-36, 47, -26);
  sunlight.castShadow = !!preset.shadow;
  sunlight.shadow.mapSize.set(preset.shadow || 512, preset.shadow || 512);
  Object.assign(sunlight.shadow.camera, {
    left: -48,
    right: 48,
    top: 48,
    bottom: -48,
    near: 1,
    far: 150,
  });
  sunlight.shadow.bias = -0.0007;
  sunlight.shadow.normalBias = 0.08;
  root.add(sunlight);
  // Walking surfaces: each edge is a genuine raised boardwalk with integrated neon.
  edges.forEach(([a, b], index) => {
    const [ax, az] = nodes[a],
      [bx, bz] = nodes[b],
      dx = bx - ax,
      dz = bz - az,
      len = Math.hypot(dx, dz);
    const g = new THREE.Group();
    g.position.set((ax + bx) / 2, 0.9, (az + bz) / 2);
    g.rotation.y = Math.atan2(dx, dz);
    root.add(g);
    box(
      PATH_WIDTH,
      0.32,
      len + 0.4,
      index > 10 || index === 0 ? wood : stone,
      0,
      0,
      0,
      g,
    );
    for (const side of [-1, 1]) {
      box(0.055, 0.035, len, cyan, side * (PATH_WIDTH / 2 - 0.16), 0.19, 0, g);
      for (let i = 0; i < Math.floor(len / 2.5); i++) {
        const z = -len / 2 + 1.3 + i * 2.5;
        box(
          0.09,
          0.75,
          0.09,
          frame,
          side * (PATH_WIDTH / 2 - 0.12),
          0.55,
          z,
          g,
        );
      }
      box(0.055, 0.055, len, frame, side * (PATH_WIDTH / 2 - 0.12), 0.94, 0, g);
    }
  });
  nodes.forEach(([x, z], i) => {
    cyl(
      [0, 3, 6, 9, 12].includes(i) ? 4.5 : 2.2,
      [0, 3, 6, 9, 12].includes(i) ? 4.5 : 2.2,
      0.32,
      i === 0 || i === 12 ? wood : stone,
      x,
      0.9,
      z,
    );
  });
  // The project laboratory: curved roof, glass curtain walls, slender structural ribs.
  const lab = new THREE.Group();
  lab.position.set(-17, 1.1, -13);
  lab.rotation.y = 0.2;
  root.add(lab);
  box(12, 0.4, 8, stone, 0, 0.05, 0, lab);
  box(11.6, 0.12, 7.6, wood, 0, 0.31, 0, lab);
  for (const x of [-5.6, -2.8, 0, 2.8, 5.6]) {
    box(0.16, 5.2, 0.16, frame, x, 2.8, -3.6, lab);
    box(0.16, 5.2, 0.16, frame, x, 2.8, 3.6, lab);
  }
  box(11.4, 4.5, 0.04, glass, 0, 2.7, -3.6, lab);
  box(0.04, 4.5, 7.2, glass, -5.6, 2.7, 0, lab);
  box(0.04, 4.5, 7.2, glass, 5.6, 2.7, 0, lab);
  box(3.8, 4.5, 0.04, glass, -3.7, 2.7, 3.6, lab);
  box(3.8, 4.5, 0.04, glass, 3.7, 2.7, 3.6, lab);
  // Semi-cylindrical sweeping roof rotated along the building width.
  const roofGeo = new THREE.CylinderGeometry(
    4.5,
    4.5,
    12.7,
    40,
    1,
    true,
    0,
    Math.PI,
  );
  roofGeo.rotateZ(Math.PI / 2);
  const roof = new THREE.Mesh(
    roofGeo,
    new THREE.MeshStandardMaterial({
      color: "#1d5146",
      metalness: 0.58,
      roughness: 0.33,
      side: THREE.DoubleSide,
    }),
  );
  roof.position.y = 5;
  lab.add(roof);
  roof.castShadow = true;
  box(12.2, 0.13, 0.12, cyan, 0, 5.02, 3.8, lab);
  box(12.2, 0.13, 0.12, warm, 0, 5.02, -3.8, lab);
  sign("EMERALD BAY LAB", "BUILD  /  AUTOMATE  /  LEAD", 0, 4.4, 3.7, 9, lab);
  for (let i = 0; i < 3; i++) {
    const x = -3.6 + i * 3.6;
    box(2.3, 0.18, 1.5, white, x, 1.1, -2, lab);
    box(0.2, 0.8, 0.7, frame, x, 0.6, -2, lab);
    const obj = new THREE.Mesh(
      i === 0
        ? new THREE.IcosahedronGeometry(0.55, 1)
        : i === 1
          ? new THREE.TorusKnotGeometry(0.36, 0.1, 70, 10)
          : new THREE.OctahedronGeometry(0.65),
      i === 2 ? purple : cyan,
    );
    obj.position.set(x, 2, -2);
    lab.add(obj);
    animated.push(obj);
    box(1.4, 0.8, 0.07, metal, x, 1.65, -2.5, lab);
    box(1.27, 0.62, 0.02, cyan, x, 1.67, -2.45, lab);
  }
  for (const x of [-4.5, 4.5]) {
    const l = new THREE.PointLight("#ffcf90", 25, 10, 2);
    l.position.set(x, 3, 0);
    lab.add(l);
  }
  // Terrace architecture: open canopy and archive with two current-role light columns.
  const terrace = new THREE.Group();
  terrace.position.set(5, 1.1, -20);
  root.add(terrace);
  box(11, 0.35, 6, wood, 0, 0, 0, terrace);
  for (const x of [-5, 5])
    for (const z of [-2.5, 2.5])
      box(0.13, 4.4, 0.13, frame, x, 2.2, z, terrace);
  for (let i = 0; i < 11; i++)
    box(0.32, 0.2, 6.5, metal, -5 + i, 4.4, 0, terrace);
  box(6, 0.25, 1.5, white, 0, 1.2, 0, terrace);
  box(5.6, 1, 0.15, glass, 0, 2.1, -0.45, terrace);
  for (const x of [-1.5, 1.5]) {
    box(1.3, 1, 0.06, cyan, x, 2, -0.38, terrace);
    box(0.4, 1, 0.4, frame, x, 0.6, 0, terrace);
  }
  sign(
    "THE WORKING TERRACE",
    "THE PERSON BEHIND THE PRACTICE",
    0,
    3.5,
    2.6,
    9,
    terrace,
  );
  // Recognition pavilion with individual glowing plinths.
  const gallery = new THREE.Group();
  gallery.position.set(27, 1.1, 0);
  gallery.rotation.y = -Math.PI / 2;
  root.add(gallery);
  cyl(5.2, 5.2, 0.4, stone, 0, 0, 0, gallery, 48);
  cyl(5.6, 5.6, 0.26, metal, 0, 4.8, 0, gallery, 48);
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    box(
      0.1,
      4.8,
      0.1,
      frame,
      Math.sin(a) * 4.8,
      2.4,
      Math.cos(a) * 4.8,
      gallery,
    );
  }
  for (let i = 0; i < 3; i++) {
    const x = -2.8 + i * 2.8;
    cyl(0.75, 0.9, 1.1, white, x, 0.75, 0, gallery);
    const t = new THREE.Mesh(
      i === 0
        ? new THREE.TorusGeometry(0.45, 0.12, 12, 40)
        : new THREE.BoxGeometry(0.65, 0.85, 0.1),
      i === 0
        ? new THREE.MeshStandardMaterial({
            color: "#dfb977",
            metalness: 0.85,
            roughness: 0.2,
          })
        : purple,
    );
    t.position.set(x, 1.9, 0);
    gallery.add(t);
    animated.push(t);
  }
  sign(
    "RECOGNITION",
    "WORK RECOGNIZED. KNOWLEDGE SHARED.",
    0,
    3.75,
    3.5,
    8,
    gallery,
  );
  // Conversation deck and pier furniture.
  const conversation = new THREE.Group();
  conversation.position.set(9, 1.1, 20);
  root.add(conversation);
  box(7, 0.25, 5, wood, 0, 0, 0, conversation);
  for (const x of [-2.1, 2.1]) {
    box(1.4, 0.18, 1.3, wood, x, 0.65, 0.6, conversation);
    box(1.4, 1, 0.16, metal, x, 1.1, 1.2, conversation);
    for (const z of [0.1, 1])
      box(0.1, 0.55, 0.1, frame, x, 0.3, z, conversation);
  }
  cyl(0.8, 0.8, 0.12, white, 0, 0.9, 0, conversation);
  cyl(0.08, 0.1, 0.8, frame, 0, 0.45, 0, conversation);
  const arch = new THREE.Mesh(
    new THREE.TorusGeometry(2.4, 0.055, 8, 80, Math.PI),
    warm,
  );
  arch.position.set(0, 1.8, 1.6);
  conversation.add(arch);
  // Scene markers are physical beacons; matching DOM controls are projected over them.
  const beacons = places.map((p, i) => {
    const [x, z] = nodes[p.node],
      g = new THREE.Group();
    g.position.set(x, 1.1, z);
    root.add(g);
    cyl(0.55, 0.7, 0.18, metal, 0, 0.05, 0, g);
    box(0.55, 1.15, 0.42, metal, 0, 0.68, 0, g);
    const screen = box(
      0.48,
      0.34,
      0.06,
      i === 3 ? purple : cyan,
      0,
      1.28,
      0.18,
      g,
    );
    screen.rotation.x = -0.4;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.72, 0.025, 8, 48),
      i === 3 ? purple : cyan,
    );
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.13;
    g.add(ring);
    return g;
  });
  sign(
    "WELCOME TO EMERALD BAY LAB",
    "BUILT BY EKO PRASETYO PRATOMO",
    -15,
    3.6,
    16.3,
    9,
  );
  // Coastline rocks are clustered, shaded meshes with natural varied scale.
  const rockGeo = new THREE.IcosahedronGeometry(1, quality === "high" ? 2 : 1);
  const rocks = new THREE.InstancedMesh(rockGeo, rockMat, 115),
    dummy = new THREE.Object3D();
  for (let i = 0; i < 115; i++) {
    const a = (i / 115) * Math.PI * 1.6 - 0.3,
      r = 26 + rng() * 6;
    let x = Math.cos(a) * r,
      z = -Math.sin(a) * r;
    if (isWalkable(x, z)) {
      x *= 1.12;
      z *= 1.12;
    }
    dummy.position.set(x, -0.05 + rng() * 0.8, z);
    dummy.rotation.set(rng(), rng() * 6, rng());
    dummy.scale.set(1 + rng() * 2, 0.7 + rng() * 1.8, 1 + rng() * 1.7);
    dummy.updateMatrix();
    rocks.setMatrixAt(i, dummy.matrix);
  }
  rocks.castShadow = true;
  rocks.receiveShadow = true;
  root.add(rocks);
  // Trees: branches and layered irregular canopies, instanced for all quality tiers.
  const leafMat = new THREE.MeshStandardMaterial({
    color: "#327457",
    roughness: 0.95,
  });
  const trunkMat = new THREE.MeshStandardMaterial({
    color: "#655842",
    roughness: 1,
  });
  const trees: [number, number][] = [];
  for (
    let attempt = 0;
    trees.length < preset.trees && attempt < 2000;
    attempt++
  ) {
    const a = rng() * Math.PI * 1.45 + 0.13,
      r = 25 + rng() * 7,
      x = Math.cos(a) * r,
      z = -Math.sin(a) * r;
    if (
      !isWalkable(x, z) &&
      !(x < -9 && x > -26 && z > -19 && z < -7) &&
      !(x > -0.8 && x < 11 && z < -15) &&
      !(x > 21 && z > -6 && z < 6)
    )
      trees.push([x, z]);
  }
  const leaves = new THREE.InstancedMesh(
    new THREE.IcosahedronGeometry(1, 2),
    leafMat,
    trees.length * 6,
  );
  const trunks = new THREE.InstancedMesh(
    new THREE.CylinderGeometry(0.16, 0.36, 1, 9),
    trunkMat,
    trees.length,
  );
  trees.forEach(([x, z], i) => {
    const h = 3 + rng() * 2.6;
    dummy.position.set(x, h / 2 + 0.8, z);
    dummy.scale.set(1, h, 1);
    dummy.rotation.set(0, rng() * 6, 0);
    dummy.updateMatrix();
    trunks.setMatrixAt(i, dummy.matrix);
    for (let j = 0; j < 6; j++) {
      const a = (j / 6) * Math.PI * 2;
      dummy.position.set(
        x + Math.cos(a) * 1.1,
        h + 0.4 + rng(),
        z + Math.sin(a) * 1.1,
      );
      dummy.scale.set(1.8 + rng(), 0.8 + rng() * 0.6, 1.6 + rng());
      dummy.rotation.set(rng(), rng() * 6, rng());
      dummy.updateMatrix();
      leaves.setMatrixAt(i * 6 + j, dummy.matrix);
      leaves.setColorAt(
        i * 6 + j,
        new THREE.Color().setHSL(0.37 + rng() * 0.055, 0.3, 0.18 + rng() * 0.1),
      );
    }
  });
  root.add(leaves, trunks);
  leaves.castShadow = true;
  leaves.receiveShadow = true;
  trunks.castShadow = true;
  if (preset.grass) {
    const grassGeo = new THREE.ConeGeometry(0.11, 0.55, 3);
    const grass = new THREE.InstancedMesh(
      grassGeo,
      new THREE.MeshStandardMaterial({ color: "#839e57", roughness: 1 }),
      preset.grass,
    );
    for (let i = 0; i < preset.grass; i++) {
      const a = rng() * Math.PI * 1.2 + 0.4,
        r = 25 + rng() * 6;
      let x = Math.cos(a) * r,
        z = -Math.sin(a) * r;
      if (isWalkable(x, z)) {
        x *= 1.15;
        z *= 1.15;
      }
      dummy.position.set(x, 1.1, z);
      dummy.rotation.set(0, rng() * 6, 0.1);
      dummy.scale.setScalar(0.6 + rng());
      dummy.updateMatrix();
      grass.setMatrixAt(i, dummy.matrix);
    }
    root.add(grass);
  }
  // Recessed landscape lighting and shoreline neon references to Tokyo.
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 1.5,
      r = 29,
      x = Math.cos(a) * r,
      z = -Math.sin(a) * r;
    box(0.18, 1.4, 0.18, metal, x, 1.5, z);
    box(0.2, 0.45, 0.2, i % 4 === 0 ? purple : warm, x, 2.2, z);
  }
  // Boat with hull, deck and windshield, used in the arrival shot.
  const boat = new THREE.Group();
  root.add(boat);
  const hull = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 16), white);
  hull.scale.set(1.25, 0.55, 2.4);
  boat.add(hull);
  box(1.8, 0.15, 3.4, wood, 0, 0.45, 0, boat);
  box(1.75, 0.55, 0.6, metal, 0, 0.75, 0.5, boat);
  box(1.7, 0.6, 0.04, glass, 0, 1.15, -0.6, boat);
  box(0.05, 0.05, 3, cyan, -1, 0.6, 0, boat);
  box(0.05, 0.05, 3, cyan, 1, 0.6, 0, boat);
  boat.position.set(-11, 0.25, 22);
  // Articulated modern explorer; joints support idle/walk motion.
  const character = new THREE.Group(),
    limbs: THREE.Group[] = [];
  root.add(character);
  const jacket = new THREE.MeshStandardMaterial({
    color: "#2b7460",
    roughness: 0.65,
  });
  const trousers = new THREE.MeshStandardMaterial({
    color: "#203232",
    roughness: 0.85,
  });
  const skin = new THREE.MeshStandardMaterial({
    color: "#c89c78",
    roughness: 0.8,
  });
  const hair = new THREE.MeshStandardMaterial({
    color: "#24312e",
    roughness: 0.95,
  });
  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.29, 0.39, 6, 12),
    jacket,
  );
  torso.position.y = 1.02;
  character.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), skin);
  head.scale.set(1, 1.13, 0.95);
  head.position.y = 1.65;
  character.add(head);
  const hairMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.247, 16, 10, 0, Math.PI * 2, 0, Math.PI * 0.57),
    hair,
  );
  hairMesh.position.y = 1.71;
  character.add(hairMesh);
  box(0.44, 0.51, 0.21, metal, 0, 1.12, -0.26, character);
  box(0.055, 0.24, 0.03, cyan, 0.12, 1.16, -0.38, character);
  for (const side of [-1, 1]) {
    const leg = new THREE.Group();
    leg.position.set(side * 0.16, 0.75, 0);
    character.add(leg);
    limbs.push(leg);
    const l = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.115, 0.39, 4, 8),
      trousers,
    );
    l.position.y = -0.28;
    leg.add(l);
    box(0.23, 0.15, 0.39, frame, 0, -0.58, 0.06, leg);
    const arm = new THREE.Group();
    arm.position.set(side * 0.37, 1.25, 0);
    character.add(arm);
    limbs.push(arm);
    const ar = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.1, 0.35, 4, 8),
      jacket,
    );
    ar.position.y = -0.2;
    arm.add(ar);
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.105, 10, 8), skin);
    hand.position.y = -0.47;
    arm.add(hand);
  }
  character.position.set(-15, 1.08, 17);
  character.traverse((o) => {
    if (o instanceof THREE.Mesh) o.castShadow = true;
  });
  // Distant uninhabited coast silhouettes frame the open sea.
  const mountainMat = new THREE.MeshStandardMaterial({
    color: "#587a79",
    roughness: 1,
  });
  for (let i = 0; i < 9; i++) {
    const m = new THREE.Mesh(
      new THREE.ConeGeometry(20 + rng() * 28, 12 + rng() * 22, 5),
      mountainMat,
    );
    m.position.set(-180 + i * 43, 0, -170 - rng() * 30);
    root.add(m);
  }
  return {
    root,
    water,
    beacons,
    character,
    limbs,
    boat,
    lights,
    animated,
    reflectionTargets,
  };
}
