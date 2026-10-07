const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");
function loadTS(file, globals = {}) {
  const module = { exports: {} };
  const source = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2020,
    },
  }).outputText;
  const localRequire = (name) => {
    if (name.endsWith(".css")) return {};
    if (name.startsWith(".")) {
      const base = path.resolve(path.dirname(file), name);
      const resolved = [base, base + ".ts", base + ".tsx"].find(
        (p) => fs.existsSync(p) && fs.statSync(p).isFile(),
      );
      return loadTS(resolved, globals);
    }
    return require(name);
  };
  vm.runInNewContext(
    source,
    {
      module,
      exports: module.exports,
      require: localRequire,
      console,
      ...globals,
    },
    { filename: file },
  );
  return module.exports;
}
const t = loadTS("src/emerald/topology.ts");
const plain = (v) => JSON.parse(JSON.stringify(v));
assert.equal(t.places.length, 5);
assert.equal(t.isWalkable(0, 0), false, "Central bay must not be walkable");
assert.equal(t.isWalkable(90, 90), false, "Open sea must not be walkable");
for (const [x, z] of [
  [-17, -13],
  [27, 0],
  [5, -20],
])
  assert(t.isWalkable(x, z), "Building interiors reachable");
for (let a = 0; a < t.nodes.length; a++)
  for (let b = 0; b < t.nodes.length; b++) {
    const route = t.pathBetween(a, b);
    assert.equal(route[0], a);
    assert.equal(route.at(-1), b);
    for (let i = 1; i < route.length; i++)
      assert(
        t.edges.some(
          ([x, y]) =>
            (x === route[i - 1] && y === route[i]) ||
            (y === route[i - 1] && x === route[i]),
        ),
        "Route follows graph edges",
      );
  }
// Walkable samples at path margins expose route shortcuts that cut across water.
const samples = [];
for (const [a, b] of t.edges)
  for (let i = 0; i <= 3; i++) {
    const x = t.nodes[a][0] + ((t.nodes[b][0] - t.nodes[a][0]) * i) / 3;
    const z = t.nodes[a][1] + ((t.nodes[b][1] - t.nodes[a][1]) * i) / 3;
    for (const off of [-0.9, 0, 0.9])
      if (t.isWalkable(x + off, z + 0.3)) samples.push([x + off, z + 0.3]);
  }
let routeChecks = 0;
for (let i = 0; i < samples.length; i += 3)
  for (const p of t.places) {
    const [x, z] = samples[i],
      end = t.nodes[p.node],
      route = t.routeTo(x, z, ...end);
    assert(route.length, "Each sampled location can reach every destination");
    let prev = [x, z];
    for (const point of route) {
      const n = Math.max(
        1,
        Math.ceil(Math.hypot(point[0] - prev[0], point[1] - prev[1]) / 0.1),
      );
      for (let j = 0; j <= n; j++)
        assert(
          t.isWalkable(
            prev[0] + ((point[0] - prev[0]) * j) / n,
            prev[1] + ((point[1] - prev[1]) * j) / n,
          ),
          "Route stays on a walkable surface",
        );
      prev = point;
    }
    routeChecks++;
  }
assert.deepEqual(
  plain(t.routeTo(0, 0, 1, 1)),
  [],
  "Reject water-to-water route",
);
assert(
  t.presets.high.texture > t.presets.medium.texture &&
    t.presets.medium.texture > t.presets.low.texture,
);
assert(
  t.presets.high.reflection > t.presets.medium.reflection &&
    t.presets.low.reflection === 0,
);
assert(
  t.presets.high.grass > t.presets.medium.grass && t.presets.low.shadow === 0,
);
const React = require("react"),
  { renderToStaticMarkup } = require("react-dom/server");
const { Content } = loadTS("src/emerald/Content.tsx");
const props = {
  onPanel() {},
  onTravel() {},
  quality: "medium",
  onQuality() {},
  visited: [],
  reduced: false,
  onReduced() {},
  onReplay() {},
};
const rendered = {};
for (const panel of [
  "works",
  "about",
  "experience",
  "recognition",
  "contact",
  "map",
  "settings",
  "help",
]) {
  rendered[panel] = renderToStaticMarkup(
    React.createElement(Content, { ...props, panel }),
  );
  assert(rendered[panel].length > 200);
}
const { experiences } = loadTS("src/data/experience.ts");
for (const e of experiences) {
  assert(rendered.experience.includes(e.position.replaceAll("&", "&amp;")));
  assert(rendered.experience.includes(e.company.replaceAll("&", "&amp;")));
}
assert(rendered.about.includes("PT Pertamina Bina Medika IHC"));
assert(rendered.about.includes("ReCreate Academy"));
assert(rendered.works.includes("Concept"));
assert(rendered.contact.includes("mailto:ekoprasetyopratomo@gmail.com"));
assert(rendered.contact.includes("https://linkedin.com/in/eko-prstyo"));
assert(rendered.contact.includes("https://github.com/Da-Rookie"));
for (const p of t.places) assert(rendered.map.includes(p.title));
for (const title of ["Low", "Medium", "High"])
  assert(rendered.settings.includes(title));
