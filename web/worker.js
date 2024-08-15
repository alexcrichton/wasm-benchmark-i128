import { WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "https://unpkg.com/@bjorn3/browser_wasi_shim@0.3.0/dist/index.js";

let preopenDir = null;
let loadingPreopens = false;
let toRun = [];
let running = false;
let wasm = null;

onmessage = (e) => {
  if (preopenDir === null && !loadingPreopens) {
    let [a, b] = e.data;
    wasm = b;
    loadPreopens(a);
  } else {
    toRun.push(e.data);
    tryRun();
  }
};

async function loadPreopens(benchmarks) {
  loadingPreopens = true;
  let criterionEntries = [];
  for (let bench of benchmarks) {
    let files = [];
    for (let file of ["estimates.json", "tukey.json", "sample.json", "benchmark.json"]) {
      const response = await fetch(`../target/criterion/${bench}/native/${file}`);
      const blob = await response.blob();
      const buffer = await blob.arrayBuffer();
      files.push([file, new File(buffer)]);
    }
    const nativeDir = new Directory(files);
    const benchDir = new Directory([["native", nativeDir]]);
    criterionEntries.push([bench, benchDir]);
  }
  const criterionDir = new Directory(criterionEntries);
  const targetDir = new Directory([["criterion", criterionDir]]);
  preopenDir = new PreopenDirectory(".", [["target", targetDir]]);
  loadingPreopens = false;
  tryRun();
}

async function tryRun() {
  if (preopenDir === null)
    return;
  while (true) {
    const args = toRun.shift();
    if (args === undefined)
      return;

    const stdin = new OpenFile(new File([]));
    const env = [];
    const fds = [
      stdin,
      new ConsoleStdout(msg => postMessage(['stdout', msg])),
      new ConsoleStdout(msg => postMessage(['stderr', msg])),
      preopenDir,
    ];
    const wasi = new WASI(args, env, fds);
    const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": wasi.wasiImport,
    });
    wasi.start(inst);
  }
}
