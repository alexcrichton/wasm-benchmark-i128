use criterion::Criterion;
use num_bigint_dig::{BigUint, ToBigUint};
use std::mem::replace;

pub fn fib(c: &mut Criterion) {
    fn fib(n: usize) -> BigUint {
        let mut f0 = 0u32.to_biguint().unwrap();
        let mut f1 = 1u32.to_biguint().unwrap();
        for _ in 0..n {
            let f2 = f0 + &f1;
            f0 = replace(&mut f1, f2);
        }
        f0
    }

    c.bench_function("fib_10000", move |b| b.iter(|| fib(10000)));
}
