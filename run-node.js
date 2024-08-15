const { readFile } = require('node:fs/promises');
const { WASI } = require('node:wasi');
const { argv, env } = require('node:process');
const { join } = require('node:path');

const wasi = new WASI({
  version: 'preview1',
  args: argv.slice(2),
  env,
  preopens: { '.': '.' },
});

(async () => {
  const wasm = await WebAssembly.compile(await readFile(argv[2]));
  const instance = await WebAssembly.instantiate(wasm, wasi.getImportObject());
  wasi.start(instance);
})();
