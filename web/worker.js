import { WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "../node_modules/@bjorn3/browser_wasi_shim/dist/index.js";
import { loadPreopens } from './list-benchmarks.js';

let preopenDir = null;
let loadingPreopens = false;
let toRun = [];
let running = false;
let wasm = null;

onmessage = async (e) => {
  if (preopenDir === null && !loadingPreopens) {
    let [a, b] = e.data;
    wasm = b;

    loadingPreopens = true;
    preopenDir = await loadPreopens(a);
    loadingPreopens = false;
  } else {
    toRun.push(e.data);
  }
  await tryRun();
};

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
    const wasi = new WASI(args, env, fds, { debug: false });
    const inst = await WebAssembly.instantiate(wasm, {
        "wasi_snapshot_preview1": wasi.wasiImport,
    });
    wasi.start(inst);
  }
}
