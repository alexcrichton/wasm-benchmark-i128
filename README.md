# Benchmarks for i128 in wasm

Collecting data for https://github.com/WebAssembly/128-bit-arithmetic/

## Running benchmarks

First install some dependencies:

* [Rust & Cargo](https://rustup.rs/)
  * run `rustup target add wasm32-wasip1` for a compilation target
* [Wasmtime](https://wasmtime.dev/)
* [Node.js & NPM](https://nodejs.org/)


Then collect data for your native platform:

```
$ cargo run --release -- --bench --save-baseline native
```

Then collect data for Wasmtime

```
$ export CARGO_TARGET_WASM32_WASIP1_RUNNER='wasmtime --dir .'
$ cargo run --release --target wasm32-wasip1 -- --bench --baseline native
```

Then collect data for Node.js

```
$ cargo build --release --target wasm32-wasip1
$ node run-node.js target/wasm32-wasip1/release/wasm-benchmark-i128.wasm --bench --baseline native
```

Then collect data in the browser by building and serving the contents of this
repository in the browser:

```
$ cargo build --release --target wasm32-wasip1
$ http
```

Each link at the top can be used to run the benchmark. Note that the formatting
is a bit weird.
