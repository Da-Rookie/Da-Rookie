// Guard locked V1 experience fields against accidental rewriting.
const fs = require("node:fs"),
  vm = require("node:vm"),
  cp = require("node:child_process"),
  ts = require("typescript"),
  assert = require("node:assert/strict");
function readTS(source) {
  const context = { exports: {} };
  vm.runInNewContext(
    ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    }).outputText,
    context,
  );
  return JSON.parse(JSON.stringify(context.exports));
}
const original = readTS(
  cp.execFileSync("git", ["show", "87e1578:src/data/experience.ts"], {
    encoding: "utf8",
  }),
).experiences;
const current = readTS(
  fs.readFileSync("src/data/experience.ts", "utf8"),
).experiences;
assert.deepEqual(
  current.filter((x) => x.id !== "pertamedika-ai"),
  original,
  "V1 Experience changed",
);
const ai = current.find((x) => x.id === "pertamedika-ai");
assert.equal(ai.company, "PT Pertamedika");
assert.equal(ai.startDate, "Aug 2026");
assert.equal(ai.workMode, "On-site");
assert.equal(current.filter((x) => !x.endDate).length, 2);
assert.ok(
  !JSON.stringify(
    readTS(fs.readFileSync("src/data/achievements.ts", "utf8")),
  ).includes("KMI"),
);
console.log(
  "PASS: 7 original V1 experiences identical; AI Engineer verified; 2 current roles; no KMI achievement.",
);
