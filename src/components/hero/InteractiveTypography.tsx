import { type RefObject, useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

type RootRef = RefObject<HTMLElement | null>;

interface InteractiveTypographyProps {
  rootRef: RootRef;
}

const vertexShaderSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * 0.5 + 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision highp float;
uniform sampler2D uText;
uniform vec2 uPointer;
uniform vec2 uResolution;
uniform float uActive;
uniform float uTime;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 345.45));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);
  vec2 delta = uv - uPointer;
  delta.x *= aspect;

  float organic = (noise(uv * 5.5 + vec2(uTime * 0.035, -uTime * 0.02)) - 0.5) * 0.085;
  float radius = 0.235 + organic;
  float distanceToPointer = length(delta);
  float reveal = smoothstep(radius + 0.075, radius - 0.025, distanceToPointer) * uActive;

  if (reveal < 0.002) discard;

  float wobble = (noise(uv * 8.0 + uPointer * 4.0 + uTime * 0.055) - 0.5) * 0.008 * reveal;
  vec2 sampleUv = uv + vec2(wobble, wobble * 0.45);
  float alpha = texture2D(uText, sampleUv).a;

  vec2 texel = 1.0 / max(uResolution, vec2(1.0));
  float ax1 = texture2D(uText, sampleUv + vec2(texel.x * 3.0, 0.0)).a;
  float ax2 = texture2D(uText, sampleUv - vec2(texel.x * 3.0, 0.0)).a;
  float ay1 = texture2D(uText, sampleUv + vec2(0.0, texel.y * 3.0)).a;
  float ay2 = texture2D(uText, sampleUv - vec2(0.0, texel.y * 3.0)).a;
  vec2 gradient = vec2(ax1 - ax2, ay1 - ay2);
  float edge = clamp(length(gradient) * 3.8, 0.0, 1.0);

  if (alpha < 0.015) {
    float membrane = smoothstep(radius + 0.018, radius - 0.035, distanceToPointer) * 0.085 * uActive;
    gl_FragColor = vec4(0.055, 0.11, 0.09, membrane * (1.0 - alpha));
    return;
  }

  float band = 0.5 + 0.5 * sin(sampleUv.y * 20.0 + noise(sampleUv * 4.0) * 2.6 + uTime * 0.18);
  float highlight = pow(1.0 - abs(fract(sampleUv.y * 3.4 + noise(sampleUv * 3.0) * 0.08) - 0.5) * 2.0, 9.0);
  float depth = smoothstep(0.0, 0.85, alpha) * (0.72 + edge * 0.28);

  vec3 darkMetal = vec3(0.055, 0.095, 0.085);
  vec3 silver = vec3(0.93, 0.94, 0.90);
  vec3 heritage = vec3(0.16, 0.31, 0.23);
  vec3 metallic = mix(darkMetal, silver, pow(band, 1.18));
  metallic = mix(metallic, heritage, 0.28 + noise(sampleUv * 6.0) * 0.12);
  metallic += vec3(0.30, 0.38, 0.33) * edge;
  metallic += vec3(0.28, 0.32, 0.30) * highlight;
  metallic *= 0.88 + depth * 0.22;

  gl_FragColor = vec4(metallic, alpha * reveal);
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("Heritage Green hero shader compilation failed", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertex = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);

  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("Heritage Green hero WebGL program failed", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function drawTextWithSpacing(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number,
) {
  let cursor = x;
  for (const character of text) {
    ctx.fillText(character, cursor, y);
    cursor += ctx.measureText(character).width + spacing;
  }
}

export function InteractiveTypography({ rootRef }: InteractiveTypographyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;

    const root = rootRef.current;
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const positionLocation = gl.getAttribLocation(program, "aPosition");
    const pointerLocation = gl.getUniformLocation(program, "uPointer");
    const resolutionLocation = gl.getUniformLocation(program, "uResolution");
    const activeLocation = gl.getUniformLocation(program, "uActive");
    const timeLocation = gl.getUniformLocation(program, "uTime");
    const textLocation = gl.getUniformLocation(program, "uText");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    const textCanvas = document.createElement("canvas");
    const textContext = textCanvas.getContext("2d");
    if (!textContext) return;

    let width = 1;
    let height = 1;
    let dpr = 1;
    let raf = 0;
    let active = 0;
    let targetActive = 0;
    let pointerX = 0.5;
    let pointerY = 0.5;
    let targetX = 0.5;
    let targetY = 0.5;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchGestureActive = false;
    let running = true;

    const updatePointer = (clientX: number, clientY: number) => {
      const rect = root.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      targetX = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      targetY = 1 - Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));
    };

    const rebuildTextTexture = () => {
      const rootRect = root.getBoundingClientRect();
      width = Math.max(1, Math.round(rootRect.width));
      height = Math.max(1, Math.round(rootRect.height));
      dpr = Math.min(window.devicePixelRatio || 1, width < 700 ? 1.5 : 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      textCanvas.width = canvas.width;
      textCanvas.height = canvas.height;

      textContext.setTransform(dpr, 0, 0, dpr, 0, 0);
      textContext.clearRect(0, 0, width, height);
      textContext.fillStyle = "#ffffff";
      textContext.textBaseline = "top";

      const nodes = root.querySelectorAll<HTMLElement>("[data-hero-word]");
      nodes.forEach((node) => {
        const rect = node.getBoundingClientRect();
        const style = window.getComputedStyle(node);
        const fontSize = Number.parseFloat(style.fontSize) || 80;
        const fontWeight = style.fontWeight || "800";
        const fontFamily = style.fontFamily || "Manrope, sans-serif";
        const letterSpacing = Number.parseFloat(style.letterSpacing) || 0;
        textContext.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        drawTextWithSpacing(
          textContext,
          node.textContent || "",
          rect.left - rootRect.left,
          rect.top - rootRect.top,
          letterSpacing,
        );
      });

      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textCanvas);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const onPointerEnter = (event: PointerEvent) => {
      if (event.pointerType !== "touch") {
        updatePointer(event.clientX, event.clientY);
        targetActive = 1;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        const dx = event.clientX - touchStartX;
        const dy = event.clientY - touchStartY;
        if (!touchGestureActive && Math.abs(dx) > 9 && Math.abs(dx) > Math.abs(dy) * 1.15) {
          touchGestureActive = true;
          targetActive = 1;
        }
        if (touchGestureActive) {
          updatePointer(event.clientX, event.clientY);
        }
        return;
      }

      updatePointer(event.clientX, event.clientY);
      targetActive = 1;
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.pointerType === "touch") {
        touchStartX = event.clientX;
        touchStartY = event.clientY;
        touchGestureActive = false;
        return;
      }
      updatePointer(event.clientX, event.clientY);
      targetActive = 1;
    };

    const closeInteraction = (event?: PointerEvent) => {
      if (!event || event.pointerType === "touch" || event.pointerType === "mouse" || event.pointerType === "pen") {
        targetActive = 0;
        touchGestureActive = false;
      }
    };

    const resizeObserver = new ResizeObserver(rebuildTextTexture);
    resizeObserver.observe(root);
    document.fonts?.ready.then(rebuildTextTexture).catch(() => rebuildTextTexture());
    rebuildTextTexture();

    root.addEventListener("pointerenter", onPointerEnter, { passive: true });
    root.addEventListener("pointermove", onPointerMove, { passive: true });
    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    root.addEventListener("pointerleave", closeInteraction, { passive: true });
    root.addEventListener("pointerup", closeInteraction, { passive: true });
    root.addEventListener("pointercancel", closeInteraction, { passive: true });

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textLocation, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const start = performance.now();
    const render = (now: number) => {
      if (!running) return;
      pointerX += (targetX - pointerX) * 0.095;
      pointerY += (targetY - pointerY) * 0.095;
      active += (targetActive - active) * 0.11;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(pointerLocation, pointerX, pointerY);
      gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
      gl.uniform1f(activeLocation, active);
      gl.uniform1f(timeLocation, (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      root.removeEventListener("pointerenter", onPointerEnter);
      root.removeEventListener("pointermove", onPointerMove);
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("pointerleave", closeInteraction);
      root.removeEventListener("pointerup", closeInteraction);
      root.removeEventListener("pointercancel", closeInteraction);
      if (texture) gl.deleteTexture(texture);
      if (buffer) gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, [reduceMotion, rootRef]);

  if (reduceMotion) return null;

  return <canvas ref={canvasRef} className="hero-webgl" aria-hidden="true" />;
}
