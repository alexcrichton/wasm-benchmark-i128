use criterion::Criterion;

mod add;
mod div;
mod mul;
mod shift;

fn main() {
    let mut c = Criterion::default().configure_from_args();

    mul::blind_sig(&mut c);
    mul::lehmer(&mut c);
    mul::bignum(&mut c);
    add::fib(&mut c);
    shift::shl(&mut c);
    shift::shr(&mut c);
    div::bignum(&mut c);

    c.final_summary();
}
