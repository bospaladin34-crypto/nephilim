pub mod generated;

pub fn golden_ratio() -> f64 {
    generated::CHRONOMETRY_GOLDEN_RATIO.parse().unwrap_or(1.618033988749895)
}
pub fn clock_hz() -> f64 {
    generated::CHRONOMETRY_CLOCK.parse().unwrap_or(15.965)
}
pub fn phase_delta() -> f64 {
    generated::CHRONOMETRY_PHASE_DELTA.parse().unwrap_or(0.17259029)
}

// φ drives the geometry
pub fn snap_base() -> f64 {
    180.0 / golden_ratio()  // = 111.246...
}
pub fn snap_angle() -> i32 {
    // tuned offset to hit your 91° braid
    (snap_base() - 20.24611797498107).round() as i32
}
pub fn ground_angle() -> i32 {
    generated::TOPOLOGY_GROUND_ANGLE.parse().unwrap_or(108)
}

pub fn manifold_info() -> String {
    format!(
        "Nephilim | {}Hz | φ={:.15} | snap={}° (base {:.3}°) | {} | {}D {} | {}",
        generated::CHRONOMETRY_CLOCK,
        golden_ratio(),
        snap_angle(),
        snap_base(),
        generated::TOPOLOGY_LATTICE,
        generated::GEOMETRY_DIMENSION,
        generated::GEOMETRY_METHOD,
        generated::GUARDIAN_NOTE
    )
}
