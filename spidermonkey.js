import { runAllForCli } from './web/list-benchmarks.js';

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
await runAllForCli(module, scriptArgs, putstr, printErr);
