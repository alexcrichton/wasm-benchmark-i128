use criterion::Criterion;
use num_bigint_dig::{BigInt, BigUint, RandBigInt};
use rand::SeedableRng;
use rand_xoshiro::Xoshiro256StarStar;
use std::hint::black_box;

fn bench_u(c: &mut Criterion, name: &str, cmp: impl Fn(&BigUint, &BigUint) -> bool) {
    let mut rng = Xoshiro256StarStar::seed_from_u64(31);
    let mut x = Vec::new();
    let mut y = Vec::new();

    for _ in 0..200 {
        x.push(rng.gen_biguint(1 << 6));
        y.push(rng.gen_biguint(1 << 6));
    }

    c.bench_function(name, move |b| {
        b.iter(|| {
            let cnt = x.iter().zip(y.iter()).filter(|(x, y)| cmp(x, y)).count();
            black_box(cnt);
        })
    });
}

fn bench_s(c: &mut Criterion, name: &str, cmp: impl Fn(&BigInt, &BigInt) -> bool) {
    let mut rng = Xoshiro256StarStar::seed_from_u64(31);
    let mut x = Vec::new();
    let mut y = Vec::new();

    for _ in 0..200 {
        x.push(rng.gen_bigint(1 << 16));
        y.push(rng.gen_bigint(1 << 16));
    }

    c.bench_function(name, move |b| {
        b.iter(|| {
            let cnt = x.iter().zip(y.iter()).filter(|(x, y)| cmp(x, y)).count();
            black_box(cnt);
        })
    });
}

pub fn lt_u(c: &mut Criterion) {
    bench_u(c, "cmp lt_u", |a, b| a < b);
}

pub fn le_u(c: &mut Criterion) {
    bench_u(c, "cmp le_u", |a, b| a <= b);
}

pub fn lt_s(c: &mut Criterion) {
    bench_s(c, "cmp lt_s", |a, b| a < b);
}

pub fn le_s(c: &mut Criterion) {
    bench_s(c, "cmp le_s", |a, b| a <= b);
}