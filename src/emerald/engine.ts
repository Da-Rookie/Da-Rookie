import * as THREE from "three";
import { Water } from "three/addons/objects/Water.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { createEnvironment, type Environment } from "./environment";
import {
  places,
  nodes,
  isWalkable,
  routeTo,
  presets,
  type PlaceId,
  type Quality,
} from "./topology";
export type Phase = "welcome" | "arriving" | "terminal" | "exploring";
export interface WorldSnapshot {
  phase: Phase;
  activated: boolean;
  position: [number, number, number];
  azimuth: number;
  elevation: number;
  distance: number;
}
interface Options {
  quality: Quality;
  reducedMotion: boolean;
  onPhase: (p: Phase) => void;
  onNear: (id: PlaceId | null) => void;
  onVisit: (id: PlaceId) => void;
  onError: () => void;
  onReady: () => void;
}
export class EmeraldEngine {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(46, 1, 0.1, 1800);
  private renderer: THREE.WebGLRenderer;
  private env: Environment;
  private composer?: EffectComposer;
  private frame = 0;
  private clock = new THREE.Clock();
  private time = 0;
  private stopped = false;
  private paused = false;
  private phase: Phase = "welcome";
  private activated = false;
  private introTime = 0;
  private near: PlaceId | null = null;
  private lastNear: PlaceId | null = null;
  private target = new THREE.Vector3(0, 2, 0);
  private azimuth = 0.24;
  private elevation = 0.69;
  private distance = 55;
  private route: [number, number][] = [];
  private keys = new Set<string>();
  private ray = new THREE.Raycaster();
  private pointer = new THREE.Vector2();
  private pointers = new Map<number, { x: number; y: number }>();
  private down = { x: 0, y: 0 };
  private drag = false;
  private pinch = 0;
  private rect: DOMRect;
  private abort = new AbortController();
  private observer: ResizeObserver;
  private markers: HTMLElement[];
  private markerVector = new THREE.Vector3();
  constructor(
    private host: HTMLElement,
    private options: Options,
  ) {
    this.renderer = new THREE.WebGLRenderer({
      antialias: options.quality !== "low",
      alpha: false,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, presets[options.quality].dpr),
    );
    this.renderer.shadowMap.enabled = !!presets[options.quality].shadow;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.9;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.domElement.setAttribute(
      "aria-label",
      "Emerald Bay Lab interactive 3D island",
    );
    this.renderer.domElement.setAttribute("role", "img");
    this.renderer.domElement.tabIndex = 0;
    this.host.prepend(this.renderer.domElement);
    this.scene.background = new THREE.Color("#97b4b6");
    this.scene.fog = new THREE.FogExp2("#93b3b5", 0.0038);
    this.env = createEnvironment(this.scene, this.renderer, options.quality);
    if (presets[options.quality].bloom) {
      this.composer = new EffectComposer(this.renderer);
      this.composer.addPass(new RenderPass(this.scene, this.camera));
      this.composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(1, 1), 0.32, 0.4, 1.05),
      );
      this.composer.addPass(new OutputPass());
    }
    this.markers = places.map((p) =>
      host.querySelector<HTMLElement>(`[data-place="${p.id}"]`)!,
    );
    this.rect = host.getBoundingClientRect();
    this.observer = new ResizeObserver(() => this.resize());
    this.observer.observe(host);
    this.resize();
    const canvas = this.renderer.domElement,
      signal = this.abort.signal;
    canvas.addEventListener("pointerdown", this.pointerDown, { signal });
    canvas.addEventListener("pointermove", this.pointerMove, { signal });
    canvas.addEventListener("pointerup", this.pointerUp, { signal });
    canvas.addEventListener("pointercancel", this.pointerCancel, { signal });
    canvas.addEventListener("wheel", this.wheel, { signal, passive: false });
    canvas.addEventListener("contextmenu", (e) => e.preventDefault(), {
      signal,
    });
    canvas.addEventListener(
      "webglcontextlost",
      (e) => {
        e.preventDefault();
        this.options.onError();
        this.stop();
      },
      { signal },
    );
    window.addEventListener("keydown", this.keyDown, { signal });
    window.addEventListener("keyup", this.keyUp, { signal });
    window.addEventListener("blur", () => this.keys.clear(), { signal });
    document.addEventListener(
      "visibilitychange",
      () => {
        this.clock.getDelta();
        this.keys.clear();
        if (!document.hidden && !this.stopped && !this.frame)
          this.frame = requestAnimationFrame(this.tick);
      },
      { signal },
    );
    this.resetCamera();
    this.frame = requestAnimationFrame(this.tick);
    options.onReady();
  }
  snapshot(): WorldSnapshot {
    return {
      phase: this.phase,
      activated: this.activated,
      position: this.env.character.position.toArray(),
      azimuth: this.azimuth,
      elevation: this.elevation,
      distance: this.distance,
    };
  }
  restore(s: WorldSnapshot) {
    this.activated = s.activated;
    this.azimuth = s.azimuth;
    this.elevation = s.elevation;
    this.distance = s.distance;
    if (s.phase === "arriving") {
      this.skip();
      return;
    }
    this.setPhase(s.phase);
    this.env.character.position.fromArray(s.position);
    if (s.phase !== "welcome") this.target.copy(this.env.character.position);
  }
  private resize() {
    this.rect = this.host.getBoundingClientRect();
    const w = Math.max(1, this.rect.width),
      h = Math.max(1, this.rect.height);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.composer?.setSize(w, h);
  }
  private setPhase(p: Phase) {
    this.phase = p;
    this.options.onPhase(p);
  }
  start(skip = false) {
    this.introTime = 0;
    this.route = [];
    if (skip || this.options.reducedMotion) {
      this.skip();
      return;
    }
    this.env.character.visible = true;
    this.setPhase("arriving");
  }
  skip() {
    this.env.character.visible = true;
    this.env.character.position.set(-15, 1.08, 17);
    this.env.boat.position.set(-11, 0.25, 22);
    this.env.boat.rotation.y = 0.2;
    this.distance = 17;
    this.elevation = 0.58;
    this.azimuth = 0.05;
    this.target.copy(this.env.character.position);
    this.setPhase(this.activated ? "exploring" : "terminal");
  }
  activate() {
    this.activated = true;
    this.setPhase("exploring");
    this.options.onVisit("arrival");
  }
  setPaused(value: boolean) {
    this.paused = value;
    this.keys.clear();
    this.pointers.clear();
    this.pinch = 0;
    this.clock.getDelta();
    if (!this.stopped && !document.hidden && !this.frame)
      this.frame = requestAnimationFrame(this.tick);
  }
  resetCamera() {
    if (this.phase === "welcome") {
      this.target.set(0, 1, -1);
      this.distance = window.innerWidth < 700 ? 77 : 58;
      this.elevation = 0.68;
      this.azimuth = 0.23;
    } else {
      this.distance = 19;
      this.elevation = 0.7;
      this.azimuth = 0.12;
    }
  }
  travel(id: PlaceId) {
    const place = places.find((p) => p.id === id)!;
    if (this.phase === "welcome" || this.phase === "arriving") this.skip();
    if (!this.activated) this.activate();
    const p = nodes[place.node];
    this.env.character.position.set(p[0], 1.08, p[1] + 1.7);
    this.route = [];
    this.distance = 18;
    this.target.copy(this.env.character.position);
    this.options.onVisit(id);
  }
  private keyDown = (e: KeyboardEvent) => {
    if (
      this.paused ||
      this.phase === "welcome" ||
      this.phase === "arriving" ||
      (e.target instanceof HTMLElement &&
        e.target.closest('button,a,input,select,textarea,[role="dialog"]'))
    )
      return;
    if (
      [
        "w",
        "a",
        "s",
        "d",
        "arrowup",
        "arrowdown",
        "arrowleft",
        "arrowright",
      ].includes(e.key.toLowerCase())
    ) {
      e.preventDefault();
      this.keys.add(e.key.toLowerCase());
      this.route = [];
    }
  };
  private keyUp = (e: KeyboardEvent) => {
    this.keys.delete(e.key.toLowerCase());
  };
  private pointerDown = (e: PointerEvent) => {
    if (this.paused || this.phase === "welcome" || this.phase === "arriving")
      return;
    this.renderer.domElement.focus({ preventScroll: true });
    this.renderer.domElement.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    this.down = { x: e.clientX, y: e.clientY };
    if (this.pointers.size === 1) this.drag = false;
    if (this.pointers.size === 2) {
      this.drag = true;
      const p = [...this.pointers.values()];
      this.pinch = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
    }
  };
  private pointerMove = (e: PointerEvent) => {
    const old = this.pointers.get(e.pointerId);
    if (!old || this.paused) return;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 2) {
      const p = [...this.pointers.values()],
        len = Math.hypot(p[0].x - p[1].x, p[0].y - p[1].y);
      if (this.pinch > 0)
        this.distance = THREE.MathUtils.clamp(
          (this.distance * this.pinch) / Math.max(len, 1),
          8,
          65,
        );
      this.pinch = len;
      this.drag = true;
      return;
    }
    if (Math.hypot(e.clientX - this.down.x, e.clientY - this.down.y) > 6)
      this.drag = true;
    if (this.drag) {
      this.azimuth -= (e.clientX - old.x) * 0.006;
      this.elevation = THREE.MathUtils.clamp(
        this.elevation + (e.clientY - old.y) * 0.004,
        0.24,
        1.28,
      );
    }
  };
  private pointerUp = (e: PointerEvent) => {
    const was = this.pointers.has(e.pointerId);
    this.pointers.delete(e.pointerId);
    if (!was || this.paused) return;
    if (!this.drag && this.pointers.size === 0) {
      this.pointer.set(
        ((e.clientX - this.rect.left) / this.rect.width) * 2 - 1,
        (-(e.clientY - this.rect.top) / this.rect.height) * 2 + 1,
      );
      this.ray.setFromCamera(this.pointer, this.camera);
      const hit = new THREE.Vector3();
      const intersects = this.ray.ray.intersectPlane(
        new THREE.Plane(new THREE.Vector3(0, 1, 0), -1.08),
        hit,
      );
      if (intersects && isWalkable(hit.x, hit.z)) {
        this.route = routeTo(
          this.env.character.position.x,
          this.env.character.position.z,
          hit.x,
          hit.z,
        );
      }
    }
    if (!this.pointers.size) this.pinch = 0;
  };
  private pointerCancel = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    this.drag = true;
    this.pinch = 0;
  };
  private wheel = (e: WheelEvent) => {
    if (this.paused || this.phase === "arriving" || this.phase === "welcome")
      return;
    e.preventDefault();
    this.distance = THREE.MathUtils.clamp(
      this.distance + e.deltaY * 0.025,
      8,
      65,
    );
  };
  private tick = () => {
    this.frame = 0;
    if (this.stopped || document.hidden) return;
    const dt = Math.min(this.clock.getDelta(), 0.05);
    if (!this.paused) this.time += dt;
    if (!this.paused) {
      this.animate(dt);
      this.updateCamera(dt);
    }
    this.projectMarkers();
    try {
      if (this.composer) this.composer.render();
      else this.renderer.render(this.scene, this.camera);
    } catch {
      this.options.onError();
      this.stop();
      return;
    }
    if (!this.paused) this.frame = requestAnimationFrame(this.tick);
  };
  private animate(dt: number) {
    const { env, time } = this;
    if (env.water instanceof Water) {
      env.water.material.uniforms.time.value =
        time * (this.options.reducedMotion ? 0.1 : 0.35);
    } else {
      const m = env.water.material as THREE.MeshStandardMaterial;
      if (m.normalMap)
        m.normalMap.offset.set(
          time * (this.options.reducedMotion ? 0.001 : 0.012),
          time * (this.options.reducedMotion ? 0.0005 : 0.006),
        );
    }
    env.animated.forEach((o, i) => {
      if (!this.options.reducedMotion) {
        o.rotation.y = time * 0.35 + i;
        o.position.y = 2 + Math.sin(time + i) * 0.1;
      }
    });
    env.lights.forEach((m) => {
      m.emissiveIntensity = this.activated ? 1.8 : 0.65;
    });
    if (this.phase === "arriving") {
      this.introTime += dt;
      const t = Math.min(1, this.introTime / 10),
        ease = t * t * (3 - 2 * t);
      env.boat.position.set(
        -5 - ease * 6,
        0.25 + Math.sin(time * 2) * 0.04,
        43 - ease * 21,
      );
      env.boat.rotation.y = -0.25;
      env.character.position
        .copy(env.boat.position)
        .add(new THREE.Vector3(0, 0.57, -0.9));
      env.character.rotation.y = Math.PI;
      this.camera.position.set(
        10 - ease * 26,
        3 + Math.sin(t * Math.PI) * 5,
        49 - ease * 24,
      );
      this.camera.lookAt(-8, 3, -7);
      if (t === 1) this.skip();
      return;
    }
    const p = env.character.position;
    let moving = false;
    if (this.phase === "terminal" || this.phase === "exploring") {
      let forward = 0,
        right = 0;
      if (this.keys.has("w") || this.keys.has("arrowup")) forward = 1;
      if (this.keys.has("s") || this.keys.has("arrowdown")) forward = -1;
      if (this.keys.has("d") || this.keys.has("arrowright")) right = 1;
      if (this.keys.has("a") || this.keys.has("arrowleft")) right = -1;
      let dx = 0,
        dz = 0;
      if (forward || right) {
        dx = -Math.sin(this.azimuth) * forward + Math.cos(this.azimuth) * right;
        dz = -Math.cos(this.azimuth) * forward - Math.sin(this.azimuth) * right;
        const l = Math.hypot(dx, dz);
        dx = (dx / l) * dt * 4.8;
        dz = (dz / l) * dt * 4.8;
      } else if (this.route.length) {
        const [x, z] = this.route[0],
          len = Math.hypot(x - p.x, z - p.z);
        if (len < 0.15) this.route.shift();
        else {
          const amount = Math.min(dt * 4.8, len);
          dx = ((x - p.x) / len) * amount;
          dz = ((z - p.z) / len) * amount;
        }
      }
      if (dx || dz) {
        if (isWalkable(p.x + dx, p.z + dz)) {
          p.x += dx;
          p.z += dz;
          moving = true;
        } else if (isWalkable(p.x + dx, p.z)) {
          p.x += dx;
          moving = true;
        } else if (isWalkable(p.x, p.z + dz)) {
          p.z += dz;
          moving = true;
        } else this.route = [];
        if (moving) {
          const angle = Math.atan2(dx, dz),
            delta = Math.atan2(
              Math.sin(angle - env.character.rotation.y),
              Math.cos(angle - env.character.rotation.y),
            );
          env.character.rotation.y += delta * Math.min(1, dt * 12);
        }
      }
      const swing = moving ? Math.sin(time * 11) * 0.45 : 0;
      env.limbs.forEach(
        (l, i) => (l.rotation.x = swing * (i === 0 || i === 3 ? 1 : -1)),
      );
      const floor =
        p.x > -22.1 && p.x < -11.9 && p.z > -15.9 && p.z < -10.1
          ? 1.49
          : p.x > 0.2 && p.x < 9.8 && p.z > -22.3 && p.z < -17.7
            ? 1.3
            : Math.hypot(p.x - 27, p.z) < 4.6
              ? 1.32
              : 1.08;
      p.y = floor + (moving ? Math.abs(Math.sin(time * 11)) * 0.035 : 0);
      this.near = null;
      let best = 5;
      places.forEach((place) => {
        const [x, z] = nodes[place.node],
          d = Math.hypot(x - p.x, z - p.z);
        if (d < best) {
          best = d;
          this.near = place.id;
        }
      });
      if (this.near !== this.lastNear) {
        this.lastNear = this.near;
        this.options.onNear(this.near);
        if (this.near) this.options.onVisit(this.near);
      }
    }
    if (!this.options.reducedMotion)
      env.boat.position.y = 0.25 + Math.sin(time * 1.5) * 0.04;
  }
  private updateCamera(dt: number) {
    if (this.phase === "arriving") return;
    if (this.phase !== "welcome")
      this.target.lerp(
        this.env.character.position.clone().add(new THREE.Vector3(0, 1, 0)),
        1 - Math.exp(-dt * 3),
      );
    const desired = new THREE.Vector3(
      Math.sin(this.azimuth) * Math.cos(this.elevation) * this.distance,
      Math.sin(this.elevation) * this.distance,
      Math.cos(this.azimuth) * Math.cos(this.elevation) * this.distance,
    ).add(this.target);
    if (this.options.reducedMotion || this.time < 0.1)
      this.camera.position.copy(desired);
    else this.camera.position.lerp(desired, 1 - Math.exp(-dt * 4));
    this.camera.lookAt(this.target);
  }
  private projectMarkers() {
    places.forEach((p, i) => {
      const el = this.markers[i];
      if (!el) return;
      const [x, z] = nodes[p.node];
      this.markerVector.set(x, 3.4, z).project(this.camera);
      const visible =
        this.phase !== "welcome" &&
        this.phase !== "arriving" &&
        !this.paused &&
        this.markerVector.z > -1 &&
        this.markerVector.z < 1 &&
        Math.abs(this.markerVector.x) < 0.92 &&
        Math.abs(this.markerVector.y) < 0.82;
      el.style.display = visible ? "" : "none";
      if (visible) {
        el.style.transform = `translate(${(this.markerVector.x * 0.5 + 0.5) * this.rect.width}px,${(-this.markerVector.y * 0.5 + 0.5) * this.rect.height}px) translate(-50%,-100%)`;
        el.dataset.near = String(this.near === p.id);
      }
    });
  }
  private stop() {
    this.stopped = true;
    cancelAnimationFrame(this.frame);
    this.frame = 0;
  }
  dispose() {
    this.stop();
    this.abort.abort();
    this.observer.disconnect();
    const textures = new Set<THREE.Texture>(),
      geometries = new Set<THREE.BufferGeometry>(),
      materials = new Set<THREE.Material>();
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        geometries.add(o.geometry);
        (Array.isArray(o.material) ? o.material : [o.material]).forEach(
          (m: THREE.Material) => {
            materials.add(m);
            Object.values(m).forEach((v) => {
              if (v instanceof THREE.Texture) textures.add(v);
            });
            if (m instanceof THREE.ShaderMaterial)
              Object.values(m.uniforms).forEach((u) => {
                if (u.value instanceof THREE.Texture) textures.add(u.value);
              });
          },
        );
      }
      if (o instanceof THREE.Light && "shadow" in o)
        (o as THREE.DirectionalLight).shadow?.dispose();
    });
    geometries.forEach((g) => g.dispose());
    materials.forEach((m) => m.dispose());
    textures.forEach((t) => t.dispose());
    this.env.reflectionTargets.forEach((t) => t.dispose());
    this.composer?.passes.forEach((p) => p.dispose());
    this.composer?.dispose();
    this.renderer.dispose();
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}
