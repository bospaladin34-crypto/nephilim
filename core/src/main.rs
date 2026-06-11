fn main() {
    println!("{}", nephilim_core::manifold_info());
    println!("\nFirst 5 points:");
    for (i,p) in nephilim_core::generate_points(5).iter().enumerate() {
        println!("{:02}: {:.4}, {:.4}, {:.4}", i, p[0], p[1], p[2]);
    }
}
