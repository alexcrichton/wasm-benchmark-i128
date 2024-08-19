# Benchmarks for i128 in wasm

Collecting data for https://github.com/WebAssembly/128-bit-arithmetic/

## Running benchmarks

First install some dependencies:

* [Rust & Cargo](https://rustup.rs/)
  * run `rustup target add wasm32-wasip1` for a compilation target
* [Wasmtime](https://wasmtime.dev/)
* [Node.js & NPM](https://nodejs.org/)
* [JSVU][jsvu] to get some JS runtimes

Then collect data for your native platform:

```
$ cargo run --release -- --bench --save-baseline native
```

### Wasmtime

```
$ export CARGO_TARGET_WASM32_WASIP1_RUNNER='wasmtime --dir .'
$ cargo run --release --target wasm32-wasip1 -- --bench --baseline native
```

### Node.js

```
$ cargo build --release --target wasm32-wasip1
$ node run-node.js target/wasm32-wasip1/release/wasm-benchmark-i128.wasm --bench --baseline native
```

### Browser

```
$ cargo build --release --target wasm32-wasip1
$ http
```

Each link at the top can be used to run the benchmark. Note that the formatting
is a bit weird

### Spidermonkey

Use [jsvu] to get a `spidermonkey` executable then:

```
$ cargo build --release --target wasm32-wasip1
$ spidermonkey -m spidermonkey.js ./global.js \
    ./target/wasm32-wasip1/release/wasm-benchmark-i128.wasm \
    --bench --baseline native
```

[jsvu]: https://github.com/GoogleChromeLabs/jsvu

### V8

Use [jsvu] to get a `v8` executable then:

```
$ cargo build --release --target wasm32-wasip1
$ v8 --module v8.js -- \
    ./target/wasm32-wasip1/release/wasm-benchmark-i128.wasm \
    --bench --baseline native
```

Note that this will "hang" for a moment without intermediate output as results
are generated.

### JSC

Use [jsvu] to get a `jsc` executable then:

```
$ cargo build --release --target wasm32-wasip1
$ jsc -m jsc.js -- \
    ./target/wasm32-wasip1/release/wasm-benchmark-i128.wasm \
    --bench --baseline native
```
