use criterion::Criterion;
use num_bigint_dig::ToBigUint;

pub fn shl(c: &mut Criterion) {
    let n = 1.to_biguint().unwrap() << 1000;

    c.bench_function("shl", move |b| {
        b.iter(|| {
            let mut m = n.clone();
            for i in 0..50 {
                m = m << i;
            }
        })
    });
}

pub fn shr(c: &mut Criterion) {
    let n = 1.to_biguint().unwrap() << 2000;

    c.bench_function("shr", move |b| {
        b.iter(|| {
            let mut m = n.clone();
            for i in 0..50 {
                m = m << i;
            }
        })
    });
}
