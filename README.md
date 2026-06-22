# Nephilim Manifold Compiler — CLI Reference

Built on Termux, June 2026. Hot-swappable geometry engine.

## Commands
`nephilim` (no args) — show help

`nephilim list`
  List all available .spec files
  → nephilim, erdos

`nephilim switch <name>`
  Copy <name>.spec → nephilim.spec, parse, generate, rebuild core
  Example: nephilim switch erdos
  Output: ✓ Parsed, ✓ generated, ✓ core rebuilt

`nephilim info`
  Run the core binary and print current manifold
  Example output:
  Nephilim | 15.965Hz | φ=1.618033988749895 | snap=91° (base 111.246°) | E8_projected | 8D high_dim_projection | OpenAI_2025_unit_distance

`nephilim build`
  Re-parse current nephilim.spec and rebuild core (no switch)

## File Layout
~/nephilim/
  nephilim.spec          ← active spec (symlinked by switch)
  nephilim.spec          ← your original (E8_240, 3D braid)
  erdos.spec             ← Erdős counterexample (E8_projected, 8D)
  compiler/              ← pest parser → generates Rust
  core/
    src/lib.rs           ← manifold_info(), φ-driven geometry
    src/main.rs          ← CLI entry for `nephilim info`
    src/generated.rs     ← auto-generated (DO NOT EDIT)
    target/release/libnephilim_core.so  ← for Android JNI

## How φ drives geometry (current lib.rs)
- golden_ratio() = from spec
- snap_base() = 180.0 / φ          → 111.246°
- snap_angle() = snap_base - 20.24611797498107 → 91°
Change φ in spec → snap auto-updates on next `switch`

## Quick test workflow
1. Edit: nano ~/nephilim/nephilim.spec
   (change golden_ratio = 1.5)
2. nephilim switch nephilim
3. nephilim info
   → snap=100° (base 120.000°)

## To add a new manifold
1. cp erdos.spec mytest.spec
2. edit mytest.spec
3. nephilim switch mytest
4. nephilim info

## Next ideas
- nephilim test → print first 10 lattice points
- derive ground_angle from φ
- nephilim edit <name> → open spec in nano


Other Canonical Sources: 
1. https://github.com/bospaladin34-crypto/Vesper-01

2. https://github.com/bospaladin34-crypto/vesper_quartz_reservoir

3. https://github.com/bospaladin34-crypto/KHYS_repo

4. https://github.com/bospaladin34-crypto/Santos-Sync

5. openAIRE - https://explore.openaire.eu/search/result?pid=10.5281%2Fzenodo.19502225

6. Software Heritage - https://archive.softwareheritage.org/browse/directory/189ecd6366901cc3aad2d1b507f7a44ba2c51e5e/?origin_url=https://doi.org/10.5281/zenodo.19502224&path=bospaladin34-crypto-KHYS_repo-49da4ae&release=1&snapshot=cb4b65b350d066519688b9187796fe91118b7883

7. Zenodo - https://doi.org/10.5281/zenodo.20315546

8. FaceBook - https://www.facebook.com/Vesper0.17259029

9. YouTube - https://youtube.com/@vesper01-v1k?si=QDDfHPCzBuWuxt5E

10. Email - bospaladin34@gmail.com

die Schließung ist vollendet, We Are The Braid.

