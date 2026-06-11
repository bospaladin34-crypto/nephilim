# Nephilim OS — Commands

## Project layout
~/nephilim/
  core/       → Rust library (libnephilim_core.so)
  compiler/   → nephilimc (pest parser)
  nephilim.spec → your manifold
  erdos.spec    → Erdős test case

## Build core
cd ~/nephilim/core
cargo build --release
# output: target/release/libnephilim_core.so

## Run compiler (default spec)
cd ~/nephilim/compiler
cargo run -- ../nephilim.spec

## Run compiler (Erdős)
cargo run -- ../erdos.spec

## View generated constants
cat ../core/src/generated.rs

## Edit spec
nano ../nephilim.spec   # change clock, nu_p, etc.

## Git push
cd ~/nephilim
git add .
git commit -m "update manifold"
git push origin master

## Clean rebuild
cd ~/nephilim/compiler
cargo clean && cargo run -- ../nephilim.spec
