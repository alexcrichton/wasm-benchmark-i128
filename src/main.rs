use criterion::Criterion;

mod add;
mod cmp;
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
    cmp::sort(&mut c);

    // seems to not be too useful since the underlying algorithm doesn't
    // actually use 128-bit integers.
    if false {
        cmp::lt_u(&mut c);
        cmp::lt_s(&mut c);
        cmp::le_u(&mut c);
        cmp::le_s(&mut c);
    }

    #[cfg(feature = "i256")]
    {
        add::add256(&mut c);
        mul::mul256(&mut c);
    }

    c.final_summary();
}
