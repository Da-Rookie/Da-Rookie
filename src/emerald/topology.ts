export type PlaceId = "arrival" | "lab" | "terrace" | "gallery" | "contact";
export type PanelId =
  | "works"
  | "about"
  | "experience"
  | "recognition"
  | "contact"
  | "map"
  | "settings"
  | "help";
export type Quality = "low" | "medium" | "high";
export const presets = {
  low: {
    dpr: 1,
    texture: 256,
    shadow: 0,
    reflection: 0,
    trees: 22,
    grass: 0,
    bloom: false,
  },
  medium: {
    dpr: 1.5,
    texture: 512,
    shadow: 1024,
    reflection: 256,
    trees: 38,
    grass: 650,
    bloom: false,
  },
  high: {
    dpr: 2,
    texture: 2048,
    shadow: 2048,
    reflection: 1024,
    trees: 65,
    grass: 2400,
    bloom: true,
  },
} as const;
export const places: {
  id: PlaceId;
  title: string;
  label: string;
  description: string;
  panel: PanelId;
  node: number;
  color: string;
}[] = [
  {
    id: "arrival",
    title: "Arrival pier",
    label: "The beginning",
    description: "Arrive. Activate. Explore.",
    panel: "help",
    node: 0,
    color: "#b7f2d3",
  },
  {
    id: "lab",
    title: "The project lab",
    label: "Selected work",
    description: "Ideas made tangible. Systems made useful.",
    panel: "works",
    node: 3,
    color: "#85eddc",
  },
  {
    id: "terrace",
    title: "The working terrace",
    label: "Meet Eko",
    description: "The person, the practice, the professional journey.",
    panel: "about",
    node: 6,
    color: "#c6d8a0",
  },
  {
    id: "gallery",
    title: "The recognition gallery",
    label: "A trail of evidence",
    description: "Work recognized. Knowledge shared.",
    panel: "recognition",
    node: 9,
    color: "#e0b6ee",
  },
  {
    id: "contact",
    title: "The conversation deck",
    label: "What comes next",
    description: "Good work begins with a conversation.",
    panel: "contact",
    node: 12,
    color: "#e9c799",
  },
];
// The waterfront is a continuous, single-island loop. Nodes lie on raised paths/platforms.
export const nodes: [number, number][] = [
  [-15, 17],
  [-18, 11],
  [-18, 2],
  [-16, -7],
  [-11, -13],
  [-3, -16],
  [5, -15],
  [13, -13],
  [19, -8],
  [21, 0],
  [21, 8],
  [17, 14],
  [9, 18],
  [1, 19],
  [-7, 19],
  [-17, -13],
  [27, 0],
  [5, -20],
];
export const edges: [number, number][] = [
  ...nodes.slice(0, 15).map((_, i) => [i, (i + 1) % 15] as [number, number]),
  [3, 15],
  [9, 16],
  [6, 17],
];
export const PATH_WIDTH = 3.6;
export const platformRadius = (i: number) =>
  [0, 3, 6, 9, 12].includes(i) ? 4.5 : 2.2;
export function nearestNode(x: number, z: number) {
  let best = 0,
    d = Infinity;
  nodes.forEach(([nx, nz], i) => {
    const v = Math.hypot(nx - x, nz - z);
    if (v < d) {
      best = i;
      d = v;
    }
  });
  return best;
}
export function pointOnSegment(
  x: number,
  z: number,
  a: [number, number],
  b: [number, number],
) {
  const dx = b[0] - a[0],
    dz = b[1] - a[1];
  const t = Math.max(
    0,
    Math.min(1, ((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz)),
  );
  return [a[0] + dx * t, a[1] + dz * t] as [number, number];
}
export function isWalkable(x: number, z: number) {
  // Interior floor regions join the waterfront; world furniture stays outside the movement lane.
  const insideLab = x > -22.1 && x < -11.9 && z > -15.9 && z < -10.1;
  const insideTerrace = x > 0.2 && x < 9.8 && z > -22.3 && z < -17.7;
  const insideGallery = Math.hypot(x - 27, z) < 4.6;
  return (
    insideLab ||
    insideTerrace ||
    insideGallery ||
    nodes.some(
      ([nx, nz], i) => Math.hypot(x - nx, z - nz) <= platformRadius(i) - 0.45,
    ) ||
    edges.some(([a, b]) => {
      const p = pointOnSegment(x, z, nodes[a], nodes[b]);
      return Math.hypot(x - p[0], z - p[1]) <= PATH_WIDTH / 2 - 0.35;
    })
  );
}
export function pathBetween(from: number, to: number): number[] {
  const dist = nodes.map(() => Infinity),
    prev = nodes.map(() => -1),
    seen = new Set<number>();
  dist[from] = 0;
  while (seen.size < nodes.length) {
    let u = -1;
    nodes.forEach((_, i) => {
      if (!seen.has(i) && (u < 0 || dist[i] < dist[u])) u = i;
    });
    if (u < 0 || !Number.isFinite(dist[u])) break;
    if (u === to) break;
    seen.add(u);
    for (const [a, b] of edges) {
      const v = a === u ? b : b === u ? a : -1;
      if (v < 0) continue;
      const d =
        dist[u] +
        Math.hypot(nodes[u][0] - nodes[v][0], nodes[u][1] - nodes[v][1]);
      if (d < dist[v]) {
        dist[v] = d;
        prev[v] = u;
      }
    }
  }
  const route = [to];
  while (route[0] !== from && prev[route[0]] >= 0)
    route.unshift(prev[route[0]]);
  return route[0] === from ? route : [];
}
function segmentWalkable(a: [number, number], b: [number, number]) {
  const samples = Math.max(
    2,
    Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]) / 0.18),
  );
  for (let i = 0; i <= samples; i++)
    if (
      !isWalkable(
        a[0] + ((b[0] - a[0]) * i) / samples,
        a[1] + ((b[1] - a[1]) * i) / samples,
      )
    )
      return false;
  return true;
}
export function routeTo(
  x: number,
  z: number,
  tx: number,
  tz: number,
): [number, number][] {
  const start: [number, number] = [x, z],
    end: [number, number] = [tx, tz];
  if (!isWalkable(x, z) || !isWalkable(tx, tz)) return [];
  if (segmentWalkable(start, end)) return [end];
  const starts = nodes
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => segmentWalkable(start, p));
  const ends = nodes
    .map((p, i) => ({ p, i }))
    .filter(({ p }) => segmentWalkable(p, end));
  let best: [number, number][] = [],
    cost = Infinity;
  for (const a of starts)
    for (const b of ends) {
      const path = [start, ...pathBetween(a.i, b.i).map((i) => nodes[i]), end];
      const length = path
        .slice(1)
        .reduce(
          (n, p, i) => n + Math.hypot(p[0] - path[i][0], p[1] - path[i][1]),
          0,
        );
      if (length < cost) {
        cost = length;
        best = path.slice(1);
      }
    }
  return best;
}
