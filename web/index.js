import { WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "https://unpkg.com/@bjorn3/browser_wasi_shim@0.3.0/dist/index.js";

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

const stdin = new OpenFile(new File([]));

let benchmarks = [];
let fds = [
  stdin,
  ConsoleStdout.lineBuffered(msg => {
    if (msg == '')
      return;
    const i = msg.indexOf(':');
    if (i != -1)
      benchmarks.push(msg.substring(0, i));
  }),
  ConsoleStdout.lineBuffered(appendStderr),
];
let args = ["foo.wasm", "--list"]
let env = ["FOO=bar"];
let wasi = new WASI(args, env, fds);

let inst = await WebAssembly.instantiate(wasm, {
    "wasi_snapshot_preview1": wasi.wasiImport,
});
wasi.start(inst);

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
  console.log('worker error', e);
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
