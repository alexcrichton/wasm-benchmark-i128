import { WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "../node_modules/@bjorn3/browser_wasi_shim/dist/index.js";
import { listBenchmarks } from './list-benchmarks.js';

const wasm = await WebAssembly.compileStreaming(fetch("target/wasm32-wasip1/release/wasm-benchmark-i128.wasm"));

const benchmarksDiv = document.getElementById('benchmarks');
const terminal = new Terminal();
const fitAddon = new FitAddon.FitAddon();
terminal.loadAddon(fitAddon);
terminal.open(document.getElementById('terminal'));
fitAddon.fit();

function appendStdout(msg) {
  terminal.write(msg);
}
function appendStderr(msg) {
  terminal.write(msg);
}

let benchmarks = await listBenchmarks(wasm);

const benchmarker = new Worker("./web/worker.js", { type: "module" });

benchmarker.postMessage([benchmarks, wasm]);
benchmarker.onmessage = (e) => {
  let [kind, msg] = e.data;
  if (kind == 'stdout')
    appendStdout(msg);
  else if (kind == 'stderr')
    appendStderr(msg);
  else
    console.log('unknown from worker', e);
};
benchmarker.onerror = (e) => {
  console.log('worker error', e, e.data);
};

for (let benchmark of benchmarks) {
  const link = document.createElement('a');
  link.href = '#';
  link.textContent = benchmark;
  link.onclick = () => {
    benchmarker.postMessage(["foo.wasm", "--bench", "--baseline=native", benchmark])
    return false;
  };
  benchmarksDiv.appendChild(link);
  benchmarksDiv.htmlContent += '&middot;';
}
