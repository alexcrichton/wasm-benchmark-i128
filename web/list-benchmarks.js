import { strace, WASI, File, Directory, OpenFile, ConsoleStdout, PreopenDirectory }
  from "../node_modules/@bjorn3/browser_wasi_shim/dist/index.js";

export async function listBenchmarks(wasm) {
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
    new ConsoleStdout(console.log),
  ];
  let args = ["foo.wasm", "--list"]
  let env = ["FOO=bar"];
  let wasi = new WASI(args, env, fds, { debug: false });

  let inst = await WebAssembly.instantiate(wasm, {
      "wasi_snapshot_preview1": wasi.wasiImport,
  });
  wasi.start(inst);

  return benchmarks;
}

export async function loadPreopens(benchmarks) {
  let criterionEntries = [];
  for (let bench of benchmarks) {
    let files = [];
    for (let file of ["estimates.json", "tukey.json", "sample.json", "benchmark.json"]) {
      let path = `target/criterion/${bench}/native/${file}`;
      if (typeof os !== 'undefined') {
        const bytes = os.file.readFile(path, "binary");
        files.push([file, new File(bytes)]);
      } else {
        const response = await fetch(`../${path}`);
        const blob = await response.blob();
        const buffer = await blob.arrayBuffer();
        files.push([file, new File(buffer)]);
      }
    }
    const nativeDir = new Directory(files);
    const benchDir = new Directory([["native", nativeDir]]);
    criterionEntries.push([bench, benchDir]);
  }
  const criterionDir = new Directory(criterionEntries);
  const targetDir = new Directory([["criterion", criterionDir]]);
  return new PreopenDirectory(".", [["target", targetDir]]);
}
