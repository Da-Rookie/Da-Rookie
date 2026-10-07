import * as THREE from "three";
export function random(seed = 41) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
export function surface(
  size: number,
  kind: "stone" | "wood" | "grass" | "metal",
) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const data = ctx.createImageData(size, size);
  const rng = random(57);
  const base =
    kind === "stone"
      ? [115, 124, 113]
      : kind === "wood"
        ? [102, 76, 49]
        : kind === "grass"
          ? [54, 80, 49]
          : [82, 102, 98];
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const grain =
        kind === "wood"
          ? Math.sin(y * 0.36 + Math.sin(x * 0.015) * 2) * 10
          : kind === "metal"
            ? Math.sin(y * 2) * 5
            : Math.sin(x * 0.024) * Math.cos(y * 0.047) * 9;
      const n = (rng() - 0.5) * (kind === "grass" ? 64 : 35) + grain;
      const i = (y * size + x) * 4;
      data.data[i] = base[0] + n;
      data.data[i + 1] = base[1] + n;
      data.data[i + 2] = base[2] + n;
      data.data[i + 3] = 255;
    }
  ctx.putImageData(data, 0, 0);
  if (kind === "wood") {
    ctx.strokeStyle = "#372b2160";
    ctx.lineWidth = 2;
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      ctx.moveTo(0, (i * size) / 8);
      ctx.lineTo(size, (i * size) / 8);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  tex.repeat.set(kind === "grass" ? 8 : 3, kind === "grass" ? 8 : 3);
  return tex;
}
export function waterNormal(size = 256) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d")!,
    d = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++)
    for (let x = 0; x < size; x++) {
      const i = (y * size + x) * 4;
      d.data[i] =
        128 +
        Math.sin(
          (x / size) * Math.PI * 16 + Math.sin((y / size) * Math.PI * 8),
        ) *
          42;
      d.data[i + 1] =
        128 +
        Math.cos(
          (y / size) * Math.PI * 12 + Math.sin((x / size) * Math.PI * 4),
        ) *
          42;
      d.data[i + 2] = 235;
      d.data[i + 3] = 255;
    }
  ctx.putImageData(d, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}
export function labelTexture(title: string, subtitle = "") {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#b9f3d9";
  ctx.textAlign = "center";
  ctx.font = "500 56px sans-serif";
  ctx.fillText(title, 512, 104);
  ctx.fillStyle = "#e0ebe1";
  ctx.font = "26px sans-serif";
  ctx.fillText(subtitle, 512, 168);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
