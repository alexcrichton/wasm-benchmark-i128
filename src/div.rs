use criterion::Criterion;
use num_bigint_dig::RandBigInt;
use rand::SeedableRng;
use rand_xoshiro::Xoshiro256StarStar;

pub fn bignum(c: &mut Criterion) {
    let mut rng = Xoshiro256StarStar::seed_from_u64(31);
    let x = rng.gen_bigint(1 << 16);
    let y = rng.gen_bigint(1 << 12);

    c.bench_function("div-bignum", move |b| b.iter(|| &x / &y));
}
