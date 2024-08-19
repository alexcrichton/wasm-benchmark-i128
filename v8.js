import { runAllForCli } from './web/list-benchmarks.js';

d8.file.execute('./global.js');

const wasmBytes = readbuffer(arguments[0]);
const module = new WebAssembly.Module(wasmBytes);
await runAllForCli(module, arguments, write, write);
