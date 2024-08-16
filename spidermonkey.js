import { strace, WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "node_modules/@bjorn3/browser_wasi_shim/dist/index.js";
import { listBenchmarks, loadPreopens } from './web/list-benchmarks.js';

async function ionCompile(wasm) {
  let module = await WebAssembly.compile(wasm);
  while (!wasmHasTier2CompilationCompleted(module)) {
    sleep(1);
  }
  // wasmDis(module);
  return module;
}

const wasmBytes = os.file.readFile(scriptArgs[0], "binary");
const module = await ionCompile(wasmBytes);
const benchmarks = await listBenchmarks(module);
const preopens = await loadPreopens(benchmarks);

const stdin = new OpenFile(new File([]));
const env = [];
const decoder = new TextDecoder('utf-8');
const fds = [
  stdin,
  new ConsoleStdout(msg => putstr(decoder.decode(msg))),
  new ConsoleStdout(msg => printErr(decoder.decode(msg))),
  preopens,
];
const wasi = new WASI(scriptArgs, env, fds, { debug: false });
const inst = await WebAssembly.instantiate(module, {
    "wasi_snapshot_preview1": wasi.wasiImport,
});
wasi.start(inst);
