import { runAllForCli } from './web/list-benchmarks.js';

load('./global.js');

const wasmBytes = read(arguments[0], 'binary');
const module = new WebAssembly.Module(wasmBytes);
await runAllForCli(module, arguments, print, printErr);
