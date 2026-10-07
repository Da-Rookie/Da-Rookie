const fs = require("node:fs"),
  vm = require("node:vm"),
  ts = require("typescript"),
  assert = require("node:assert/strict");
function readTS(file) {
  const context = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(fs.readFileSync(file, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    context,
  );
  return JSON.parse(JSON.stringify(context.exports));
}
const original = JSON.parse(
  fs.readFileSync("docs/v3/persona-baseline.json", "utf8"),
).experiences;
const current = readTS("src/data/experience.ts").experiences;
assert.equal(current.length, 8);
assert.deepEqual(
  current.filter((e) => e.id !== "pertamedika-ai"),
  original.filter((e) => e.id !== "pertamedika-ai"),
  "Seven pre-existing experiences must stay unchanged",
);
const ai = current.find((e) => e.id === "pertamedika-ai"),
  oldAI = original.find((e) => e.id === "pertamedika-ai");
assert.deepEqual(
  { ...ai, company: oldAI.company, description: oldAI.description },
  oldAI,
  "AI role factual fields unchanged except explicit owner corrections",
);
assert.equal(ai.company, "PT Pertamina Bina Medika IHC");
assert.deepEqual(ai.description, [
  "Building the Daycare Module as part of the Laravel-based internal system.",
  "Integrating LLM-based agents and n8n workflows into the Daycare system to support child information automation.",
  ...oldAI.description.slice(2),
]);
const active = current.filter((e) => !e.endDate);
assert.deepEqual(
  active.map((e) => [e.position, e.company]),
  [
    ["AI Engineer", "PT Pertamina Bina Medika IHC"],
    ["Project Manager", "ReCreate Academy"],
  ],
);
assert.deepEqual(readTS("src/data/profile.ts").profile.titles, [
  "Full-Stack Developer",
  "AI Engineer",
  "Project Manager",
]);
for (const f of [
  "src/App.tsx",
  "src/emerald/Content.tsx",
  "src/data/profile.ts",
  "index.html",
])
  assert(
    !fs.readFileSync(f, "utf8").includes("Data & Business Automation"),
    `Prohibited positioning in ${f}`,
  );
console.log(
  "PASS: 8 experiences; 2 exact current roles; 7 unchanged career records; only approved AI corrections; locked identity.",
);
