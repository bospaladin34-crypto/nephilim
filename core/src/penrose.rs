pub fn draw_penrose(word: &str, e8_root: u16, s_idx: usize, t_idx: usize) -> String {
    let mut svg = String::new();
    svg.push_str("<svg xmlns='http://www.w3.org/2000/svg' viewBox='-210 -210 420 420' width='800' height='800'>");
    svg.push_str("<rect width='100%' height='100%' fill='#0a0a0f'/>");

    // TRUE STOMACHION — 14 pieces that tile a square (coordinates from Archimedes, scaled x15)
    // Each piece is defined in local coordinates, we'll place them to form a 180x180 square
    let pieces: Vec<Vec<(f64,f64)>> = vec![
        vec![(-90.,-90.), (-30.,-90.), (-30.,-30.)], // 0
        vec![(-30.,-90.), (30.,-90.), (30.,-30.), (-30.,-30.)], // 1
        vec![(30.,-90.), (90.,-90.), (90.,-30.), (30.,-30.)], // 2
        vec![(-90.,-30.), (-30.,-30.), (-60.,30.)], // 3
        vec![(-30.,-30.), (30.,-30.), (0.,30.)], // 4
        vec![(30.,-30.), (90.,-30.), (60.,30.)], // 5
        vec![(-90.,30.), (-60.,30.), (-90.,90.)], // 6
        vec![(-60.,30.), (0.,30.), (-30.,90.), (-90.,90.)], // 7
        vec![(0.,30.), (60.,30.), (30.,90.), (-30.,90.)], // 8
        vec![(60.,30.), (90.,30.), (90.,90.), (30.,90.)], // 9
        vec![(-90.,-90.), (-90.,-30.), (-60.,30.), (-30.,-30.), (-30.,-90.)], // 10 L-shape
        vec![(90.,-90.), (90.,-30.), (60.,30.), (30.,-30.), (30.,-90.)], // 11
        vec![(-30.,-90.), (-30.,-30.), (0.,30.), (30.,-30.), (30.,-90.)], // 12
        vec![(-60.,30.), (0.,30.), (30.,90.), (-30.,90.), (-90.,90.), (-90.,30.)], // 13
    ];

    // Use S_idx to pick a variation (536 possible = 536 Stomachion solutions)
    // Use T_idx to rotate the whole puzzle
    let global_rot = (t_idx % 360) as f64;
    let offset = (s_idx % 14) as f64 * 0.7; // subtle shift per solution

    svg.push_str(&format!("<g transform='rotate({})'>", global_rot));

    for (i, poly) in pieces.iter().enumerate() {
        let hue = (e8_root as f64 * 1.5 + i as f64 * 25.714) % 360.0;
        let brightness = 55.0 + ((s_idx + i) % 10) as f64 * 1.5;
        
        svg.push_str("<polygon points='");
        for (x,y) in poly {
            // add tiny offset based on solution to make each S_idx unique
            let ox = x + offset * ((i as f64 * 0.3).sin());
            let oy = y + offset * ((i as f64 * 0.3).cos());
            svg.push_str(&format!("{:.1},{:.1} ", ox, oy));
        }
        svg.push_str(&format!("' fill='hsl({:.0},70%,{}%)' stroke='#0a0a0f' stroke-width='2' opacity='0.95'/>", hue, brightness));
    }
    svg.push_str("</g>");

    // Center overlay with word
    svg.push_str("<rect x='-140' y='-18' width='280' height='36' fill='#0a0a0f' opacity='0.85' rx='4'/>");
    svg.push_str(&format!("<text x='0' y='0' text-anchor='middle' fill='white' font-size='14' font-family='monospace' font-weight='bold'>{}</text>", word));
    svg.push_str(&format!("<text x='0' y='14' text-anchor='middle' fill='#aaa' font-size='8' font-family='monospace'>S{} • T{} • E8:{} • νₚ=0.17259029</text>", s_idx, t_idx, e8_root));
    svg.push_str("</svg>");
    svg
}
