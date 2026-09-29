import { useEffect, useRef, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";

// One mask is shared by the background eraser and the actual rounded letter meshes.
const maskGLSL = `
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform float uReveal;
uniform float uTime;
uniform float uRadius;
float revealMask() {
 vec2 p = gl_FragCoord.xy / uResolution - uPointer;
 p *= uResolution / min(uResolution.x, uResolution.y);
 float a = atan(p.y, p.x);
 float edge = 1.0 + .12*sin(a*3.0+uTime*.7) + .07*cos(a*5.0-uTime*.4);
 float d = length(p);
 return (1.0-smoothstep(uRadius*edge*uReveal*.70,uRadius*edge*uReveal,d))*uReveal;
}`;

export default function InteractiveTypography({
  rootRef,
}: {
  rootRef: RefObject<HTMLElement | null>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = useReducedMotion();
  useEffect(() => {
    const root = rootRef.current,
      canvas = canvasRef.current;
    if (
      !root ||
      !canvas ||
      reduced ||
      (navigator as Navigator & { deviceMemory?: number }).deviceMemory === 1
    )
      return;
    let disposed = false,
      raf = 0,
      inView = true,
      active = false,
      last = 0,
      settled = 0;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: "low-power",
      });
    } catch {
      return;
    }
    const gl = renderer.getContext();
    const info = gl.getExtension("WEBGL_debug_renderer_info");
    const software =
      info &&
      /swiftshader|llvmpipe|software/i.test(
        String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)),
      );
    renderer.setPixelRatio(
      software
        ? 1
        : Math.min(
            window.devicePixelRatio,
            window.innerWidth < 700 ? 1.4 : 1.75,
          ),
    );
    renderer.setClearColor(0, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 1, 0, 0.1, 2500);
    camera.position.z = 1000;
    const pmrem = new THREE.PMREMGenerator(renderer),
      room = new RoomEnvironment();
    const environment = pmrem.fromScene(room, 0.025);
    scene.environment = environment.texture;
    room.dispose();
    pmrem.dispose();
    scene.add(new THREE.AmbientLight(0xffffff, 1.3));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-200, 500, 700);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xcbd8cd, 2.2);
    fill.position.set(700, 100, 300);
    scene.add(fill);
    const uniforms = {
      uPointer: { value: new THREE.Vector2(-2, -2) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uReveal: { value: 0 },
      uTime: { value: 0 },
      uRadius: { value: 0.31 },
    };
    const target = new THREE.Vector2(-2, -2);
    const geometryGroup = new THREE.Group();
    scene.add(geometryGroup);
    const materials: THREE.MeshPhysicalMaterial[] = [];
    const eraseMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms,
      vertexShader:
        "void main(){gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}",
      fragmentShader: `precision highp float; ${maskGLSL} void main(){float m=revealMask(); if(m<.005) discard; gl_FragColor=vec4(vec3(.98039,.97255,.94902),m);}`,
    });
    const eraser = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), eraseMaterial);
    eraser.position.z = -100;
    scene.add(eraser);
    const fontPromise = fetch("/fonts/manrope-inflated.json.gz").then(
      async (response) => {
        if (!response.ok) throw new Error("Typography unavailable");
        const bytes = await response.arrayBuffer();
        const signature = new Uint8Array(bytes, 0, 2);
        let decoded = new Response(bytes);
        // Vite sends Content-Encoding:gzip; static hosts may serve the raw gzip.
        if (signature[0] === 0x1f && signature[1] === 0x8b) {
          if (!decoded.body || typeof DecompressionStream === "undefined")
            throw new Error("Compressed typography unsupported");
          decoded = new Response(
            decoded.body.pipeThrough(new DecompressionStream("gzip")),
          );
        }
        return decoded.json() as Promise<
          Record<
            string,
            {
              position: number[];
              normal: number[];
              index: number[];
              advance: number;
            }
          >
        >;
      },
    );
    let resizeObserver: ResizeObserver | undefined;
    const clearGeometry = () => {
      for (const child of [...geometryGroup.children]) {
        (child as THREE.Mesh).geometry.dispose();
        geometryGroup.remove(child);
      }
      materials.forEach((m) => m.dispose());
      materials.length = 0;
    };
    function render(t: number) {
      raf = 0;
      if (disposed || !inView || document.hidden) return;
      const dt = Math.min((t - last) / 1000, 0.25) || 0.016;
      last = t;
      uniforms.uPointer.value.lerp(target, 1 - Math.exp(-dt * 13));
      uniforms.uReveal.value = THREE.MathUtils.damp(
        uniforms.uReveal.value,
        active ? 1 : 0,
        active ? 9 : 12,
        dt,
      );
      uniforms.uTime.value = t * 0.001;
      if (!active && uniforms.uReveal.value < 0.004) {
        uniforms.uReveal.value = 0;
        renderer.clear();
        canvas!.dataset.state = "idle";
        return;
      }
      canvas!.dataset.state = "revealing";
      renderer.render(scene, camera);
      // Stop GPU work once a stationary pointer has settled. Resume on pointer movement.
      if (
        active &&
        target.distanceTo(uniforms.uPointer.value) < 0.0001 &&
        uniforms.uReveal.value > 0.999
      )
        settled += dt;
      else settled = 0;
      if (settled < 0.7 || !active) raf = requestAnimationFrame(render);
    }
    const wake = () => {
      settled = 0;
      if (!raf && inView && !document.hidden)
        raf = requestAnimationFrame(render);
    };
    let touchStart: { x: number; y: number } | null = null;
    const point = (event: PointerEvent) => {
      const b = root.getBoundingClientRect();
      target.set(
        (event.clientX - b.left) / b.width,
        1 - (event.clientY - b.top) / b.height,
      );
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        if (!touchStart) return;
        const dx = Math.abs(event.clientX - touchStart.x),
          dy = Math.abs(event.clientY - touchStart.y);
        if (dy > dx && dy > 10) {
          touchStart = null;
          active = false;
          wake();
          return;
        }
        if (dx < 7 && !active) return;
      }
      if ((event.target as HTMLElement).closest("a,button")) {
        active = false;
        wake();
        return;
      }
      point(event);
      active = true;
      wake();
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch")
        touchStart = { x: event.clientX, y: event.clientY };
    };
    const leave = () => {
      touchStart = null;
      active = false;
      wake();
    };
    const visibility = () => {
      if (document.hidden) {
        active = false;
        cancelAnimationFrame(raf);
        raf = 0;
        renderer.clear();
      } else wake();
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView) wake();
        else {
          active = false;
          uniforms.uReveal.value = 0;
          cancelAnimationFrame(raf);
          raf = 0;
          renderer.clear();
        }
      },
      { threshold: 0.05 },
    );
    observer.observe(root);
    const lost = (event: Event) => {
      event.preventDefault();
      leave();
      canvas.style.visibility = "hidden";
    };
    canvas.addEventListener("webglcontextlost", lost);
    Promise.all([fontPromise, document.fonts.ready])
      .then(([font]) => {
        if (disposed) return;
        const measure = document.createElement("canvas").getContext("2d")!;
        const layout = () => {
          if (disposed) return;
          clearGeometry();
          const rect = root.getBoundingClientRect(),
            w = rect.width,
            h = rect.height;
          renderer.setSize(w, h, false);
          renderer.getDrawingBufferSize(uniforms.uResolution.value);
          camera.right = w;
          camera.top = h;
          camera.updateProjectionMatrix();
          eraser.scale.set(w, h, 1);
          eraser.position.set(w / 2, h / 2, -100);
          root
            .querySelectorAll<HTMLElement>("[data-hero-word]")
            .forEach((element, index) => {
              const style = getComputedStyle(element),
                size = parseFloat(style.fontSize),
                box = element.getBoundingClientRect();
              const text = element.textContent || "";
              measure.font = `800 ${size}px Manrope Variable`;
              const metrics = measure.measureText(text),
                ascent = metrics.actualBoundingBoxAscent,
                descent = metrics.actualBoundingBoxDescent;
              const baseline =
                box.top -
                rect.top +
                (box.height - ascent - descent) / 2 +
                ascent;
              const material = new THREE.MeshPhysicalMaterial({
                color: index === 1 ? 0x77927c : 0xdce3df,
                metalness: 1,
                roughness: 0.34,
                clearcoat: 1,
                clearcoatRoughness: 0.12,
                envMapIntensity: 1.5,
                transparent: true,
              });
              material.onBeforeCompile = (shader) => {
                Object.assign(shader.uniforms, uniforms);
                shader.vertexShader = shader.vertexShader.replace(
                  "#include <common>",
                  `#include <common>\nuniform vec2 uPointer; uniform vec2 uResolution; uniform float uReveal; uniform float uTime;`,
                );
                shader.vertexShader = shader.vertexShader.replace(
                  "#include <begin_vertex>",
                  `#include <begin_vertex>\nfloat wave=sin(position.x*.025+uPointer.x*4.0)*cos(position.y*.023+uPointer.y*3.0); transformed.z += wave*2.5*uReveal;`,
                );
                shader.fragmentShader = shader.fragmentShader.replace(
                  "#include <common>",
                  `#include <common>\n${maskGLSL}`,
                );
                shader.fragmentShader = shader.fragmentShader.replace(
                  "#include <opaque_fragment>",
                  `float maskValue = revealMask(); if(maskValue<.005) discard; diffuseColor.a *= maskValue;\n#include <opaque_fragment>`,
                );
              };
              materials.push(material);
              // Generate each glyph with genuine beveled 3D contours, retaining DOM letter spacing.
              const spacing = parseFloat(style.letterSpacing) || 0;
              let x = 0;
              for (const char of text) {
                const glyph = font[char];
                const geometry = new THREE.BufferGeometry();
                geometry.setAttribute(
                  "position",
                  new THREE.Float32BufferAttribute(glyph.position, 3),
                );
                geometry.setAttribute(
                  "normal",
                  new THREE.Float32BufferAttribute(glyph.normal, 3),
                );
                geometry.setIndex(glyph.index);
                const mesh = new THREE.Mesh(geometry, material);
                const scale = size / 100;
                mesh.scale.set(scale, scale, scale);
                mesh.position.set(box.left - rect.left + x, h - baseline, 0);
                geometryGroup.add(mesh);
                x += font[char].advance * size + spacing;
              }
            });
          renderer.compile(scene, camera);
          canvas.dataset.ready = "true";
          renderer.clear();
          if (active) wake();
        };
        layout();
        resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(root);
      })
      .catch((error: unknown) => {
        canvas.dataset.error =
          error instanceof Error ? error.message : String(error);
        canvas.style.visibility = "hidden";
      });
    root.addEventListener("pointermove", move);
    root.addEventListener("pointerdown", down);
    root.addEventListener("pointerleave", leave);
    root.addEventListener("pointerup", leave);
    root.addEventListener("pointercancel", leave);
    document.addEventListener("visibilitychange", visibility);
    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      observer.disconnect();
      resizeObserver?.disconnect();
      root.removeEventListener("pointermove", move);
      root.removeEventListener("pointerdown", down);
      root.removeEventListener("pointerleave", leave);
      root.removeEventListener("pointerup", leave);
      root.removeEventListener("pointercancel", leave);
      document.removeEventListener("visibilitychange", visibility);
      canvas.removeEventListener("webglcontextlost", lost);
      clearGeometry();
      eraser.geometry.dispose();
      eraseMaterial.dispose();
      environment.dispose();
      renderer.dispose();
    };
  }, [rootRef, reduced]);
  return (
    <canvas
      ref={canvasRef}
      className="hero-webgl"
      aria-hidden="true"
      data-state="idle"
    />
  );
}
