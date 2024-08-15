use criterion::Criterion;
use num_bigint_dig::RandBigInt;
use rand::rngs::SmallRng;
use rand::SeedableRng;

pub fn bignum(c: &mut Criterion) {
    let mut rng = SmallRng::seed_from_u64(10);
    let x = rng.gen_bigint(1 << 16);
    let y = rng.gen_bigint(1 << 12);

    c.bench_function("div-bignum", move |b| b.iter(|| &x / &y));
}
