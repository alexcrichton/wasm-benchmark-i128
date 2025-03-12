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

Instructions below are how to build the benchmark program, a Rust binary, and
then compare the benchmark results in wasm to those that are collected above on
native. By default the wide-arithmetic proposal is disabled in Rust so the
instructions below collect baseline "wasm today" data. To collect data with wide
arithmetic use:

```
$ export CARGO_TARGET_WASM32_WASIP1_RUSTFLAGS=-Ctarget-feature=+wide-arithmetic
```

Set that before the `cargo build` or the `cargo run` command to pass the right
flags to the compiler to enable wide-arithmetic instructions.

Note that support for `-Ctarget-feature=+wide-arithmetic` is only in Rust 1.87.0
which is currently the Nightly Rust channel. That means you'll need to be using
a Nightly Rust compiler and `rustc -vV` should LLVM version 20.1.0. To run the
Nightly compiler you'll use `cargo +nightly run ...` or `cargo +nightly build
...`, basically add `+nightly` right after the `cargo` executable.

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
