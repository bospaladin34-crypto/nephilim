use nephilim_core::{manifold_info, generate_points, braid_word};
use std::env;
mod latent;

fn main(){
    let args: Vec<String> = env::args().collect();
    if args.len() > 1 && args[1] == "latent" {
        let word = args.get(2).cloned().unwrap_or_else(|| "consciousness".to_string());
        let s = latent::Stomachion::new();
        let t = latent::Tangram::new();
        println!("{}", latent::map_semantic_to_puzzle(&word, &s, &t));
        return;
    }
    if args.len() > 1 && args[1].parse::<usize>().is_ok() {
        let n: usize = args[1].parse().unwrap();
        println!("{}\n", manifold_info());
        println!("First {} points:", n.min(5));
        for (i,p) in generate_points(n).iter().take(5).enumerate() {
            println!("{:02}: {:.6},{:.6},{:.6}", i, p[0], p[1], p[2]);
        }
        println!("\n---CSV---\nx,y,z");
        for p in generate_points(n) { println!("{:.12},{:.12},{:.12}", p[0], p[1], p[2]); }
        println!("\n---BRAID---");
        println!("{}", braid_word(n));
    } else {
        println!("{}", manifold_info());
    }
}
