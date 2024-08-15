mod add;
mod div;
mod mul;
mod shift;

criterion::criterion_group!(
    benches,
    mul::blind_sig,
    mul::lehmer,
    mul::bignum,
    add::fib,
    shift::shl,
    shift::shr,
    div::bignum,
);
criterion::criterion_main!(benches);
