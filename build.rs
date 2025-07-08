use std::env;
use std::path::PathBuf;
use std::process::Command;

fn main() {
    if !cfg!(feature = "i256") {
        return;
    }

    let out_dir = PathBuf::from(env::var_os("OUT_DIR").unwrap());
    let obj = out_dir.join("i256.o");
    let lib = out_dir.join("libi256.a");
    let target = env::var("TARGET").unwrap();

    let llc = env::var("LLC").unwrap_or("llc".to_string());
    let mut cmd = Command::new(&llc);
    cmd.arg("-filetype=obj")
        .arg("-mtriple")
        .arg(&target)
        .arg("./i256.ll")
        .arg("-o")
        .arg(&obj);

    if target.starts_with("wasm") {
        println!("cargo::rerun-if-env-changed=WIDE");
        if env::var("WIDE").is_ok() {
            cmd.arg("-mattr=+wide-arithmetic");
        }
    }

    run(&mut cmd);

    let ar = env::var("AR").unwrap_or("llvm-ar".to_string());
    run(Command::new(&ar).arg("crus").arg(&lib).arg(&obj));

    println!("cargo::rerun-if-changed=./i256.ll");
    println!("cargo::rerun-if-env-changed=LLC");
    println!("cargo::rerun-if-env-changed=AR");

    println!("cargo::rustc-link-lib=static=i256");
    println!("cargo::rustc-link-search=native={}", out_dir.display());
}

fn run(cmd: &mut Command) {
    println!("{cmd:?}");
    let status = cmd.status().unwrap();
    println!("{status}");
    assert!(status.success());
}
