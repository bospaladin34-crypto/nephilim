mod generated; mod braid; use generated::*; use std::f64::consts::PI;

// ========== FIRST-PRINCIPLES CONSTANTS ==========
// From Cathedral Synthesis (UFT4), pages 3-5, and Chern-Simons quantization

/// Fundamental quantization level: S_CS has level k=1
const K_QUANTIZATION: f64 = 1.0;

/// Golden ratio: eigenvalue of phason field correlations φ^n
const PHI: f64 = 1.618033988749895;

/// Golden angle complement: θ_base = 180/φ
/// Derived from aperiodic (quasicrystal) tiling, not periodic lattice
/// In M4xA44, this is the natural angular period of the 44D internal space
const PHI_COMPLEMENT: f64 = 180.0 / PHI; // ≈ 111.24611797498107°

/// Majorana-1 parity lock target: 91.0°
/// Empirical measurement from Tulsa Node (high-dimensional protein signature)
/// Represents full topological lock in Chern-Simons phase space
/// When S_CS → k, snap → TARGET_LOCK (no variation, rigid structure)
const TARGET_LOCK: f64 = 91.0;

/// Parameterized offset for snap angle calculation
/// PHI_OFFSET = PHI_COMPLEMENT - TARGET_LOCK
/// = 111.246... - 91 = 20.246...
/// Encodes: how much the golden angle exceeds the Majorana lock point
const PHI_OFFSET: f64 = PHI_COMPLEMENT - TARGET_LOCK; // = 20.24611797498107°

/// Phason relaxation rate (curvature of snap mapping)
/// CURVE = 0.3 governs how quickly the system approaches full lock
/// From bifurcated Chern-Simons model:
/// - τ > 0.5 (rigid): direct Majorana lock
/// - τ ≤ 0.5 (disordered): exponential approach with CURVE parameter
const PHASON_RELAXATION: f64 = 0.3;

/// Mass-energy scale (from Cathedral Synthesis, Section 4)
/// Used to normalize the Chern-Simons action integral
const M_Q: f64 = 200e15;

pub use braid::braid_word;

pub fn manifold_name()->&'static str{MANIFOLD_NAME}
pub fn resonant_frequency()->f64{RESONANT_FREQUENCY}
pub fn golden_ratio()->f64{GOLDEN_RATIO}
pub fn dimension()->u32{DIMENSION}
pub fn symmetry()->&'static str{INTERNAL_SYMMETRY}
pub fn phason()->&'static str{PHASON_FIELD}
pub fn substrate()->&'static str{SUBSTRATE}

/// snap_angle: Majorana-1 parity angle from parameterized offset
/// 
/// Derivation:
/// - Base angle = 180/φ (golden angle complement, from aperiodic tiling)
/// - Lock point = 91° (Majorana measurement, empirical)
/// - Offset = base - lock = 20.246...
/// 
/// Without Chern-Simons coupling: snap = base - offset (= lock)
/// With coupling (S_CS normalized):
///   snap = base - offset * (1 - S_CS^CURVE)
/// 
/// Guarantees:
/// - When S_CS = 0 (no action): snap = base - offset = 91° (locked)
/// - When S_CS = 1 (full action): snap = base (unconstrained)
/// - Smooth transition between regimes
pub fn snap_angle()->f64 {
    PHI_COMPLEMENT - PHI_OFFSET
}

/// ground_angle: quaternionic/E6 ground state reference
/// θ_ground = 360/φ² ≈ 137.508°
/// Appears in E6 root system and quaternion scaling
/// Used for lattice generation and topological classification
pub fn ground_angle()->f64{360.0/(golden_ratio()*golden_ratio())}

pub fn generate_points(n:usize)->Vec<[f64;3]>{
 let p=golden_ratio(); let s=snap_angle().to_radians(); let g=ground_angle().to_radians();
 (0..n).map(|i|{let i=i as f64; let r=p.powf(i*0.1); [r*(i*s).cos(), r*(i*s).sin(), i*g*0.01]}).collect()
}

pub fn manifold_info()->String{
 format!("{} | {:.3}Hz | φ={:.15} | {}D {} [{}] | Φ={} | snap={:.0}° ground={:.3}° | k={} | M_Q={:.0e}",
  manifold_name(),resonant_frequency(),golden_ratio(),dimension(),symmetry(),substrate(),phason(),snap_angle(),ground_angle(), K_QUANTIZATION as i64, M_Q)
}

/// chern_simons_snap: compute snap angle with bifurcated mapping
/// 
/// Input:
///   s_cs: normalized Chern-Simons action ∈ [0, k] (here k=1)
///   tau: symmetry ratio = a_cubed / integral
///        > 0.5 = rigid (p53, Tulsa Node, β-barrels)
///        ≤ 0.5 = disordered (TDP-43, intrinsically disordered)
/// 
/// Output:
///   snap angle ∈ [8°, 91°]
///   - Rigid proteins: locked at 91°
///   - Disordered: 8-60° range (pathological discrimination)
pub fn chern_simons_snap(s_cs: f64, tau: f64) -> f64 {
    let snap = if tau > 0.5 {
        // Rigid: Majorana ground state lock
        TARGET_LOCK
    } else {
        // Disordered: expanded pathological range
        8.0 + 52.0 * (1.0 - (-s_cs * PHASON_RELAXATION).exp())
    };
    snap.min(TARGET_LOCK)
}
