pub struct PuzzlePiece { pub id: u16, pub vertices: Vec<(f64,f64)>, pub area: f64 }
pub struct Stomachion { pub solutions: Vec<Vec<PuzzlePiece>> }
pub struct Tangram { pub solutions: Vec<Vec<PuzzlePiece>> }

impl Stomachion {
    pub fn new() -> Self {
        let mut sols = Vec::with_capacity(536);
        for i in 0..536 { sols.push(generate_stomachion_variant(i)); }
        Stomachion { solutions: sols }
    }
}

impl Tangram {
    pub fn new() -> Self {
        let mut sols = Vec::with_capacity(1600);
        for i in 0..1600 { sols.push(generate_tangram_variant(i)); }
        Tangram { solutions: sols }
    }
}

fn generate_stomachion_variant(seed: usize) -> Vec<PuzzlePiece> {
    (0..14).map(|i| {
        let angle = (seed as f64 + i as f64) * 2.0 * std::f64::consts::PI / 14.0;
        PuzzlePiece { id: i as u16, vertices: vec![(angle.cos()*0.5, angle.sin()*0.5)], area: 1.0/14.0 }
    }).collect()
}

fn generate_tangram_variant(seed: usize) -> Vec<PuzzlePiece> {
    // FIX: 7 sizes for 7 pieces (2 large, 1 medium, 2 small, 1 square, 1 parallelogram)
    let sizes = [0.5, 0.5, 0.353553, 0.25, 0.25, 0.176777, 0.176777];
    (0..7).map(|i| {
        let rot = (seed as f64 + i as f64) * std::f64::consts::PI / 4.0;
        PuzzlePiece { id: i as u16, vertices: vec![(rot.cos()*sizes[i], rot.sin()*sizes[i])], area: sizes[i]*sizes[i] }
    }).collect()
}

pub fn map_semantic_to_puzzle(text: &str, _s: &Stomachion, _t: &Tangram) -> String {
    let hash = text.bytes().fold(0u32, |a,b| a.wrapping_mul(31).wrapping_add(b as u32));
    let s_idx = (hash as usize) % 536;
    let t_idx = (hash as usize >> 8) % 1600;
    let nu_p = 0.17259029;
    let e8_root = ((hash as f64 * nu_p) % 240.0) as u16;
    format!("text:'{}' | stomachion:{} tangram:{} | E8_root:{} | pieces:14+7", text, s_idx, t_idx, e8_root)
}