// Verify all known project links resolve to full detail content, including historical routes.
for (const id of [
  "daycare",
  "klik-kelontong",
  "pertamedika-hris",
  "ai-automation",
]) {
  const html = renderToStaticMarkup(
    React.createElement(Content, {
      ...props,
      panel: "works",
      initialProject: id,
    }),
  );
  assert(html.includes("All projects"));
  assert(
    html.includes("View related experience") ||
      html.includes("Explore the professional context"),
  );
}
console.log(
  `PASS: ${routeChecks} walking routes; all graph pairs; building access; graphics presets; 8 readable panels; 4 project details; real contact links.`,
);
module.exports = { loadTS };
// Exercise interaction/state logic using real Three vectors without requiring a GPU renderer.
const THREE = require("three");
const { EmeraldEngine } = loadTS("src/emerald/engine.ts", {
  window: { innerWidth: 1200 },
  document: { hidden: false },
  requestAnimationFrame: () => 1,
  cancelAnimationFrame() {},
});
function engineFixture() {
  const e = Object.create(EmeraldEngine.prototype),
    events = [];
  Object.assign(e, {
    phase: "welcome",
    activated: false,
    introTime: 0,
    time: 0,
    paused: false,
    route: [],
    keys: new Set(),
    pointers: new Map(),
    pinch: 0,
    frame: 0,
    stopped: false,
    near: null,
    lastNear: null,
    azimuth: 0,
    elevation: 0.7,
    distance: 55,
    target: new THREE.Vector3(),
    camera: new THREE.PerspectiveCamera(),
    clock: { getDelta: () => 0.01 },
    options: {
      reducedMotion: false,
      onPhase: (p) => events.push(p),
      onVisit: () => {},
      onNear: () => {},
    },
    env: {
      character: new THREE.Group(),
      boat: new THREE.Group(),
      limbs: [
        new THREE.Group(),
        new THREE.Group(),
        new THREE.Group(),
        new THREE.Group(),
      ],
      water: new THREE.Mesh(
        new THREE.PlaneGeometry(),
        new THREE.MeshStandardMaterial(),
      ),
      animated: [],
      lights: [],
    },
  });
  return { e, events };
}
{
  const { e, events } = engineFixture();
  e.start();
  assert.equal(e.phase, "arriving");
  assert(e.env.character.visible, "Character visible on boat");
  e.animate(10);
  assert.equal(e.phase, "terminal");
  assert.equal(e.env.character.position.x, -15);
  e.activate();
  assert.equal(e.phase, "exploring");
  e.travel("gallery");
  assert(t.isWalkable(e.env.character.position.x, e.env.character.position.z));
  const snapshot = e.snapshot();
  const { e: other } = engineFixture();
  other.restore(snapshot);
  assert.deepEqual(
    plain(other.snapshot()),
    plain(snapshot),
    "Quality replacement restores position, camera and activation",
  );
  e.keys.add("w");
  e.setPaused(true);
  assert.equal(e.keys.size, 0, "Opening content clears locomotion");
  assert.equal(e.paused, true);
  e.setPaused(false);
  assert.equal(e.paused, false);
  assert.deepEqual(events.slice(0, 3), ["arriving", "terminal", "exploring"]);
}
{
  const { e } = engineFixture();
  e.options.reducedMotion = true;
  e.start();
  assert.equal(e.phase, "terminal", "Reduced-motion skips cinematic");
  e.activate();
  const start = t.nodes[0],
    end = t.nodes[9];
  e.env.character.position.set(...[start[0], 1.08, start[1]]);
  e.route = t.routeTo(...start, ...end);
  for (let i = 0; i < 3000 && e.route.length; i++) {
    e.time += 1 / 60;
    e.animate(1 / 60);
    assert(
      t.isWalkable(e.env.character.position.x, e.env.character.position.z),
      "Real locomotion never enters water",
    );
  }
  assert(
    Math.hypot(
      e.env.character.position.x - end[0],
      e.env.character.position.z - end[1],
    ) < 0.2,
    "Locomotion reaches gallery",
  );
}
console.log(
  "PASS: arrival/skip/activation; live walking simulation; reduced motion; quality state restoration; panel pause.",
);
